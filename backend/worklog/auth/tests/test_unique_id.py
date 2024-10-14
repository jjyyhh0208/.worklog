from django.urls import reverse
from rest_framework import status
from rest_framework.test import APITestCase
from django.contrib.auth import get_user_model

User = get_user_model()


class TestUniqueIdCheck(APITestCase):
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
