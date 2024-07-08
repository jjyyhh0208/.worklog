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
