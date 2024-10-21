from django.db import DatabaseError

from rest_framework import viewsets, status
from rest_framework.generics import ListAPIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticatedOrReadOnly

from profiles.models import WorkStyle, Interest, ShortQuestion, LongQuestion
from profiles.serializers import (
    WorkStyleSerializer, InterestSerializer,
    ShortQuestionSerializer, LongQuestionSerializer, 
)

import logging

#로거 정의
logger = logging.getLogger('django')

#업무 성향을 유저에게 제공하는 ViewSet
class WorkStyleView(ListAPIView):
    serializer_class = WorkStyleSerializer
    permission_classes = []
    
    def get_queryset(self):
        try:
            return WorkStyle.objects.all()
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

    
    
#관심 직종을 유저에게 제공하는 ViewSet
class InterestView(ListAPIView):
    serializer_class = InterestSerializer
    permission_classes = []
    
    def get_queryset(self):
        try:
            return Interest.objects.all()
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
    
#읽기 전용으로 함으로써 get 메서드만 허용
class ShortQuestionView(ListAPIView):
    serializer_class = ShortQuestionSerializer
    permission_classes = [IsAuthenticatedOrReadOnly]
    
    def get_queryset(self):
        try:
            return ShortQuestion.objects.all()
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

#유저가 질문하고 싶은 내용 추가가능
class LongQuestionViewSet(viewsets.ModelViewSet):
    queryset = LongQuestion.objects.all()
    serializer_class = LongQuestionSerializer
    permission_classes = [IsAuthenticatedOrReadOnly]