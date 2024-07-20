from django.contrib import admin
from .models import (
    User, ShortQuestion, LongQuestion,
    QuestionAnswer, Score, Feedback, ProfileImage)

# Register your models here.
admin.site.register(User)
admin.site.register(ShortQuestion)
admin.site.register(LongQuestion)
admin.site.register(QuestionAnswer)
admin.site.register(Score)
admin.site.register(Feedback)

@admin.register(ProfileImage)
class ProfileImageAdmin(admin.ModelAdmin):
    list_display = ('id', 'image')