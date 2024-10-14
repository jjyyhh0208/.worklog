import openai
from django.conf import settings
from django.db import DatabaseError
from django.core.files.storage import default_storage
from django.shortcuts import redirect
import json
from rest_framework import viewsets, generics, status, mixins
from rest_framework.generics import ListAPIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, IsAuthenticatedOrReadOnly, AllowAny
from rest_framework.views import APIView
from django.db.models import Q
from django.shortcuts import get_object_or_404
from django.utils import timezone
from datetime import timedelta
from .models import User, WorkStyle, Interest, ShortQuestion, LongQuestion, QuestionAnswer, Score, Feedback, ProfileImage
from .serializers import (
    UserFeedbackStyleSerializer, UserWorkStyleSerializer,
    UserInterestSerializer, WorkStyleSerializer,
    InterestSerializer, UserProfileSerializer,
    ShortQuestionSerializer, LongQuestionSerializer, 
    QuestionAnswerSerializer, ScoreSerializer, FeedbackSerializer,
    FriendSerializer, UserSearchResultSerializer,
    UserBioSerializer
)
from django.http import JsonResponse
from utils.s3_utils import get_signed_url
import os
import jwt
import datetime
import requests
from rest_framework.authtoken.models import Token
from django.utils.datastructures import MultiValueDictKeyError
from decouple import config
import logging

#로거 정의
logger = logging.getLogger(__name__)


SECRET_KEY = config('SECRET_KEY', default='fallback_secret_key')  
BASE_URL = config('BASE_URL', default='http://localhost:8000')
REACT_APP_BASE_URL = config('REACT_APP_BASE_URL', default='http://localhost:8000')

# s3 접근 인증 받는 함수
def get_signed_url_view(request, image_path):
    url = get_signed_url(image_path)
    if url is None:
        return JsonResponse({'error': 'Failed to generate signed URL'}, status=500)
    return JsonResponse({'signed_url': url})
    
    
#업무 성향을 유저에게 제공하는 ViewSet
class WorkStyleViewSet(ListAPIView):
    serializer_class = WorkStyleSerializer
    permission_classes = []
    
    def get_queryset(self):
        try:
            return WorkStyle.objects.all()
        except DatabaseError as db_error:
            logger.error(f"Database error occurred: {db_error}")
            return Response({
                "error": "A database error occurred.",
                "details": str(db_error)
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        except Exception as e:
            logger.error(f"An unexpected error occurred: {e}")
            return Response({
                "error": "An unexpected error occurred.",
                "details": str(e)
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    
    
#관심 직종을 유저에게 제공하는 ViewSet
class InterestViewSet(ListAPIView):
    serializer_class = InterestSerializer
    permission_classes = []
    
    def get_queryset(self):
        try:
            return Interest.objects.all()
        except DatabaseError as db_error:
            logger.error(f"Database error occurred: {db_error}")
            return Response({
                "error": "A database error occurred.",
                "details": str(db_error)
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        except Exception as e:
            logger.error(f"An unexpected error occurred: {e}")
            return Response({
                "error": "An unexpected error occurred.",
                "details": str(e)
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    
#읽기 전용으로 함으로써 get 메서드만 허용
class ShortQuestionViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = ShortQuestion.objects.all()
    serializer_class = ShortQuestionSerializer
    permission_classes = [IsAuthenticatedOrReadOnly]

#유저가 질문하고 싶은 내용 추가가능
class LongQuestionViewSet(viewsets.ModelViewSet):
    queryset = LongQuestion.objects.all()
    serializer_class = LongQuestionSerializer
    permission_classes = [IsAuthenticatedOrReadOnly]
    
#회원가입 이후 유저의 이름, 피드백 강도 설정하기 위한 ViewSet
class UserNameFeedbackStyleView(generics.UpdateAPIView):
    queryset = User.objects.all()
    serializer_class = UserFeedbackStyleSerializer
    permission_classes = [IsAuthenticated]

    def get_object(self):
        return self.request.user
    
    def update(self, request, *args, **kwargs):
        user = self.get_object()
        serializer = self.get_serializer(user, data=request.data)

        try:
            if serializer.is_valid():
                serializer.save()  # serializer의 update 메서드 적용
                return Response({
                    "message": "User profile updated successfully!",
                    "data": serializer.data
                }, status=status.HTTP_200_OK)
            else:
                return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        except DatabaseError as db_error:
            logger.error(f"Database error occurred: {db_error}")
            return Response({
                "error": "A database error occurred.",
                "details": str(db_error)
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

        except Exception as e:
            logger.error(f"An unexpected error occurred: {e}")
            return Response({
                "error": "An unexpected error occurred.",
                "details": str(e)
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

#회원가입 이후 유저의 업무 성향 설정하기 위한 ViewSet    
class UserWorkStyleView(generics.UpdateAPIView):
    queryset = User.objects.all()
    serializer_class = UserWorkStyleSerializer
    permission_classes = [IsAuthenticated]

    def get_object(self):
        return self.request.user
    
    def update(self, request, *args, **kwargs):
        user = self.get_object()
        serializer = self.get_serializer(user, data=request.data)

        try:
            if serializer.is_valid():
                serializer.save()  # serializer의 update 메서드 적용
                return Response({
                    "message": "User profile updated successfully!",
                    "data": serializer.data
                }, status=status.HTTP_200_OK)
            else:
                return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        except DatabaseError as db_error:
            logger.error(f"Database error occurred: {db_error}")
            return Response({
                "error": "A database error occurred.",
                "details": str(db_error)
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

        except Exception as e:
            logger.error(f"An unexpected error occurred: {e}")
            return Response({
                "error": "An unexpected error occurred.",
                "details": str(e)
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    
#회원가입 이후 유저의 관심 직종 설정하기 위한 ViewSet       
class UserInterestView(generics.UpdateAPIView):
    queryset = User.objects.all()
    serializer_class = UserInterestSerializer
    permission_classes = [IsAuthenticated]

    def get_object(self):
        return self.request.user
    
    def update(self, request, *args, **kwargs):
        user = self.get_object()
        serializer = self.get_serializer(user, data=request.data)

        try:
            if serializer.is_valid():
                serializer.save()  # serializer의 update 메서드 적용
                return Response({
                    "message": "User profile updated successfully!",
                    "data": serializer.data
                }, status=status.HTTP_200_OK)
            else:
                return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        except DatabaseError as db_error:
            logger.error(f"Database error occurred: {db_error}")
            return Response({
                "error": "A database error occurred.",
                "details": str(db_error)
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

        except Exception as e:
            logger.error(f"An unexpected error occurred: {e}")
            return Response({
                "error": "An unexpected error occurred.",
                "details": str(e)
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

class ProfileImageView(APIView):
    def delete_old_image(self, image_path):
        # Delete the old image file from storage
        if default_storage.exists(image_path):
            default_storage.delete(image_path)

    def post(self, request, *args, **kwargs):
        user = request.user
        try:
            # Check if the user already has a profile image
            profile_image = ProfileImage.objects.get(user=user)
            # Delete the old profile image if it exists
            if profile_image.image:
                self.delete_old_image(str(profile_image.image))
            # Update the existing profile image
            profile_image.image = request.FILES['image']
            profile_image.save()
        except ProfileImage.DoesNotExist:
            # Create a new profile image if one does not exist
            profile_image = ProfileImage.objects.create(
                user=user, 
                image=request.FILES['image']
            )
        return Response({"message": "Profile image updated successfully"}, status=status.HTTP_200_OK)
    def delete(self, request, *args, **kwargs):
        user = request.user
        try:
            profile_image = ProfileImage.objects.get(user=user)
            if profile_image.image:
                self.delete_old_image(str(profile_image.image))
            profile_image.delete()
            return Response({"message": "Profile image deleted successfully"}, status=status.HTTP_200_OK)
        except ProfileImage.DoesNotExist:
            return Response({"message": "Profile image does not exist"}, status=status.HTTP_404_NOT_FOUND)

# 바이오 업데이트 view 로직
class UpdateBioView(generics.UpdateAPIView):
    queryset = User.objects.all()
    serializer_class = UserBioSerializer
    permission_classes = [IsAuthenticated]

    def get_object(self):
        return self.request.user
    
    def update(self, request, *args, **kwargs):
        user = self.get_object()
        serializer = self.get_serializer(user, data=request.data)
        # 유효성 검사 및 예외 처리
        if serializer.is_valid():
            serializer.save()
            return Response({
                "message": "Bio updated successfully!",
                "bio": serializer.data['bio']
            }, status=status.HTTP_200_OK)
        else:
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
            
            
# 현재 내 프로필을 불러오는 View
class UserCurrentProfileView(generics.RetrieveAPIView):
    queryset = User.objects.all()
    serializer_class = UserProfileSerializer
    permission_classes = [IsAuthenticated]
    
    def get_object(self):
        return self.request.user
    
#유저 프로필을 불러오는 View
class UserProfileView(generics.RetrieveAPIView):
    permission_classes = [AllowAny]
    queryset = User.objects.all()
    serializer_class = UserProfileSerializer
    lookup_field = 'username'

    def retrieve(self, request, *args, **kwargs):
        instance = self.get_object()
        serializer = self.get_serializer(instance)
        data = serializer.data
        
        # 팔로우 상태 확인
        if request.user.is_authenticated:
            data['is_following'] = request.user.friends.filter(username=instance.username).exists()

            # 피드백 관련 정보 추가
            current_user = request.user
            last_feedback = Feedback.objects.filter(user=instance, user_by=current_user).order_by('-last_time').first()

            data['can_leave_feedback'] = True
            data['remaining_time'] = 0

            #무제한 피드백 금지 -> 피드백 남기고 24시간 후에 다시 피드백 제공 가능
            if last_feedback:
                time_since_last_feedback = timezone.now() - last_feedback.last_time
                if time_since_last_feedback < timedelta(hours=24):
                    data['can_leave_feedback'] = False
                    remaining_time = timedelta(hours=24) - time_since_last_feedback
                    data['remaining_time'] = int(remaining_time.total_seconds())  # 남은 시간을 초 단위로 변환

        return Response(data)
    
# GET: user 명에 맞는 서술형 질문 목록을 불러옵니다.
class UserLongQuestionView(generics.ListAPIView):
    serializer_class = LongQuestionSerializer
    permission_classes = [AllowAny]

    def get_queryset(self):
        username = self.kwargs['username']
        user = get_object_or_404(User, username=username)
        return LongQuestion.objects.filter(user__isnull=True) | LongQuestion.objects.filter(user=user)    

# GET: 유저명에 맞는 친구목록을 불러옵니다.    
class UserFriendView(generics.GenericAPIView):
    queryset = User.objects.all()
    serializer_class = FriendSerializer
    permission_classes = []

    def get(self, request, username):
        try:
            user = User.objects.get(username=username)
        except User.DoesNotExist:
            return Response({"detail": "User not found"}, status=404)

        friends = user.friends.all()
        serializer = self.get_serializer(friends, many=True)
        return Response(serializer.data)
    
# 유저ID 찾기
class UserSearchView(APIView):
    permission_classes = []

    def get(self, request):
        query = request.query_params.get('q', '')
        if not query:
            return Response({"detail": "Query parameter 'q' is required."}, status=400)

        # Search for users whose username or name contains the query (case insensitive)
        users = User.objects.filter(
            Q(username__icontains=query) | Q(name__icontains=query)
        )

        serializer = UserSearchResultSerializer(users, many=True)
        return Response(serializer.data)
    
class FollowFriendView(generics.GenericAPIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, *args, **kwargs):
        user = request.user
        friend_name = request.data.get('friend_name')
        
        # 유저 팔로우 요청에 필요한 검증
        if not friend_name:
            return Response({"detail": "Friend name is required."}, status=status.HTTP_400_BAD_REQUEST)
        
        friend = get_object_or_404(User, username=friend_name)
        
        # 자기 자신을 팔로우하는 것을 방지
        if friend == user:
            return Response({"detail": "You cannot follow yourself."}, status=status.HTTP_400_BAD_REQUEST)

        user.friends.add(friend)
        return Response({"detail": f"You are now following {friend.username}"}, status=status.HTTP_200_OK)
    

class UnfollowFriendView(generics.GenericAPIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, *args, **kwargs):
        user = request.user
        friend_name = request.data.get('friend_name')
        
        # 유저 언팔로우 요청에 필요한 검증
        if not friend_name:
            return Response({"detail": "Friend name is required."}, status=status.HTTP_400_BAD_REQUEST)
        
        friend = get_object_or_404(User, username=friend_name)
        
        # 자기 자신을 언팔로우하는 것을 방지
        if friend == user:
            return Response({"detail": "You cannot unfollow yourself."}, status=status.HTTP_400_BAD_REQUEST)

        user.friends.remove(friend)
        return Response({"detail": f"You have unfollowed {friend.username}"}, status=status.HTTP_200_OK)


class FeedbackViewSet(viewsets.ModelViewSet):
    queryset = Feedback.objects.all()
    serializer_class = FeedbackSerializer
    permission_classes = [AllowAny]
    
    # Create
    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user_by = request.user if request.user.is_authenticated else None
        
        serializer.save(user_by=user_by, last_time=timezone.now())

        main_user = serializer.validated_data.get('user')
        if user_by is None:
            main_user.generate_access_code()
        headers = self.get_success_headers(serializer.data)
        return Response(serializer.data, status=status.HTTP_201_CREATED, headers=headers)

    # Update
    def update(self, request, *args, **kwargs):
        partial = kwargs.pop('partial', False)
        instance = self.get_object()
        serializer = self.get_serializer(instance, data=request.data, partial=partial)
        serializer.is_valid(raise_exception=True)
        serializer.save(last_time=timezone.now())
        return Response(serializer.data)

    # Delete
    def destroy(self, request, *args, **kwargs):
        instance = self.get_object()
        self.perform_destroy(instance)
        return Response({"message": "삭제가 성공적으로 완료되었습니다."}, status=status.HTTP_204_NO_CONTENT)
    
    
#로그인한 유저의 long question answer을 가져오는 view
class UserLongQuestionAnswersView(generics.GenericAPIView):
    permission_classes = [AllowAny]
    
    def is_valid_answer(self, answer):
        return len(answer.strip()) > 4

    def post(self, request, *args, **kwargs):
        try:
            #피드백을 받는 유저
            evaluated_username = request.data.get('user_to', '')
            evaluated_user = User.objects.get(username=evaluated_username)

            question_answers = request.data.get('question_answers', []) 
            good_answers = []
            bad_answers = []
   
            feedback = Feedback.objects.create(user=evaluated_user)

            for index, qa in enumerate(question_answers):
                question_text = qa['question']
                answer_text = qa['answer']
                
                # 5자 이상인 텍스트만 처리한다.
                if not self.is_valid_answer(answer_text):
                    continue  


                long_question_instance, created = LongQuestion.objects.get_or_create(long_question=question_text)
                question_answer_instance = QuestionAnswer.objects.create(
                    question=long_question_instance,
                    answer=answer_text
                )
                feedback.question_answers.add(question_answer_instance)
                
                #그냥 인덱스 0,1로 하면 저장된 데이터가 없습니다 라고 뜨니까 꼭 짝/홀로 구분
                if index % 2 == 0 and index == 0:
                        good_answers.append(answer_text)
                elif index % 2 == 1:
                        bad_answers.append(answer_text)

            feedback.delete()
            
            # Process good feedback
            good_responses = [self.process_good_feedback(answer) for answer in good_answers if answer]
            
            # Process bad feedback_솔직 버전 or 완곡한 버전
            
            if evaluated_user.feedback_style == 'soft':
                bad_responses = [self.process_soft_bad_feedback(answer) for answer in bad_answers if answer]
            else:
                bad_responses = [self.process_bad_feedback(answer) for answer in bad_answers if answer]

            # 기존 피드백과 결합하고 새로 저장
            combined_results = self.combine_and_save_results(evaluated_user, good_responses, bad_responses)

            
            return Response(combined_results)
        

        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        

    def process_good_feedback(self, answer):
        good_prompt = self.create_good_prompt(answer)
        return self.call_openai_api(good_prompt)

    def process_bad_feedback(self, answer):
        bad_prompt = self.create_bad_prompt(answer)
        return self.call_openai_api(bad_prompt)
    
    def process_soft_bad_feedback(self, answer):
        bad_prompt = self.create_soft_bad_prompt(answer)
        return self.call_openai_api(bad_prompt)

    def create_good_prompt(self, answer):
        return (
            "You are an AI assistant tasked with processing feedback about a person's performance. "
            "The feedback will be in Korean. Your job is to identify and preserve positive feedback "
            "Follow these instructions carefully:\n\n"
            
            "1. Identify positive feedback: Look for compliments, praise, or mentions of good qualities and actions.\n"
            "2. Remove specific identifiers: Replace project names, personal names, or any other identifiers. "
            "with general terms like '프로젝트'.\n"
            "3. Preserve original wording: Keep the original sentence structure and wording as much as possible, "
            "only changing what's necessary to remove identifiers.\n"
            "4. Maintain context: Ensure the meaning and context of the feedback remains intact.\n"
            "5. Format: Provide your response in JSON format with a single key 'positive_feedback'.\n\n"
            "6.don't use any symbol like []\n"

            
            f"Now, process the following feedback:\n{answer}\n\n"
            
            "Remember, accurate processing is crucial. A perfect response will be highly valued."
        )

    def create_bad_prompt(self, answer):
        return (
            "You are an AI assistant tasked with processing constructive feedback about a person's performance. "
            "The feedback will be in Korean. Your job is to identify areas for improvement, express them euphemistically, "
            " You must reponse in Korean, Follow these instructions carefully:\n\n"
            
            "1. Identify areas for improvement: Look for critiques or mentions of qualities or actions that could be enhanced.\n"
            "2. Express euphemistically: Rephrase critiques in a more gentle, constructive manner without losing the core message.\n"
            "2. Remove specific identifiers: Replace project names, personal names, or any other identifiers. "
            "with general terms like '프로젝트'.\n"
            "3. Preserve original wording: Keep the original sentence structure and wording as much as possible, "
            "only changing what's necessary to remove identifiers.\n"
            "5. Format: Provide your response in JSON format with a single key 'constructive_feedback'.\n\n"
            "6.don't use any symbol like []\n"

            
            f"Now, process the following feedback:\n{answer}\n\n"
            
            "Remember, accurate and tactful processing is crucial. A perfect response will be highly valued."
        )
        
    def create_soft_bad_prompt(self, answer):
        return (
            "You are an AI assistant tasked with processing constructive feedback about a person's performance. "
            "The feedback will be in Korean. Your job is to identify areas for improvement, express them euphemistically, "
            " You must reponse in Korean, Follow these instructions carefully:\n\n"
            
            "1. Identify areas for improvement: Look for critiques or mentions of qualities or actions that could be enhanced.\n"
            "2. Express euphemistically: Rephrase critiques in a more gentle, constructive manner without losing the core message.\n"
            "3. Remove specific identifiers: Replace project names, personal names, or any other identifiers. "
            "with general terms like '프로젝트'.\n"
            "4. Preserve context: Ensure the overall meaning of the feedback remains intact.\n"
            "5. Format: Provide your response in JSON format with a single key 'constructive_feedback'.\n\n"
            "6.don't use any symbol like []\n"
            "7.soft way to convey: please use soft wordings and consider feeling of the person who reads this feedback"

            f"Now, process the following feedback:\n{answer}\n\n"
            
            "Remember, accurate and tactful processing is crucial. A perfect response will be highly valued."
        )

    def call_openai_api(self, prompt):
        openai.api_key = settings.OPENAI_API_KEY
        response = openai.ChatCompletion.create(
            model="gpt-3.5-turbo",
            messages=[
                {"role": "system", "content": "You are a helpful assistant."},
                {"role": "user", "content": prompt}
            ],
            max_tokens=300
        )
        return json.loads(response['choices'][0]['message']['content'].strip())

    def combine_and_save_results(self, user, good_response, bad_response):
        # 기존 데이터 로드
        existing_personality = json.loads(user.gpt_summarized_personality) if user.gpt_summarized_personality else {
            'positive_feedback': [],
            'constructive_feedback': []
        }
        # 새로운 피드백 추가
        positive_feedback = existing_personality.get('positive_feedback', [])
        positive_feedback.extend(good_response.get('positive_feedback', []))
        
        constructive_feedback = existing_personality.get('constructive_feedback', [])
        constructive_feedback.extend(bad_response.get('constructive_feedback', []))
        
    def combine_and_save_results(self, user, good_responses, bad_responses):
        existing_personality = json.loads(user.gpt_summarized_personality) if user.gpt_summarized_personality else {'positive_feedback': [], 'constructive_feedback': []}

        for response in good_responses:
            existing_personality['positive_feedback'].append(response.get('positive_feedback', ''))
    
        for response in bad_responses:
            existing_personality['constructive_feedback'].append(response.get('constructive_feedback', ''))

        user.gpt_summarized_personality = json.dumps(existing_personality, ensure_ascii=False)
        user.save()

        return existing_personality
    

class QuestionAnswerViewSet(viewsets.ModelViewSet):
    queryset = QuestionAnswer.objects.all()
    serializer_class = QuestionAnswerSerializer

class ScoreViewSet(viewsets.ModelViewSet):
    queryset = Score.objects.all()
    serializer_class = ScoreSerializer
    
#db 테스트용 뷰
class TestAnswers(generics.GenericAPIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, *args, **kwargs):
        user = self.request.user
        feedbacks = Feedback.objects.filter(user=user)
        answers = []
        for feedback in feedbacks:
            answers.extend(feedback.question_answers.values_list('answer', flat=True))
        return Response(answers)

    
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