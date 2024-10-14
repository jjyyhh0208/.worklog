from django.urls import reverse
from rest_framework import status
from rest_framework.test import APITestCase
from django.contrib.auth import get_user_model

User = get_user_model()


# FollowFriendView Test
class TestFollowFriendView(APITestCase):
    def setUp(self):
        self.user = User.objects.create_user(
            username="testuser", password="password123"
        )
        self.friend = User.objects.create_user(
            username="frienduser", password="password123"
        )
        self.client.login(username="testuser", password="password123")
        self.url = reverse("user-follow")

    def test_follow_friend(self):
        data = {"friend_name": "frienduser"}
        response = self.client.post(self.url, data)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data["detail"], "You are now following frienduser")


# UnfollowFriendView Test
class TestUnfollowFriendView(APITestCase):
    def setUp(self):
        self.user = User.objects.create_user(
            username="testuser", password="password123"
        )
        self.friend = User.objects.create_user(
            username="frienduser", password="password123"
        )
        self.user.friends.add(self.friend)
        self.client.login(username="testuser", password="password123")
        self.url = reverse("user-unfollow")

    def test_unfollow_friend(self):
        data = {"friend_name": "frienduser"}
        response = self.client.post(self.url, data)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data["detail"], "You have unfollowed frienduser")