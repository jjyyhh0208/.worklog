from rest_framework import viewsets, generics, status
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework.authtoken.models import Token
from .models import User, WorkStyle, Interest
from .serializers import UserGenderNameAgeSerializer, UserWorkInterestSerializer, WorkStyleSerializer, InterestSerializer, UserRegisterSerializer, UserProfileSerializer, UserUniqueusernameSerializer

from dj_rest_auth.registration.views import RegisterView



#유저의 정보를 불러오는 ViewSet -> retrieve인 경우: UserProfileSerializer를 사용하여 유저의 이름, 성별, 나이를 불러옴
#update, partial_update인 경우: UserWorkInterestSerializer를 사용하여 유저의 업무 성향, 관심 직종을 불러옴
class UserViewSet(viewsets.ModelViewSet):
    queryset = User.objects.all()
    serializer_class = UserWorkInterestSerializer
    permission_classes = [IsAuthenticated]

    def get_serializer_class(self):
        if self.action == 'retrieve':
            return UserProfileSerializer
        if self.action == 'update' or self.action == 'partial_update':
            return UserWorkInterestSerializer
        return super().get_serializer_class()

    def get_object(self):
        return self.request.user
    
    
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
    
    
#회원가입 이후 유저의 업무 성향, 관심 직종 설정하기 위한 ViewSet    
class UserWorkInterestView(generics.UpdateAPIView):
    queryset = User.objects.all()
    serializer_class = UserWorkInterestSerializer
    permission_classes = [IsAuthenticated]

    def get_object(self):
        return self.request.user
    
class UsernameUniqueCheck(generics.GenericAPIView):
    queryset = User.objects.all()
    serializer_class = UserUniqueusernameSerializer
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