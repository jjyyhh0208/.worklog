from django.urls import reverse
from rest_framework import status
from rest_framework.test import APITestCase
from django.contrib.auth import get_user_model
from profiles.models import ProfileImage
from django.core.files.uploadedfile import SimpleUploadedFile
from profiles.models import Interest, WorkStyle
from django.core.files.storage import default_storage
from django.conf import settings

import shutil
import os

User = get_user_model()

# UserNameFeedbackStyleView Test
class TestUserNameFeedbackStyleView(APITestCase):
    def setUp(self):
        self.user = User.objects.create_user(
            username="testuser",
            password="password123",
            name="Test User",
            feedback_style="soft",
        )
        self.client.login(username="testuser", password="password123")
        self.url = reverse("user-info-update")

    def test_update_user_info(self):
        data = {"name": "Updated User", "feedback_style": "hard"}
        response = self.client.put(self.url, data, format="json")
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data["data"]["name"], "Updated User")
        self.assertEqual(response.data["data"]["feedback_style"], "hard")
        
        
# UserWorkStyleView Test
class TestUserWorkStyleView(APITestCase):
    def setUp(self):
        self.user = User.objects.create_user(
            username="testuser", password="password123"
        )
        self.client.login(username="testuser", password="password123")
        
        #테스트 환경에서는 sqlite이기 때문에 초기데이터가 없음 -> 추가해주는 작업
        WorkStyle.objects.create(id=3, name="열정적인")
        WorkStyle.objects.create(id=5, name="소심한")
        WorkStyle.objects.create(id=6, name="리더십있는")
        
        self.url = reverse("user-work-style-update")

    def test_update_work_style(self):
        data = {"work_styles": [3, 5, 6]}
        response = self.client.put(self.url, data, format="json")
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data["data"]["work_styles"], [3, 5, 6])
        
        
# UserInterestView Test
class TestUserInterestView(APITestCase):
    def setUp(self):
        self.user = User.objects.create_user(
            username="testuser", password="password123"
        )
        self.client.login(username="testuser", password="password123")
        
        #테스트 환경에서는 sqlite이기 때문에 초기데이터가 없음 -> 추가해주는 작업
        Interest.objects.create(id=2, name="개발")
        Interest.objects.create(id=4, name="회계")
        Interest.objects.create(id=6, name="미술")
        
        self.url = reverse("user-work-interest-update")

    def test_update_interest(self):
        data = {"interests": [2, 4, 6]}
        response = self.client.put(self.url, data, format="json")

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data["data"]["interests"], [2, 4, 6])
        

class TestProfileImageView(APITestCase):
    def setUp(self):
        self.user = User.objects.create_user(
            username="testuser", password="password123"
        )
        self.client.login(username="testuser", password="password123")
        self.url = reverse("profile-image-upload")

    def test_upload_profile_image(self):
        image = SimpleUploadedFile(
            "image.jpg", b"file_content", content_type="image/jpeg"
        )
        response = self.client.post(self.url, {"image": image})
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data["message"], "Profile image updated successfully")

    def test_delete_profile_image(self):
        ProfileImage.objects.create(user=self.user, image="path/to/image.jpg")
        response = self.client.delete(self.url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data["message"], "Profile image deleted successfully")

    def tearDown(self):
        profile_image = ProfileImage.objects.filter(user=self.user).first()
        if profile_image and profile_image.image:
            if default_storage.exists(profile_image.image.path):
                default_storage.delete(profile_image.image.path)

        # 프로필 이미지 디렉토리 삭제
        profile_images_dir = os.path.join(settings.MEDIA_ROOT, 'profile_images')
        if os.path.exists(profile_images_dir):
            shutil.rmtree(profile_images_dir)
        
        
# UpdateBioView Test
class TestUpdateBioView(APITestCase):
    def setUp(self):
        self.user = User.objects.create_user(
            username="testuser", password="password123"
        )
        self.client.login(username="testuser", password="password123")
        self.url = reverse("update-bio")

    def test_update_bio(self):
        data = {"bio": "Hello World~!"}
        response = self.client.put(self.url, data, format="json")
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data["bio"], "Hello World~!")