from django.urls import reverse
from rest_framework import status
from rest_framework.test import APITestCase
from django.contrib.auth import get_user_model

User = get_user_model()

class TestCustomLoginView(APITestCase):
    def setUp(self):
        self.url = reverse("custom_login")
        self.user = User.objects.create_user(
            username="testuser", password="password123"
        )

    def test_successful_login(self):
        data = {"username": "testuser", "password": "password123"}
        response = self.client.post(self.url, data)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn("message", response.data)
        self.assertEqual(response.data["message"], "로그인 성공")

    def test_login_non_existent_user(self):
        data = {"username": "nonexistent", "password": "password123"}
        response = self.client.post(self.url, data)
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertEqual(
            response.data["message"], "회원이 존재하지 않습니다. 아이디를 확인해주세요."
        )

    def test_login_wrong_password(self):
        data = {"username": "testuser", "password": "wrongpassword"}
        response = self.client.post(self.url, data)
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertEqual(
            response.data["message"], "로그인에 실패했습니다. 입력 정보를 확인해주세요."
        )
