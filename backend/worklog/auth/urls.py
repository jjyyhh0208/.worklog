from django.urls import path, include
from .views import (
    UniqueIdCheck, UserDeleteView, CustomLoginView,UserDeleteView
)

urlpatterns = [
    # Auth
    path('login/', CustomLoginView.as_view(), name='custom_login'), # 로그인 오류메시지 추가한 Custom ViewSet 사용
    path('auth/', include('dj_rest_auth.urls')),  # 로그아웃, 비밀번호 변경, 비밀번호 초기화 등을 위한 엔드포인트 기본 제공 기능
    path('signup/', include('dj_rest_auth.registration.urls')),  # 회원가입을 위한 엔드포인트 기본 제공 기능
    path('check-username/', UniqueIdCheck.as_view(), name='check-username'), # 유저 이름 중복 검사
    path('delete/', UserDeleteView.as_view(), name='user-delete'), # 유저 삭제 엔드포인트
]
