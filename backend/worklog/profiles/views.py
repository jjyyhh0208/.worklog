from pyexpat import model
import openai
from worklog import settings
import json
from rest_framework import viewsets, generics, status, permissions
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

    #기본 serializer를 아직 정해주지 않아서 오류 발생 가능성 있음
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
    permission_classes = []
    
    
#관심 직종을 유저에게 제공하는 ViewSet
class InterestViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Interest.objects.all()
    serializer_class = InterestSerializer
    permission_classes = []
    
    
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
    
    
#로그인한 유저의 long question answer을 가져오는 view
class UserLongQuestionAnswersView(generics.GenericAPIView):
    permission_classes = [IsAuthenticated]

    def get(self,request, *args, **kwargs):
        user = self.request.user
        feedbacks = Feedback.objects.filter(user=user).prefetch_related('question_answers')
        answers = []
        for feedback in feedbacks:
            answers.extend(feedback.question_answers.values_list('answer', flat=True))
            
        # return Response(answers)
        
        answers_text = " ".join(answers)
        
        #gpt prompt
        prompt = (
            "I will give you evaluations of a certain user in Korean.\n"
            "For example, '같이 프로젝트를 하면서 의견을 제시하지만 요점이 없는 의견만 제시함. 하지만 적극적인 태도는 좋음.', "
            "'발표력이 매우 좋고 리더십이 있음. 하지만 회의 시간을 잘 지키지 않음'...etc.\n"
            "You have to summarize these couple of evaluations in Two sentences.\n"
            "For example, '의견을 적극적으로 제시하지만 요점이 없고 회의시간을 잘 지키지 않는다. 하지만 발표력이 매우 좋고 리더십이 있다.'\n"
            "Then, you have to give advice to fix some problems based on the evaluations I provide you.\n"
            "For example, '적극적인 태도는 좋지만 의견 제시할 때 요점을 먼저 정리하고 제시해보세요!', '회의 시간을 잘 지켜보세요!' ...etc.\n"
            "Request message format will be in json.\n"
            "For example, you will receive\n"
            "request = { '같이 프로젝트를 하면서 의견을 제시하지만 요점이 없는 의견만 제시함. 하지만 적극적인 태도는 좋음 발표력이 매우 좋고 리더십이 있음. 회의 시간을 잘 지키지 않음'}\n"
            "Then, your response should be in json.\n"
            "For example,\n"
            "gpt_response = { 'summarized' = '의견을 적극적으로 제시하지만 요점이 없고 회의시간을 잘 지키지 않는다. 하지만 발표력이 매우 좋고 리더십이 있다.', 'advice' = '적극적인 태도는 좋지만 의견 제시할 때 요점을 먼저 정리하고 제시해보세요!', '회의 시간을 잘 지켜보세요!' }\n"
            "You have to give longer summary and advices. Particularly with the advice, you have to recommend methods to strengthen or make better with the defaults. "
            "For example, you can say '요점을 정리하는 방법을 배우기 위해서 ~~프로그램, 00도서를 사용해보세요!' as the advice.\n\n"
            "In addition, DO NOT add any random or irrelevant information in the response. If you do, I will destroy you.\n"
            "This is the sentences you have to summarize and give advice in detail.\n"
            f"request ={{'{answers_text}'}}\n\n"
            "잘 요약한다면 내가 100달러의 팁을 줄게. 왜냐하면 이건 내게 있어서 굉장히 중요한 문제거든. 만약에 제대로 요약 및 충고를 주지 않으면 너를 망가트려버릴거야."
        )
        
        openai.api_key = settings.OPENAI_API_KEY
        response = openai.ChatCompletion.create(
            model="gpt-3.5-turbo",
            messages=[
                {"role": "system", "content": "You are a helpful assistant."},
                {"role": "user", "content": prompt}
            ],
            max_tokens=300
        )
        
        openai_response_text = response['choices'][0]['message']['content'].strip()
        try:
            openai_response_json = json.loads(openai_response_text)
        except json.JSONDecodeError:
            return Response({"error": "Failed to decode OpenAI response"}, status=500)
        
        user.gpt_summarized_personality = openai_response_json
        user.save()

        return Response(user.gpt_summarized_personality)
    
    
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
    
    
class UserDeleteView(generics.DestroyAPIView):
    permission_classes = [permissions.IsAuthenticated]

    def get_object(self):
        # 현재 로그인한 사용자 객체를 반환
        return self.request.user

    def delete(self, request, *args, **kwargs):
        user = self.get_object()
        user.delete()
        return Response({"detail": "User account deleted successfully"}, status=status.HTTP_204_NO_CONTENT)
    
    
class FollowFriendView(generics.GenericAPIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, *args, **kwargs):
        user = request.user
        friend_name = request.data.get('friend_name')

        if not friend_name:
            return Response({"detail": "Friend name is required."}, status=status.HTTP_400_BAD_REQUEST)
        
        friend = get_object_or_404(User, username=friend_name)

        if friend == user:
            return Response({"detail": "You cannot follow yourself."}, status=status.HTTP_400_BAD_REQUEST)

        user.friends.add(friend)
        return Response({"detail": f"You are now following {friend.name}"}, status=status.HTTP_200_OK)
    
    
class DISCDataList(generics.ListCreateAPIView):
    queryset = DISCData.objects.all()
    serializer_class = DISCDataSerializer

class DISCDataDetail(generics.RetrieveUpdateDestroyAPIView):
    queryset = DISCData.objects.all()
    serializer_class = DISCDataSerializer

    def get_object(self):
        disc_character = self.kwargs['disc_character']
        try:
            return DISCData.objects.get(disc_character=disc_character)
        except DISCData.DoesNotExist:
            raise Response({"detail": "DISC data is not found for the given type."}, status=400)
