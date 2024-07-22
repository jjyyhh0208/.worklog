from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    UserProfileView, UserWorkStyleView, UserInterestView, 
    UserGenderNameAgeView, WorkStyleViewSet, InterestViewSet, 
    UniqueIdCheck, ShortQuestionViewSet, LongQuestionViewSet,
    FeedbackViewSet, UserLongQuestionView, UserFriendView,
    UserCurrentProfileView, UserSearchView, UserLongQuestionAnswersView,
    TestAnswers, FollowFriendView, UserDeleteView, CustomLoginView,
    ProfileImageView, get_signed_url_view, TestAnswers, 
    FollowFriendView, UserDeleteView, UnfollowFriendView, 
    # google_callback, google_login, GoogleLogin
    KakaoView, KakaoCallBackView
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
    path('user/search/', UserSearchView.as_view(), name='user-search'),

    # User Setting
    path('user/set/work-style/', UserWorkStyleView.as_view(), name='user-work-style-update'),  # 유저의 업무 성향 직종 설정 엔드포인트
    path('user/set/interest/', UserInterestView.as_view(), name='user-work-interest-update'),  # 유저의 관심 직종 설정 엔드포인트
    path('user/set/basic-info/', UserGenderNameAgeView.as_view(), name='user-info-update'),  # 유저의 이름, 성별, 나이 설정 엔드포인트
    path('user/set/profile-image/', ProfileImageView.as_view(), name='profile-image-upload'), # 유저의 프로필 이미지를 업로드하는 엔드포인트

    # User 그 외
    path('user/follow/', FollowFriendView.as_view(), name='user-follow'), # 유저 팔로우 엔드포인트
    path('user/get-signed-url/<path:image_path>/', get_signed_url_view, name='get_signed_url'), # s3 인증값을 받는 엔드포인트

    # Auth
    path('auth/login/', CustomLoginView.as_view(), name='custom_login'), # 로그인 오류메시지 추가한 Custom ViewSet 사용
    path('auth/', include('dj_rest_auth.urls')),  # 로그인, 로그아웃, 비밀번호 변경, 비밀번호 초기화 등을 위한 엔드포인트 기본 제공 기능
    path('auth/registration/', include('dj_rest_auth.registration.urls')),  # 회원가입을 위한 엔드포인트 기본 제공 기능
    path('auth/check-username/', UniqueIdCheck.as_view(), name='check-username'), # 유저 이름 중복 검사
    path('auth/delete/', UserDeleteView.as_view(), name='user-delete'), # 유저 삭제 엔드포인트

    # # Social Account
    # path('user/google/login', google_login, name='google_login'),
    # path('user/google/callback/', google_callback, name='google_callback'),
    # path('user/google/login/finish/', GoogleLogin.as_view(), name='google_login_todjango'),
    path('auth/kakao/callback', KakaoCallBackView.as_view(), name='kakao_callback'),
    path('auth/kakao', KakaoView.as_view(), name='kakao_auth'),

    #GPT용 답변 추출
    path('user/feedback-answers/', UserLongQuestionAnswersView.as_view(), name='user-feedback-answers'), # 유저의 답변을 저장하는 엔드포인트
    path('user/test/', TestAnswers.as_view(), name='test-answers'), # 테스트용 답변을 저장하는 엔드포인트
    
    path('user/follow/', FollowFriendView.as_view(), name='user-follow'), # 유저 팔로우 엔드포인트
    path('user/unfollow/', UnfollowFriendView.as_view(), name='user-unfollow'), # 유저 언팔로우 엔드포인트
]