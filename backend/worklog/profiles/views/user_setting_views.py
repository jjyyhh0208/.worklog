from django.db import DatabaseError
from django.core.exceptions import ValidationError
from django.core.files.storage import default_storage

from rest_framework import generics, status
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework.views import APIView
from rest_framework.exceptions import ParseError

from profiles.models import User, ProfileImage
from profiles.serializers import (
    UserFeedbackStyleSerializer, UserWorkStyleSerializer, UserInterestSerializer,
    UserBioSerializer,
)

import logging


logger = logging.getLogger('django')

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
            

class ProfileImageView(APIView):
    def delete_old_image(self, image_path):
        # Delete the old image file from storage
        if default_storage.exists(image_path):
            try:
                default_storage.delete(image_path)
            except Exception as e:
                logger.error(f"Error deleting image: {e}", exc_info=True)
                raise ParseError("Failed to delete the old profile image.")

    def post(self, request, *args, **kwargs):
        user = request.user
        try:            
            profile_image = ProfileImage.objects.get(user=user)
            #유저가 이미 프사가 있으면 삭제 먼저 해버리기
            if profile_image.image:
                self.delete_old_image(str(profile_image.image))
            profile_image.image = request.FILES['image']
            profile_image.save()
            
        except ProfileImage.DoesNotExist:
            try:
                profile_image = ProfileImage.objects.create(
                    user=user,
                    image=request.FILES['image']
                )
            except ValidationError as ve:
                logger.error(f"Validation error: {ve}", exc_info=True)
                return Response({"message": "Invalid image file"}, status=status.HTTP_400_BAD_REQUEST)
            except DatabaseError as db_error:
                logger.error(f"Database error: {db_error}", exc_info=True)
                return Response({
                    "error": "A database error occurred.",
                    "details": str(db_error)
                }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
            except Exception as e:
                logger.error(f"Unexpected error: {e}", exc_info=True)
                return Response({
                    "error": "An unexpected error occurred.",
                    "details": str(e)
                }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

        except ParseError as parse_error:
            logger.error(f"Parse error: {parse_error}", exc_info=True)
            return Response({"error": str(parse_error)}, status=status.HTTP_400_BAD_REQUEST)

        except Exception as e:
            logger.error(f"Unexpected error 1st step: {e}", exc_info=True)
            print(f"Exception caught: {e}")
            return Response({
                "error": "An unexpected error occurred during 1st step",
                "details": str(e)
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

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
        except DatabaseError as db_error:
            logger.error(f"Database error: {db_error}", exc_info=True)
            return Response({
                "error": "A database error occurred.",
                "details": str(db_error)
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        except Exception as e:
            logger.error(f"Unexpected error: {e}", exc_info=True)
            return Response({
                "error": "An unexpected error occurred.",
                "details": str(e)
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

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
        try:
            if serializer.is_valid():
                serializer.save()
                return Response({
                    "message": "Bio updated successfully!",
                    "bio": serializer.data['bio']
                }, status=status.HTTP_200_OK)
            else:
                return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        except ValidationError as ve:
            logger.error(f"Validation error: {ve}", exc_info=True)
            return Response({
                "error": "Invalid data.",
                "details": str(ve)
            }, status=status.HTTP_400_BAD_REQUEST)

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