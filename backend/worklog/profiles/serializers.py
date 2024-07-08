from .models import *
from rest_framework import serializers
from dj_rest_auth.registration.serializers import RegisterSerializer
from rest_framework.authtoken.models import Token
from rest_framework.validators import UniqueValidator


class WorkStyleSerializer(serializers.ModelSerializer):
    class Meta:
        model = WorkStyle
        fields = '__all__'
    
    
class InterestSerializer(serializers.ModelSerializer):
    class Meta:
        model = Interest
        fields = '__all__'
        
        
#회원가입 후 유저의 업무 성향, 관심 직종 설정하기 위해 사용
#PrimaryKeyRelatedField를 사용하여 유저의 업무 성향, 관심 직종을 설정할 수 있도록 함 -> 유저가 선택하여 특정 업무 성향, 관심 직종을 선택할 수 있도록 함
class UserWorkInterestSerializer(serializers.ModelSerializer):
    work_styles = serializers.PrimaryKeyRelatedField(queryset=WorkStyle.objects.all(), many=True)
    interests = serializers.PrimaryKeyRelatedField(queryset = Interest.objects.all(), many = True)
    
    class Meta:
        model = User
        fields = ('work_styles', 'interests')
        
    def update(self, instance, validated_data):
        
        #클라이언트에서 보낸 유저의 (초기 설정) 데이터를 가지고 유저 인스턴스의 work_styles, interests 필드에 추가
        #왜 변수에 따로 빼놓은건가요? -> 클라이언트가 보낸 요청(validated_data)의 work_styles, interests 데이터를 따로 빼놓고 유저 인스턴스의 work_styles, interests 필드에 추가하는 작업을 하기 위함
        work_styles_data = validated_data.pop('work_styles', [])
        interests_data = validated_data.pop('interests', [])
        
        #클라이언트에서 보낸 유저의 초기 설정 데이터를 가지고 유저 인스턴스의 work_styles, interests 필드에 추가
        instance.work_styles.set(work_styles_data)
        instance.interests.set(interests_data)

        instance.save()
        return instance
    
    
#업무 성향, 관심 직종 설정 이후 유저의 이름, 성별, 나이 설정하기 위해 사용    
class UserGenderNameAgeSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ('id','name', 'gender', 'age')
        
    def update(self,instance, validated_data):
        #이름, 성별, 출생연도 설정
        instance.name = validated_data.get('name', instance.name)
        instance.gender = validated_data.get('gender', instance.gender)
        instance.age = validated_data.get('age', instance.age)
        
        instance.save()
        return instance
        

#회원가입 시 유저의 id, 비번 설정하기 위해 사용
#토큰을 받아오기 위해 기능 추가
class UserRegisterSerializer(RegisterSerializer):
    class Meta:
        model = User
        fields = ('id', 'password1', 'password2')
        
    def save(self, request):
        user = super().save(request)
        token, created = Token.objects.get_or_create(user=user)
        self.token = token.key
        return user

    def get_response_data(self, user):
        data = super().get_response_data(user)
        data['token'] = self.token
        return data
    
    
#유저프로필 조회 시 유저의 이름, 성별, 나이, 업무 성향, 관심 직종, gpt 요약, disc유형을 조회하기 위해 사용
class UserProfileSerializer(serializers.ModelSerializer):
    work_styles = WorkStyleSerializer(many=True)
    interests = InterestSerializer(many=True)
    
    class Meta:
        model = User
        fields = ('name', 'gender', 'age', 'work_styles', 'interests', 'disc_character', 'gpt_summarized_personality')

# 아이디 중복 검사를 위한 로직
class UserUniqueusernameSerializer(serializers.ModelSerializer):
    username = serializers.CharField(required=True, min_length=3, max_length=30)

    class Meta:
        model = User
        fields = ('id',)