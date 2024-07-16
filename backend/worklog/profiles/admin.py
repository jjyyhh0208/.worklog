from django.contrib import admin
from .models import (
    User, ShortQuestion, LongQuestion,
    QuestionAnswer, Score, Feedback,
    Strength, Weakness, SuitableType,
    DISCData)

# Register your models here.
admin.site.register(User)
admin.site.register(ShortQuestion)
admin.site.register(LongQuestion)
admin.site.register(QuestionAnswer)
admin.site.register(Score)
admin.site.register(Feedback)

admin.site.register(Strength)
admin.site.register(Weakness)
admin.site.register(SuitableType)
admin.site.register(DISCData)