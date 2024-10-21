from django.urls import path, include

from rest_framework.routers import DefaultRouter

from profiles.views.feedbacks_views import (FeedbackViewSet)
from profiles.views.friends_views import (
    UnfollowFriendView, FollowFriendView,
    UserSearchView,UserFriendView
)
from profiles.views.gpt_summarize_views import UserLongQuestionAnswersView
from profiles.views.kakao_login_views import KakaoLoginCallback, get_token
from profiles.views.register_fixed_data_views import (
    WorkStyleView, InterestView, ShortQuestionView, LongQuestionViewSet
)
from profiles.views.user_register_views import (
    UserCurrentProfileView, UserProfileView, UserLongQuestionView
)
from profiles.views.user_setting_views import (
    UserNameFeedbackStyleView, UserWorkStyleView,
    UserInterestView, ProfileImageView,
    UpdateBioView
)


router = DefaultRouter()
router.register(r'long-questions', LongQuestionViewSet)
router.register(r'feedbacks', FeedbackViewSet, basename='feedback')

urlpatterns = [
    path('', include(router.urls)),
    
    #Options 조회 URL
    path('workstyles/', WorkStyleView.as_view(), name = 'get-workstyles'),
    path('interests/', InterestView.as_view(), name = 'get-interests'),
    path('shortquestions/', ShortQuestionView.as_view(), name='get-shortquestions'),
    
    # User View
    path('user/current/', UserCurrentProfileView.as_view(), name='user-current-profile-view'), # 현재 로그인한 user의 정보를 불러올 수 있는 엔드포인트
    path('user/view/<str:username>/', UserProfileView.as_view(), name='user-profile-view'), # username 별로 user 값을 불러올 수 있는 엔드포인트
    path('user/view/long-questions/<str:username>/', UserLongQuestionView.as_view(), name='longquestions-by-user'), # 유저에 맞는 질문을 반환하는 엔드포인트
    path('user/view/friends/<str:username>/', UserFriendView.as_view(), name='user-friend-view'), # 유저의 친구 목록을 보여주는 엔드포인트
    path('user/search/', UserSearchView.as_view(), name='user-search'),

    # User Setting
    path('user/set/work-style/', UserWorkStyleView.as_view(), name='user-work-style-update'),  # 유저의 업무 성향 직종 설정 엔드포인트
    path('user/set/interest/', UserInterestView.as_view(), name='user-work-interest-update'),  # 유저의 관심 직종 설정 엔드포인트
    path('user/set/basic-info/', UserNameFeedbackStyleView.as_view(), name='user-info-update'),  # 유저의 이름, 성별, 나이 설정 엔드포인트
    path('user/set/profile-image/', ProfileImageView.as_view(), name='profile-image-upload'), # 유저의 프로필 이미지를 업로드하는 엔드포인트
    path('user/set/bio/', UpdateBioView.as_view(), name='update-bio'), # 한줄소개 업데이트 엔드포인트
    
    # 친구 추가
    path('user/follow/', FollowFriendView.as_view(), name='user-follow'), # 유저 팔로우 엔드포인트
    path('user/unfollow/', UnfollowFriendView.as_view(), name='user-unfollow'), # 유저 언팔로우 엔드포인트

    #GPT용 답변 추출
    path('user/feedback-answers/', UserLongQuestionAnswersView.as_view(), name='user-feedback-answers'), # 유저의 답변을 저장하는 엔드포인트
     
    # Social Account
    path('auth/kakao/callback', KakaoLoginCallback.as_view(), name='kakao_login_callback'),
    path('auth/kakao/get-token', get_token, name='get_token'),
]
