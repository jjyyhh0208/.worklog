from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    UserProfileView, UserWorkStyleView, UserInterestView, 
    UserGenderNameAgeView, WorkStyleViewSet, InterestViewSet, 
    UniqueIdCheck, ShortQuestionViewSet, LongQuestionViewSet,
    FeedbackViewSet, UserLongQuestionView, UserFriendView,
    UserCurrentProfileView, UserLongQuestionAnswersView
    )


router = DefaultRouter()
router.register(r'workstyles', WorkStyleViewSet, basename='workstyle')
router.register(r'interests', InterestViewSet, basename='interest')
router.register(r'short-questions', ShortQuestionViewSet, basename='short-question')
router.register(r'long-questions', LongQuestionViewSet)
router.register(r'feedbacks', FeedbackViewSet)

urlpatterns = [
    path('', include(router.urls)),
    # User View
    path('user/current/', UserCurrentProfileView.as_view(), name='user-current-profile-view'), # 현재 로그인한 user의 정보를 불러올 수 있는 엔드포인트
    path('user/view/<str:username>/', UserProfileView.as_view(), name='user-profile-view'), # username 별로 user 값을 불러올 수 있는 엔드포인트
    path('user/view/long-questions/<str:username>/', UserLongQuestionView.as_view(), name='longquestions-by-user'), # 유저에 맞는 질문을 반환하는 엔드포인트
    path('user/view/friends/<str:username>/', UserFriendView.as_view(), name='user-friend-view'), # 유저의 친구 목록을 보여주는 엔드포인트
    
    # User Setting
    path('user/set/work-style/', UserWorkStyleView.as_view(), name='user-work-style-update'),  # 유저의 업무 성향 직종 설정 엔드포인트
    path('user/set/interest/', UserInterestView.as_view(), name='user-work-interest-update'),  # 유저의 관심 직종 설정 엔드포인트
    path('user/set/basic-info/', UserGenderNameAgeView.as_view(), name='user-info-update'),  # 유저의 이름, 성별, 나이 설정 엔드포인트

    # Auth
    path('auth/', include('dj_rest_auth.urls')),  # 로그인, 로그아웃, 비밀번호 변경, 비밀번호 초기화 등을 위한 엔드포인트 기본 제공 기능
    path('auth/registration/', include('dj_rest_auth.registration.urls')),  # 회원가입을 위한 엔드포인트 기본 제공 기능
    path('auth/check-username/', UniqueIdCheck.as_view(), name='check-username'), # 유저 이름 중복 검사
    
    #GPT용 답변 추출
    path('user/feedback-answers/', UserLongQuestionAnswersView.as_view(), name='user-feedback-answers'), # 유저의 답변을 저장하는 엔드포인트
]