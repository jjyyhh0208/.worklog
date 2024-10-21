from django.db import DatabaseError
from django.core.exceptions import ValidationError
from django.db.models import Q
from django.shortcuts import get_object_or_404

from rest_framework import generics, status
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework.views import APIView

from profiles.models import User
from profiles.serializers import (
    FriendSerializer, UserSearchResultSerializer
)

import logging

#로거 정의
logger = logging.getLogger('django')

# GET: 유저명에 맞는 친구목록을 불러옵니다.    
class UserFriendView(generics.GenericAPIView):
    queryset = User.objects.all()
    serializer_class = FriendSerializer
    permission_classes = []

    def get(self, request, username):
        try:
            user = User.objects.get(username=username)
            friends = user.friends.all()
            serializer = self.get_serializer(friends, many=True)
            return Response(serializer.data, status=status.HTTP_200_OK)

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
    
# 유저ID 찾기
class UserSearchView(APIView):
    permission_classes = []

    def get(self, request):
        try:
            query = request.query_params.get('q', '')
            if not query:
                logger.warning("Query parameter 'q' is missing.")
                return Response({"detail": "Query parameter 'q' is required."}, status=status.HTTP_400_BAD_REQUEST)

            users = User.objects.filter(
                Q(username__icontains=query) | Q(name__icontains=query)
            )

            if not users.exists():
                return Response({"detail": "No users found."}, status=status.HTTP_404_NOT_FOUND)

            serializer = UserSearchResultSerializer(users, many=True)
            return Response(serializer.data, status=status.HTTP_200_OK)

        except DatabaseError as db_error:
            logger.error(f"Database error occurred during user search: {db_error}", exc_info=True)
            return Response({
                "error": "A database error occurred.",
                "details": str(db_error)
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

        except Exception as e:
            logger.error(f"An unexpected error occurred during user search: {e}", exc_info=True)
            return Response({
                "error": "An unexpected error occurred.",
                "details": str(e)
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    
class FollowFriendView(generics.GenericAPIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, *args, **kwargs):
        user = request.user
        friend_name = request.data.get('friend_name')
        
        if not friend_name:
            return Response({"detail": "Friend name is required."}, status=status.HTTP_400_BAD_REQUEST)

        try:
            friend = get_object_or_404(User, username=friend_name)
            
            # 자기 자신을 팔로우하는 것을 막음
            if friend == user:
                return Response({"detail": "You cannot follow yourself."}, status=status.HTTP_400_BAD_REQUEST)

            user.friends.add(friend)
            return Response({"detail": f"You are now following {friend.username}"}, status=status.HTTP_200_OK)

        except User.DoesNotExist:
            return Response({"detail": "User not found."}, status=status.HTTP_404_NOT_FOUND)

        except DatabaseError as db_error:
            logger.error(f"Database error occurred while following friend: {db_error}", exc_info=True)
            return Response({
                "error": "A database error occurred.",
                "details": str(db_error)
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

        except ValidationError as v_error:
            logger.error(f"Validation error occurred: {v_error}", exc_info=True)
            return Response({
                "error": "Validation error occurred.",
                "details": str(v_error)
            }, status=status.HTTP_400_BAD_REQUEST)

        except Exception as e:
            logger.error(f"An unexpected error occurred: {e}", exc_info=True)
            return Response({
                "error": "An unexpected error occurred.",
                "details": str(e)
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    

class UnfollowFriendView(generics.GenericAPIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, *args, **kwargs):
        user = request.user
        friend_name = request.data.get('friend_name')
        
        if not friend_name:
            return Response({"detail": "Friend name is required."}, status=status.HTTP_400_BAD_REQUEST)

        try:
            friend = get_object_or_404(User, username=friend_name)
            
            # 자기 자신을 언팔로우하는 것을 방지
            if friend == user:
                return Response({"detail": "You cannot unfollow yourself."}, status=status.HTTP_400_BAD_REQUEST)

            user.friends.remove(friend)
            return Response({"detail": f"You have unfollowed {friend.username}"}, status=status.HTTP_200_OK)

        except User.DoesNotExist:
            return Response({"detail": "User not found."}, status=status.HTTP_404_NOT_FOUND)

        except DatabaseError as db_error:
            logger.error(f"Database error occurred while unfollowing friend: {db_error}", exc_info=True)
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
