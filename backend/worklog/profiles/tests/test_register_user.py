from django.urls import reverse
from rest_framework import status
from rest_framework.test import APITestCase
from django.contrib.auth import get_user_model

User = get_user_model()

# UserCurrentProfileView Test
class TestUserCurrentProfileView(APITestCase):
    def setUp(self):
        self.user = User.objects.create_user(
            username="testuser", password="password123"
        )
        self.client.login(username="testuser", password="password123")
        self.url = reverse("user-current-profile-view")

    def test_get_current_profile(self):
        response = self.client.get(self.url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data["username"], "testuser")
        
        
# UserProfileView Test
class TestUserProfileView(APITestCase):
    def setUp(self):
        self.user = User.objects.create_user(
            username="testuser", password="password123", name="Test User"
        )
        self.url = reverse("user-profile-view", kwargs={"username": "testuser"})

    def test_get_user_profile(self):
        response = self.client.get(self.url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data["username"], "testuser")