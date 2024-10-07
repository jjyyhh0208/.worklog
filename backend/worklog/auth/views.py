from rest_framework import generics, status, permissions
from rest_framework.response import Response

from django.views.decorators.csrf import ensure_csrf_cookie
from django.utils.decorators import method_decorator

from dj_rest_auth.views import LoginView

from django.contrib.auth import get_user_model

from profiles.models import User
from profiles.serializers import UserUniqueIdSerializer

class UniqueIdCheck(generics.GenericAPIView):
    queryset = User.objects.all()
    serializer_class = UserUniqueIdSerializer
    permission_classes = []

    def post(self, request):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        username = serializer.validated_data['username']

        #true 반환 시 회원가입 허용
        #false 반환 시 회원가입 불가 (id 중복)
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
        user = self.get_object()
        user.delete()
        return Response({"detail": "User account deleted successfully"}, status=status.HTTP_204_NO_CONTENT)
    
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