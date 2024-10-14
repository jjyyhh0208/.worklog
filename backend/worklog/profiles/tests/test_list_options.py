from django.urls import reverse
from rest_framework import status
from rest_framework.test import APITestCase
from django.contrib.auth import get_user_model
from profiles.models import (
    WorkStyle,
    Interest,
    ShortQuestion,
    LongQuestion
)

User = get_user_model()

# WorkStyleViewSet Test
class TestWorkStyleView(APITestCase):
    def setUp(self):
        self.url = reverse("get-workstyles")
        WorkStyle.objects.create(name="Test Work")
        WorkStyle.objects.create(name="Office Work")

    def test_get_workstyles(self):
        response = self.client.get(self.url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 2)


# InterestViewSet Test
class TestInterestView(APITestCase):
    def setUp(self):
        self.url = reverse("get-interests")
        Interest.objects.create(name="Software Development")
        Interest.objects.create(name="Data Science")

    def test_get_interests(self):
        response = self.client.get(self.url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 2)

        
# ShortQuestionView Test
class TestShortQuestionView(APITestCase):
    def setUp(self):
        self.url = reverse("get-shortquestions")
        ShortQuestion.objects.create(question="당신은 협업을 잘 하시나요?")
        ShortQuestion.objects.create(question="당신은 적극적인가요?")

    def test_get_short_questions(self):
        response = self.client.get(self.url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 2)
        

# LongQuestionViewSet Test
class TestLongQuestionViewSet(APITestCase):
    def setUp(self):
        self.url = reverse("longquestion-list")
        self.user = User.objects.create_user(
            username="testuser", password="password123"
        )
        LongQuestion.objects.create(
            user=self.user, long_question="Tell me about yourself."
        )
        self.client.login(username="testuser", password="password123")

    def test_get_long_questions(self):
        response = self.client.get(self.url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 1)

    def test_create_long_question(self):
        data = {"long_question": "00씨와 협업은 어떠셨나요?"}
        response = self.client.post(self.url, data, format="json")
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)