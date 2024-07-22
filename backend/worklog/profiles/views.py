import profile
from pyexpat import model
from django.views import View
from django.contrib.auth import login
import openai
import ast
from django.conf import settings
from django.core.files.storage import default_storage
from django.contrib.auth import authenticate
from django.shortcuts import redirect
from dj_rest_auth.serializers import LoginSerializer
import boto3
import json
from django.contrib.auth import get_user_model
from rest_framework import viewsets, generics, status, permissions, serializers
from rest_framework.response import Response
from rest_framework.parsers import MultiPartParser, FormParser
from rest_framework.permissions import IsAuthenticated, IsAuthenticatedOrReadOnly, AllowAny
from rest_framework.decorators import action
from rest_framework.views import APIView
from django.db.models import Q
from django.shortcuts import get_object_or_404
from dj_rest_auth.views import LoginView
from dj_rest_auth.registration.views import RegisterView
from .models import User, WorkStyle, Interest, ShortQuestion, LongQuestion, QuestionAnswer, Score, Feedback, ProfileImage
from .serializers import (
    UserGenderNameAgeSerializer, UserWorkStyleSerializer,
    UserInterestSerializer, WorkStyleSerializer,
    InterestSerializer, UserRegisterSerializer,
    UserProfileSerializer, UserUniqueIdSerializer,
    ShortQuestionSerializer, LongQuestionSerializer, 
    QuestionAnswerSerializer, ScoreSerializer, FeedbackSerializer,
    FriendSerializer, UserSearchResultSerializer, ProfileImageSerializer
)
from django.http import JsonResponse
from utils.s3_utils import get_signed_url
import os
import logging
import requests
from rest_framework.authtoken.models import Token

site_url = os.getenv('SITE_HTTP')
logger = logging.getLogger(__name__)

# s3 접근 인증 받는 함수
def get_signed_url_view(request, image_path):
    url = get_signed_url(image_path)
    if url is None:
        return JsonResponse({'error': 'Failed to generate signed URL'}, status=500)
    return JsonResponse({'signed_url': url})


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
    

class KakaoView(View):
    def get(self, request):
        kakao_api = "http://kauth.kakao.com/oauth/authorize?response_type=code"
        redirect_url = f"{site_url}profiles/auth/kakao/callback"
        client_id = os.getenv('SOCIAL_AUTH_KAKAO_CLIENT_ID')

        if not client_id:
            return JsonResponse({'error': 'SOCIAL_AUTH_KAKAO_CLIENT_ID is not set'}, status=500)

        return redirect(f"{kakao_api}&client_id={client_id}&redirect_uri={redirect_url}")
    
class KakaoCallBackView(View):
    def get(self, request):
        code = request.GET.get("code")

        data = {
            "grant_type": "authorization_code",
            "client_id": os.getenv('SOCIAL_AUTH_KAKAO_CLIENT_ID'),
            "redirect_uri": f"{site_url}profiles/auth/kakao/callback",
            "code": code
        }

        kakao_token_api = "https://kauth.kakao.com/oauth/token"
        token_response = requests.post(kakao_token_api, data=data)
        token_json = token_response.json()

        access_token = token_json.get("access_token")
        if not access_token:
            return JsonResponse({'error': 'Failed to obtain access token', 'details': token_json}, status=400)

        kakao_user_api = "https://kapi.kakao.com/v2/user/me"
        headers = {"Authorization": f"Bearer {access_token}"}
        user_information_response = requests.get(kakao_user_api, headers=headers)
        user_information = user_information_response.json()

        # user_information을 사용하여 서버에 로그인
        user_id = user_information["id"]
        nickname = user_information["properties"]["nickname"]

        User = get_user_model()
        try:
            user = User.objects.get(username=user_id)
        except User.DoesNotExist:
            # Create a new user if not exists
            user = User(username=nickname)
            user.set_unusable_password()
            user.save()
        
            login(request, user)
        return JsonResponse({'message': '로그인 성공', 'user': {'id': user_id, 'nickname': nickname}}, status=200)     

    
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
    permission_classes = [IsAuthenticatedOrReadOnly]

class LongQuestionViewSet(viewsets.ModelViewSet):
    queryset = LongQuestion.objects.all()
    serializer_class = LongQuestionSerializer
    permission_classes = [IsAuthenticatedOrReadOnly]

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
    permission_classes = [AllowAny]
    

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

    def post(self, request, *args, **kwargs):
        try:
            evaluated_username = request.data.get('user_to', '')  # URL에서 평가받는 유저의 유저네임 가져오기
            evaluated_user = User.objects.get(username=evaluated_username)  # 평가받는 유저 조회

            question_answers = request.data.get('question_answers', [])

            feedbacks = []
            for qa in question_answers:
                question_text = qa['question']
                long_question_instance, created = LongQuestion.objects.get_or_create(long_question=question_text)
                question_answer_instance = QuestionAnswer.objects.create(
                    question=long_question_instance,
                    answer=qa['answer']
                )
                feedback = Feedback.objects.create(user=evaluated_user)
                feedback.question_answers.add(question_answer_instance)
                feedbacks.append(feedback)

            answers = [qa['answer'] for qa in question_answers]
            answers_text = " ".join(answers)

            prompt = (
                "I will give you evaluations of a certain user in Korean.\n"
                "For example, '같이 프로젝트를 하면서 의견을 제시하지만 요점이 없는 의견만 제시함. 하지만 적극적인 태도는 좋음.', "
                "'발표력이 매우 좋고 리더십이 있음. 하지만 회의 시간을 잘 지키지 않음'...etc.\n"
                "You have to summarize these couple of evaluations in Two sentences.\n"
                "For example, '의견을 적극적으로 제시하지만 요점이 없고 회의시간을 잘 지키지 않는다. 하지만 발표력이 매우 좋고 리더십이 있다.'\n"
                "Then, you have to give advice to fix some problems based on the evaluations I provide you.\n"
                "For example, '적극적인 태도는 좋지만 의견 제시할 때 요점을 먼저 정리하고 제시해보세요!', '회의 시간을 잘 지켜보세요!' ...etc.\n"
                "For example, you will receive\n"
                "request = { '같이 프로젝트를 하면서 의견을 제시하지만 요점이 없는 의견만 제시함. 하지만 적극적인 태도는 좋음 발표력이 매우 좋고 리더십이 있음. 회의 시간을 잘 지키지 않음'}\n"
                "Then, your response should be in the format just like this.\n"
                "response format(application/json) = {'summarized': <your summarized answer>, 'advice': <your advice>}\n"
                "Your answer must be in json format (application/json) this is very important. You MUST respond in json format"
                "For example,\n"
                "gpt_response = { 'summarized' = '의견을 적극적으로 제시하지만 요점이 없고 회의시간을 잘 지키지 않는다. 하지만 발표력이 매우 좋고 리더십이 있다.', 'advice' = '적극적인 태도는 좋지만 의견 제시할 때 요점을 먼저 정리하고 제시해보세요!', '회의 시간을 잘 지켜보세요!' }\n"
                "You have to give longer summary and advices. Particularly with the advice, you have to recommend methods to strengthen or make better with the defaults. "
                "For example, you can say '요점을 정리하는 방법을 배우기 위해서 ~~프로그램, 00도서를 사용해보세요!' as the advice.\n\n"
                "In addition, do not use swear words or harsh expressions. If the prompt includes some harsh expressions, I want you to change those in another words.\n"
                "Also, do not contain particular name or organizations. For example, 'Eric told you are good at communications'. This specify the user. This MUST NOT happen.\n"
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
            logger.error(f"OpenAI response text: {openai_response_text}")
            logger.error(evaluated_username)
            try:
                openai_response_dict = json.loads(openai_response_text)
                logger.error(openai_response_dict)
            except (ValueError, SyntaxError) as e:
                logger.error(f"Failed to decode OpenAI response: {e}")
                return Response({"error": "Failed to decode OpenAI response"}, status=500)

            # 기존 요약과 조언을 리스트로 처리하도록 수정
            existing_personality = json.loads(evaluated_user.gpt_summarized_personality) if evaluated_user.gpt_summarized_personality else {}
            summarized_list = existing_personality.get('summarized', [])
            advice_list = existing_personality.get('advice', [])

            summarized_list.append(openai_response_dict['summarized'])
            advice_list.append(openai_response_dict['advice'])

            evaluated_user.gpt_summarized_personality = json.dumps({
                'summarized': summarized_list,
                'advice': advice_list
            }, ensure_ascii=False)
            evaluated_user.save()

            return Response({
                "summarized": summarized_list,
                "advice": advice_list
            })
        except Exception as e:
            logger.error(f"Error in UserLongQuestionAnswersView: {e}")
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


    
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
    

class UnfollowFriendView(generics.GenericAPIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, *args, **kwargs):
        user = request.user
        friend_name = request.data.get('friend_name')

        if not friend_name:
            return Response({"detail": "Friend name is required."}, status=status.HTTP_400_BAD_REQUEST)
        
        friend = get_object_or_404(User, username=friend_name)

        if friend == user:
            return Response({"detail": "You cannot unfollow yourself."}, status=status.HTTP_400_BAD_REQUEST)

        user.friends.remove(friend)
        return Response({"detail": f"You have unfollowed {friend.name}"}, status=status.HTTP_200_OK)
    