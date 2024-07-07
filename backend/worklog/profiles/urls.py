from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import UserProfileView, UserWorkInterestView, UserGenderNameAgeView, WorkStyleViewSet, InterestViewSet, UsernameUniqueCheck

router = DefaultRouter()
router.register(r'workstyles', WorkStyleViewSet, basename='workstyle')
router.register(r'interests', InterestViewSet, basename='interest')

urlpatterns = [
    path('', include(router.urls)),
    path('user/view/', UserProfileView.as_view(), name='user-profile-view'),
    path('user/set/work-interest/', UserWorkInterestView.as_view(), name='user-work-interest-update'),  # 유저의 업무 성향, 관심 직종 설정 엔드포인트
    path('user/set/basic-info/', UserGenderNameAgeView.as_view(), name='user-info-update'),  # 유저의 이름, 성별, 나이 설정 엔드포인트
    path('auth/', include('dj_rest_auth.urls')),  # 로그인, 로그아웃, 비밀번호 변경, 비밀번호 초기화 등을 위한 엔드포인트 기본 제공 기능
    path('auth/registration/', include('dj_rest_auth.registration.urls')),  # 회원가입을 위한 엔드포인트 기본 제공 기능
    path('auth/check-username/', UsernameUniqueCheck.as_view(), name='check-username'), # 유저 이름 중복 검사
]
