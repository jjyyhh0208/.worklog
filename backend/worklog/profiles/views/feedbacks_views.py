from rest_framework import viewsets, status
from rest_framework.response import Response
from rest_framework.permissions import AllowAny

from django.utils import timezone

from profiles.models import Feedback
from profiles.serializers import (
    FeedbackSerializer,
)

import logging

#로거 정의
logger = logging.getLogger('django')

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