from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import RegisterView, UserProfileView, UserWorkInterestView, UserGenderNameAgeView, WorkStyleViewSet, InterestViewSet

router = DefaultRouter()
router.register(r'workstyles', WorkStyleViewSet, basename='workstyle')
router.register(r'interests', InterestViewSet, basename='interest')

urlpatterns = [
    path('', include(router.urls)),
    path('view/', UserProfileView.as_view(), name='user-profile-view'),
    path('user_work_interest_set/', UserWorkInterestView.as_view(), name='user-work-interest-update'), #유저의 업무 성향, 관심 직종 설정 엔드포인트
    path('user_info_set/', UserGenderNameAgeView.as_view(), name='user-info-update'), #유저의 이름, 성별, 나이 설정 엔드포인트
    path('auth/', include('dj_rest_auth.urls')),  # 로그인, 로그아웃, 비밀번호 변경, 비밀번호 초기화 등을 위한 엔드포인트 기본 제공 기능
    path('auth/registration/', include('dj_rest_auth.registration.urls')),  # 회원가입을 위한 엔드포인트 기본 제공 기능
]
