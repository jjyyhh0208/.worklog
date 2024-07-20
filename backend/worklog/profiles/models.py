from django.contrib.auth.models import AbstractUser
from django.db import models
from collections import Counter
import os
from django.utils.deconstruct import deconstructible

# 유저명을 기준으로 프로필 저장
@deconstructible
class PathAndRename:
    def __init__(self, sub_path):
        self.path = sub_path

    def __call__(self, instance, filename):
        ext = filename.split('.')[-1]
        filename = '{}.{}'.format(instance.user.username, ext)
        return os.path.join(self.path, filename)
    
class User(AbstractUser):
    GENDER_CHOICES = [
        ('M', '남성'),
        ('F', '여성'),
        ('N', '없음')
    ]

    gender = models.CharField(max_length=1, choices=GENDER_CHOICES)
    age = models.PositiveIntegerField(null=True, blank=True)
    name = models.CharField(max_length=50)
    work_styles = models.ManyToManyField('WorkStyle', blank=False)      # WorkStyle 모델과 다대다 관계 -> 여러 유저가 여러 WorkStyle을 가질 수 있음
    interests = models.ManyToManyField('Interest', blank=False)         # Interest 모델과 다대다 관계 -> 여러 유저가 여러 Interest를 가질 수 있음
    friends = models.ManyToManyField('self', symmetrical=True, blank=True)
    profile_image = models.OneToOneField('ProfileImage', on_delete=models.SET_NULL, null=True, blank=True, related_name='user_profile')
    disc_character = models.CharField(max_length=50, blank=True)
    gpt_summarized_personality = models.TextField(blank=True, null=True)
    
    @property
    def feedback_count(self):
        return self.feedbacks_from.count()
    
    @property
    def calculate_disc_scores(self):
        feedbacks = self.feedbacks_from.all()
        d_score_total, i_score_total = 0, 0
        s_score_total, c_score_total = 0, 0

        if self.feedbacks_from.count() >= 3: 
            feedback_count = self.feedbacks_from.count()
            for feedback in feedbacks:
                if feedback.score:
                    d_score_total += feedback.score.d_score
                    i_score_total += feedback.score.i_score
                    s_score_total += feedback.score.s_score
                    c_score_total += feedback.score.c_score
        else:
            return {'D': 0, 'I': 0, 'S': 0, 'C': 0}

        scores = {
            'D': round(100 * d_score_total / (feedback_count * 36)),
            'I': round(100 * i_score_total / (feedback_count * 36)),
            'S': round(100 * s_score_total / (feedback_count * 36)),
            'C': round(100 * c_score_total / (feedback_count * 36)),
        }

        return scores

    
    @property
    def calculate_workstyles(self):
        from .serializers import WorkStyleSerializer

        feedbacks = self.feedbacks_from.all()
        workstyle_counter = Counter() # counter를 활용하여 개수를 셈.

        for feedback in feedbacks:
            workstyles = feedback.work_styles.all()
            workstyle_counter.update(workstyles)

        top_three_workstyles = workstyle_counter.most_common(3)

        # serialized
        serialized_workstyles = []
        for workstyle, count in top_three_workstyles:
            serialized_workstyle = WorkStyleSerializer(workstyle).data
            serialized_workstyles.append(serialized_workstyle)

        return serialized_workstyles
    
    @property
    def calculate_disc_character(self):
        CHARACTER = {
            'ID': '커뮤니케이터',
            'IS': '중재가',
            'SI': '프로세서',
            'SC': '애널리스트',
            'CS': '디테일리스트',
            'CD': '컨트롤 타워',
            'DC': '목표 달성자',
            'DI': '불도저'
        }
    
        feedbacks = self.feedbacks_from.all()
        d_score_total, i_score_total = 0, 0
        s_score_total, c_score_total = 0, 0

        if self.feedbacks_from.count() >= 3: # 피드백 3개 이상 있는 경우
            for feedback in feedbacks:
                if feedback.score:
                    d_score_total += feedback.score.d_score
                    i_score_total += feedback.score.i_score
                    s_score_total += feedback.score.s_score
                    c_score_total += feedback.score.c_score

            scores = {
                'D': d_score_total,
                'I': i_score_total,
                'S': s_score_total,
                'C': c_score_total
            }

            sorted_scores = sorted(scores.items(), key=lambda item: item[1], reverse=True)
            top_disc = str(sorted_scores[0][0]) + str(sorted_scores[1][0])
            if top_disc not in CHARACTER:  # 1,2등 type 내로 설명이 불가능할 때 1,3 등 값 활용
                top_disc = str(sorted_scores[0][0]) + str(sorted_scores[2][0])
            new_disc_character = CHARACTER.get(top_disc, 'None')
        else:
            new_disc_character = 'None'

        if self.disc_character != new_disc_character:
            self.disc_character = new_disc_character
            self.save()

        return self.disc_character

    def __str__(self):
        return self.username

class WorkStyle(models.Model):
    name = models.CharField(max_length=50, unique=True)
    
    def __str__(self):
        return self.name

class Interest(models.Model):
    name = models.CharField(max_length=50, unique=True)
    
    def __str__(self):
        return self.name
    
class ProfileImage(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, null=True, blank=True, default=None, related_name='profile_image_object')
    image = models.ImageField(upload_to=PathAndRename('profile-images/'))
    uploaded_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Profile Image {self.id}"

class ShortQuestion(models.Model):
    question = models.CharField(max_length=100, unique=True)
    answer1 = models.CharField(max_length=50)
    answer2 = models.CharField(max_length=50)
    answer3 = models.CharField(max_length=50)
    answer4 = models.CharField(max_length=50)

    def __str__(self):
        return self.question

class LongQuestion(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, null=True, blank=True, related_name='longquestion_by')
    long_question = models.CharField(max_length=100)

    def __str__(self):
        return self.long_question

class QuestionAnswer(models.Model):
    question = models.ForeignKey('LongQuestion', on_delete=models.CASCADE)
    answer = models.TextField()

    def __str__(self):
        return f"{self.question}: {self.answer[:50]}"

class Score(models.Model):
    d_score = models.PositiveIntegerField()
    i_score = models.PositiveIntegerField()
    s_score = models.PositiveIntegerField()
    c_score = models.PositiveIntegerField()

    def __str__(self):
        return f"D: {self.d_score}, I: {self.i_score}, S: {self.s_score}, C: {self.c_score}"

class Feedback(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, null=True, blank=True, related_name='feedbacks_from')
    user_by = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, blank=True, related_name='feedbacks_by')
    work_styles = models.ManyToManyField('WorkStyle', blank=False)
    score = models.OneToOneField('Score', on_delete=models.CASCADE, blank=True, null=True)
    question_answers = models.ManyToManyField('QuestionAnswer', blank=True, related_name='feedbacks')

    def __str__(self):
        return f"Feedback to {self.user} by {self.user_by}"
    