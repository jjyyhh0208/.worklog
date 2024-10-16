from rest_framework import generics, status, permissions
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.permissions import AllowAny

from dj_rest_auth.views import LoginView

from django.contrib.auth import get_user_model
from django.db import DatabaseError

from profiles.models import User
from profiles.serializers import UserUniqueIdSerializer

import logging

logger = logging.getLogger(__name__)

class UniqueIdCheck(APIView):
    permission_classes = [AllowAny]
    
    def post(self, request):
        serializer = UserUniqueIdSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        username = serializer.validated_data['username']

        try:
            User.objects.get(username=username)
            return Response({'isUnique': False}, status=status.HTTP_200_OK)
        except User.DoesNotExist:
            return Response({'isUnique': True}, status=status.HTTP_200_OK)
        
class UserDeleteView(generics.DestroyAPIView):
    permission_classes = [permissions.IsAuthenticated]

    def get_object(self):
        # 현재 로그인한 사용자 객체를 반환
        return self.request.user

    def delete(self, request, *args, **kwargs):
        try:
            user = self.get_object()
            user.delete()
            return Response({"detail": "User account deleted successfully"}, status=status.HTTP_204_NO_CONTENT)
        except DatabaseError as db_error:
            logger.error(f"DB Error: {db_error}", exc_info=True)
            return Response({
                "error": "A database error occurred. Please try again later.",
                "details": str(db_error)
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        except Exception as e:
            logger.error(f"Unexpected Error: {e}", exc_info=True)
            return Response({
                "error": "An unexpected error occurred.",
                "details": str(e)
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    
class CustomLoginView(LoginView):
    def post(self, request, *args, **kwargs):
        self.request = request
        self.serializer = self.get_serializer(data=self.request.data)
        
        if not self.serializer.is_valid():
            # 사용자가 존재하지 않는 경우를 확인
            username = self.request.data.get('username')
            User = get_user_model()
            if not User.objects.filter(username=username).exists():
                return Response({
                    'message': '회원이 존재하지 않습니다. 아이디를 확인해주세요.'
                }, status=status.HTTP_400_BAD_REQUEST)
            
            # 그 외의 경우는 기본 에러 처리를 사용
            return Response({
                'message': '로그인에 실패했습니다. 입력 정보를 확인해주세요.',
                'errors': self.serializer.errors
            }, status=status.HTTP_400_BAD_REQUEST)

        self.login()
        return self.get_response()

    def get_response(self):
        # 기존의 응답 데이터를 가져옵니다.
        original_response = super().get_response()
        
        # success와 message 필드를 추가합니다.
        original_response.data['message'] = '로그인 성공'
        return original_response