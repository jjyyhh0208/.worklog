from django.shortcuts import redirect
from django.utils.datastructures import MultiValueDictKeyError
from django.http import JsonResponse

from rest_framework import generics, mixins
from rest_framework.permissions import AllowAny
from rest_framework.authtoken.models import Token

from profiles.models import User

import os
import jwt
import datetime
import requests
from decouple import config
import logging
import os

#로거 정의
logger = logging.getLogger('django')


SECRET_KEY = config('SECRET_KEY', default='fallback_secret_key')  
BASE_URL = config('BASE_URL', default='http://localhost:8000')
REACT_APP_BASE_URL = config('REACT_APP_BASE_URL', default='http://localhost:8000')
    
## 카카오 관련 URI
KAKAO_TOKEN_API = "https://kauth.kakao.com/oauth/token"
KAKAO_USER_API = "https://kapi.kakao.com/v2/user/me"
KAKAO_CALLBACK_URI = BASE_URL + "/profiles/auth/kakao/callback"
REACT_APP_REDIRECT_URL = REACT_APP_BASE_URL + "login/redirect"

# 카카오 인가 과정 STEP 1: react에서 'code'를 받아서 카카오에 회원정보를 요청한다.
class KakaoLoginCallback(generics.GenericAPIView, mixins.ListModelMixin):
    permission_classes = [AllowAny]
    def get(self, request, *args, **kwargs):
        next_url = request.GET.get('next', REACT_APP_BASE_URL + '/signup')  
        def redirect_to_next():
            error_url = f"{next_url}?error=true"
            return redirect(error_url)
        
        try: # STEP 1-1. code를 가져온다.
            code = request.GET["code"]
        except MultiValueDictKeyError: # code가 없다면 오류 발생
            return redirect_to_next()
        # STEP 1-2. code를 활용해서 access token을 받아온다.
        data = {
          "grant_type": "authorization_code",
          "client_id": os.getenv('SOCIAL_AUTH_KAKAO_CLIENT_ID'),
          "redirect_uri": KAKAO_CALLBACK_URI,
          "code": code,
        }
        token_response = requests.post(KAKAO_TOKEN_API, data=data).json()
        access_token = token_response.get('access_token')
        if not access_token: # access token이 없다면 오류 발생
            return redirect_to_next()

        # STEP 1-3. access token을 활용해서 사용자 정보를 불러옴.
        headers = {"Authorization": f"Bearer ${access_token}"}
        user_info_response = requests.get(KAKAO_USER_API, headers=headers)
        if user_info_response.status_code != 200: # 사용자 정보가 없다면 오류 발생
            return redirect_to_next()
        user_information = user_info_response.json()
        kakao_account = user_information.get('kakao_account')
        kakao_id = 'kakao_' + str(user_information.get('id'))
        if not kakao_id:
            return redirect_to_next()
        nickname = kakao_account.get('profile', {}).get('nickname')
        # 중간 테스트용 코드: return Response(kakao_account, status=status.HTTP_200_OK)

        # STEP2. 사용자 정보를 활용하여 내부 로그인 구현
        # 우리의 key 값은 username임 (kakao에서의 nickname을 활용)
        
        try:
            user = User.objects.get(username=kakao_id)
            is_new = False
        except User.DoesNotExist:
            try:
                user = User.objects.create(username=kakao_id, name=nickname)
                user.set_unusable_password()
                user.save()
                is_new = True
            except Exception as e:
                return redirect_to_next()
        token, created = Token.objects.get_or_create(user=user)
        # JWT 토큰 생성
        payload = {
            'token': token.key,
            'is_new': is_new,
            'exp': datetime.datetime.utcnow() + datetime.timedelta(minutes=5)  # 5분 유효
        }
        one_time_code = jwt.encode(payload, SECRET_KEY, algorithm='HS256')
        
        redirect_url = f"{REACT_APP_REDIRECT_URL}?code={one_time_code}"
        return redirect(redirect_url)

def get_token(request):
    next_url = request.GET.get('next', REACT_APP_BASE_URL)  # Default to base URL if no next parameter is provided
    code = request.GET.get('code')
    try:
        payload = jwt.decode(code, SECRET_KEY, algorithms=['HS256'])
        data = {'token': payload['token'], 'is_new': payload['is_new']}
        return JsonResponse(data)
    except jwt.ExpiredSignatureError:
        return redirect(next_url)
    except jwt.InvalidTokenError:
        return redirect(next_url)