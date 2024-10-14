from django.urls import reverse
from rest_framework import status
from rest_framework.test import APITestCase
from django.contrib.auth import get_user_model

User = get_user_model()


class UniqueIdCheckTest(APITestCase):
    def setUp(self):
        self.url = reverse("check-username")
        self.user = User.objects.create_user(
            username="testuser", password="password123"
        )

    def test_unique_username(self):
        data = {"username": "uniqueuser"}
        response = self.client.post(self.url, data)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data["isUnique"], True)

    def test_non_unique_username(self):
        data = {"username": "testuser"}
        response = self.client.post(self.url, data)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data["isUnique"], False)


class UserDeleteViewTest(APITestCase):
    def setUp(self):
        self.user = User.objects.create_user(
            username="testuser", password="password123"
        )
        self.client.login(username="testuser", password="password123")
        self.url = reverse("user-delete")

    def test_user_delete(self):
        response = self.client.delete(self.url)
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)
        self.assertFalse(User.objects.filter(username="testuser").exists())


class CustomLoginViewTest(APITestCase):
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
