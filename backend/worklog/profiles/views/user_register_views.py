from django.db import DatabaseError
from django.shortcuts import get_object_or_404
from django.utils import timezone

from rest_framework import generics, status
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.exceptions import NotAuthenticated


from profiles.models import User, LongQuestion, Feedback
from profiles.serializers import (
    UserProfileSerializer, LongQuestionSerializer
)

from datetime import timedelta
import logging

logger = logging.getLogger('django')

# 현재 로그인된 유저의 프로필을 불러오는 View
class UserCurrentProfileView(generics.RetrieveAPIView):
    queryset = User.objects.all()
    serializer_class = UserProfileSerializer
    permission_classes = [IsAuthenticated]
    
    def get_object(self):
        try:
            if not self.request.user.is_authenticated:
                raise NotAuthenticated("User is not authenticated")

            return self.request.user
        
        except DatabaseError as db_error:
            logger.error(f"Database error occurred: {db_error}", exc_info=True)
            return Response({
                "error": "A database error occurred.",
                "details": str(db_error)
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

        except Exception as e:
            logger.error(f"An unexpected error occurred: {e}", exc_info=True)
            return Response({
                "error": "An unexpected error occurred.",
                "details": str(e)
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    
#유저 프로필을 불러오는 View
class UserProfileView(generics.RetrieveAPIView):
    permission_classes = [AllowAny]
    queryset = User.objects.all()
    serializer_class = UserProfileSerializer
    lookup_field = 'username'

    def retrieve(self, request, *args, **kwargs):
        try:
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

        except User.DoesNotExist:
            return Response({
                "error": "User not found."
            }, status=status.HTTP_404_NOT_FOUND)

        except DatabaseError as db_error:
            logger.error(f"Database error occurred: {db_error}", exc_info=True)
            return Response({
                "error": "A database error occurred.",
                "details": str(db_error)
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

        except Exception as e:
            logger.error(f"An unexpected error occurred: {e}", exc_info=True)
            return Response({
                "error": "An unexpected error occurred.",
                "details": str(e)
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    
# GET: user 명에 맞는 서술형 질문 목록을 불러옵니다.
class UserLongQuestionView(generics.ListAPIView):
    serializer_class = LongQuestionSerializer
    permission_classes = [AllowAny]

    def get_queryset(self):
        try:
            username = self.kwargs['username']
            user = get_object_or_404(User, username=username)
            return LongQuestion.objects.filter(user__isnull=True) | LongQuestion.objects.filter(user=user)

        except User.DoesNotExist:
            return Response({
                "error": "User not found."
            }, status=status.HTTP_404_NOT_FOUND)

        except DatabaseError as db_error:
            logger.error(f"Database error occurred: {db_error}", exc_info=True)
            return Response({
                "error": "A database error occurred.",
                "details": str(db_error)
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

        except Exception as e:
            logger.error(f"An unexpected error occurred: {e}", exc_info=True)
            return Response({
                "error": "An unexpected error occurred.",
                "details": str(e)
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)    