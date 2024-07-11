from django.contrib.auth.models import AbstractUser
from django.db import models

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
    disc_character = models.CharField(max_length=50, blank=True)
    gpt_summarized_personality = models.TextField(blank=True)
    
    @property
    def feedback_count(self):
        return self.feedbacks_from.count()

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
    feedback = models.ForeignKey('Feedback', on_delete=models.CASCADE, related_name='question_answers')
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
    long_questions = models.ManyToManyField('QuestionAnswer', blank=False, related_name='feedbacks')

    def __str__(self):
        return f"Feedback to {self.user_by if self.user is None else self.user.username}"