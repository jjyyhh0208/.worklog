from rest_framework import viewsets, generics, status
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, IsAuthenticatedOrReadOnly
from rest_framework.decorators import action
from rest_framework.views import APIView
from django.db.models import Q
from django.shortcuts import get_object_or_404
from dj_rest_auth.views import LoginView
from dj_rest_auth.registration.views import RegisterView
from .models import User, WorkStyle, Interest, ShortQuestion, LongQuestion, QuestionAnswer, Score, Feedback, DISCData
from .permissions import UnauthenticatedReadOrSafeMethods
from .serializers import (
    UserGenderNameAgeSerializer, UserWorkStyleSerializer,
    UserInterestSerializer, WorkStyleSerializer,
    InterestSerializer, UserRegisterSerializer,
    UserProfileSerializer, UserUniqueIdSerializer,
    ShortQuestionSerializer, LongQuestionSerializer, 
    QuestionAnswerSerializer, ScoreSerializer, FeedbackSerializer,
    FriendSerializer, UserSearchResultSerializer, DISCDataSerializer
)

#유저의 정보를 불러오는 ViewSet -> retrieve인 경우: UserProfileSerializer를 사용하여 유저의 이름, 성별, 나이를 불러옴
#update, partial_update인 경우: UserWorkInterestSerializer를 사용하여 유저의 업무 성향, 관심 직종을 불러옴
class UserViewSet(viewsets.ModelViewSet):
    queryset = User.objects.all()
    permission_classes = [IsAuthenticated]

    def get_serializer_class(self):
        if self.action == 'retrieve':
            return UserProfileSerializer
        if self.action == 'update' or self.action == 'partial_update':
            return super().get_serializer_class()
        return super().get_serializer_class()

    def get_object(self):
        return self.request.user
    
    @action(detail=False, methods=['put'], serializer_class=UserWorkStyleSerializer)
    def set_user_work_styles(self, request):
        instance = self.get_object()
        serializer = self.get_serializer(instance, data=request.data, partial=True)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(serializer.data)

    @action(detail=False, methods=['put'], serializer_class=UserInterestSerializer)
    def set_user_interests(self, request):
        instance = self.get_object()
        serializer = self.get_serializer(instance, data=request.data, partial=True)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(serializer.data)
    
    
#업무 성향을 유저에게 제공하는 ViewSet
class WorkStyleViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = WorkStyle.objects.all()
    serializer_class = WorkStyleSerializer
    permission_classes = [IsAuthenticated]
    
    
#관심 직종을 유저에게 제공하는 ViewSet
class InterestViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Interest.objects.all()
    serializer_class = InterestSerializer
    permission_classes = [IsAuthenticated]
    
    
#유저 프로필을 불러오는 View
class UserProfileView(generics.RetrieveAPIView):
    queryset = User.objects.all()
    serializer_class = UserProfileSerializer
    permission_classes = []
    lookup_field = 'username'

# 현재 내 프로필을 불러오는 View
class UserCurrentProfileView(generics.RetrieveAPIView):
    queryset = User.objects.all()
    serializer_class = UserProfileSerializer
    permission_classes = [IsAuthenticated]
    
    def get_object(self):
        return self.request.user
    
    
#회원가입 이후 유저의 이름, 성별, 나이 설정하기 위한 ViewSet
class UserGenderNameAgeView(generics.UpdateAPIView):
    queryset = User.objects.all()
    serializer_class = UserGenderNameAgeSerializer
    permission_classes = [IsAuthenticated]

    def get_object(self):
        return self.request.user
    
    
#회원가입 이후 유저의 업무 성향 설정하기 위한 ViewSet    
class UserWorkStyleView(generics.UpdateAPIView):
    queryset = User.objects.all()
    serializer_class = UserWorkStyleSerializer
    permission_classes = [IsAuthenticated]

    def get_object(self):
        return self.request.user
    
#회원가입 이후 유저의 관심 직종 설정하기 위한 ViewSet       
class UserInterestView(generics.UpdateAPIView):
    queryset = User.objects.all()
    serializer_class = UserInterestSerializer
    permission_classes = [IsAuthenticated]

    def get_object(self):
        return self.request.user
    
class UniqueIdCheck(generics.GenericAPIView):
    queryset = User.objects.all()
    serializer_class = UserUniqueIdSerializer
    permission_classes = []

    def post(self, request):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        username = serializer.validated_data['username']

        try:
            User.objects.get(username=username)
            return Response({'isUnique': False}, status=status.HTTP_200_OK)
        except User.DoesNotExist:
            return Response({'isUnique': True}, status=status.HTTP_200_OK)
        
class ShortQuestionViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = ShortQuestion.objects.all()
    serializer_class = ShortQuestionSerializer
    permission_classes = [UnauthenticatedReadOrSafeMethods | IsAuthenticatedOrReadOnly]

class LongQuestionViewSet(viewsets.ModelViewSet):
    queryset = LongQuestion.objects.all()
    serializer_class = LongQuestionSerializer
    permission_classes = [UnauthenticatedReadOrSafeMethods | IsAuthenticatedOrReadOnly]

# GET: user 명에 맞는 서술형 질문 목록을 불러옵니다.
class UserLongQuestionView(generics.ListAPIView):
    serializer_class = LongQuestionSerializer
    permission_classes = []

    def get_queryset(self):
        username = self.kwargs['username']
        user = get_object_or_404(User, username=username)
        return LongQuestion.objects.filter(user__isnull=True) | LongQuestion.objects.filter(user=user)

class QuestionAnswerViewSet(viewsets.ModelViewSet):
    queryset = QuestionAnswer.objects.all()
    serializer_class = QuestionAnswerSerializer

class ScoreViewSet(viewsets.ModelViewSet):
    queryset = Score.objects.all()
    serializer_class = ScoreSerializer

class FeedbackViewSet(viewsets.ModelViewSet):
    queryset = Feedback.objects.all()
    serializer_class = FeedbackSerializer

    # Create
    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        self.perform_create(serializer)
        headers = self.get_success_headers(serializer.data)
        return Response(serializer.data, status=status.HTTP_201_CREATED, headers=headers)

    # Update
    def update(self, request, *args, **kwargs):
        partial = kwargs.pop('partial', False)
        instance = self.get_object()
        serializer = self.get_serializer(instance, data=request.data, partial=partial)
        serializer.is_valid(raise_exception=True)
        self.perform_update(serializer)
        if getattr(instance, '_prefetched_objects_cache', None):
            instance._prefetched_objects_cache = {}
        return Response(serializer.data)

    # Delete
    def destroy(self, request, *args, **kwargs):
        instance = self.get_object()
        self.perform_destroy(instance)
        return Response(status=status.HTTP_204_NO_CONTENT)
    
# GET: user 명에 맞는 피드백 목록을 불러옵니다.
class FeedbackByUserView(generics.ListAPIView):
    serializer_class = FeedbackSerializer
    permission_classes = [IsAuthenticatedOrReadOnly]

    def get_queryset(self):
        username = self.kwargs['username']
        user = get_object_or_404(User, username=username)
        return Feedback.objects.filter(user=user) | Feedback.objects.filter(user_by=user)

# GET: 유저명에 맞는 친구목록을 불러옵니다.    
class UserFriendView(generics.GenericAPIView):
    queryset = User.objects.all()
    serializer_class = FriendSerializer
    permission_classes = [IsAuthenticated]

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
    
class DISCDataViewSet(viewsets.ModelViewSet):
    queryset = DISCData.objects.all()
    serializer_class = DISCDataSerializer