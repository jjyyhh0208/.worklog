from rest_framework import status
from rest_framework.test import APITestCase
from django.urls import reverse
from profiles.models import (
    User,
    Feedback,
    LongQuestion,
    Score,
    WorkStyle,
)

class TestFeedbackViewSet(APITestCase):
    def setUp(self):
        self.user = User.objects.create_user(
            username="testuser", password="password123"
        )
        self.user_by = User.objects.create_user(
            username="feedbackuser", password="password123"
        )

        # WorkStyle 및 Score 생성
        self.workstyle1 = WorkStyle.objects.create(name="도전적인")
        self.workstyle2 = WorkStyle.objects.create(name="사교적인")
        self.score = Score.objects.create(
            d_score=25, i_score=40, s_score=30, c_score=15
        )
        self.question_answer1 = {
            "question": {
                "long_question": "OO과의 협업 경험에서 좋았던 점은 무엇이었나요?"
            },
            "answer": "적극적이고 리더십이 뛰어났습니다.",
        }
        self.question_answer2 = {
            "question": {
                "long_question": "OO과의 협업 경험에서 아쉬웠던 점은 무엇이었나요?"
            },
            "answer": "가끔 의견 조율이 어려웠습니다.",
        }

        self.create_url = reverse("feedback-list")
        self.detail_url = lambda pk: reverse("feedback-detail", kwargs={"pk": pk})

    def test_create_feedback(self):
        data = {
            "user": self.user.username,
            "work_styles": [
            {"id": self.workstyle1.id, "name": self.workstyle1.name},
            {"id": self.workstyle2.id, "name": self.workstyle2.name}
            ],
            "score": {"d_score": 25, "i_score": 40, "s_score": 30, "c_score": 15},
            "question_answers": [self.question_answer1, self.question_answer2],
        }

        response = self.client.post(self.create_url, data, format="json")
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(Feedback.objects.count(), 1)

    def test_update_feedback(self):
        feedback = Feedback.objects.create(user=self.user)
        feedback.work_styles.set([self.workstyle1, self.workstyle2])
        feedback.question_answers.set([])

        updated_data = {
            "user": self.user.username,
            "work_styles": [
                {"id": self.workstyle1.id, "name": self.workstyle1.name}
            ],
            "score": {"d_score": 50, "i_score": 30, "s_score": 20, "c_score": 10},
            "question_answers": []
        }

        response = self.client.put(
            self.detail_url(feedback.id), updated_data, format="json"
        )
        self.assertEqual(response.status_code, status.HTTP_200_OK)


    def test_delete_feedback(self):
        feedback = Feedback.objects.create(user=self.user)
        feedback.work_styles.set([self.workstyle1, self.workstyle2])

        response = self.client.delete(self.detail_url(feedback.id))
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)
        self.assertEqual(Feedback.objects.count(), 0)

##############################################################################
####----------테스트 코드 돌아갈 때마다 GPT API 호출 -> 비용문제로 주석처리-----------####
##############################################################################

# class UserLongQuestionAnswersViewTest(APITestCase):
#     def setUp(self):
#         self.user = User.objects.create_user(
#             username="testuser", password="password123"
#         )
#         self.evaluated_user = User.objects.create_user(
#             username="evaluated_user", password="password123"
#         )
#         self.url = reverse("user-feedback-answers")

#         self.question1 = LongQuestion.objects.create(
#             user = self.evaluated_user,
#             long_question="OO과의 협업 경험에서 좋았던 점은 무엇이었나요?"
#         )
#         self.question2 = LongQuestion.objects.create(
#             user = self.evaluated_user,
#             long_question="OO과의 협업 경험에서 아쉬웠던 점은 무엇이었나요?"
#         )

#     def test_post_answers(self):
#         data = {
#             "user_to": self.evaluated_user.username,
#             "question_answers": [
#                 {
#                     "question": self.question1.long_question,
#                     "answer": "적극적이고 리더십이 뛰어났습니다.",
#                 },
#                 {
#                     "question": self.question2.long_question,
#                     "answer": "가끔 의견 조율이 어려웠습니다.",
#                 },
#             ],
#         }
#         response = self.client.post(self.url, data, format="json")
#         self.assertEqual(response.status_code, status.HTTP_200_OK)
#         self.assertIn("positive_feedback", response.data)
#         self.assertIn("constructive_feedback", response.data)
