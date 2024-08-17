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


class ProfileImageSerializer(serializers.ModelSerializer):
    image = serializers.SerializerMethodField()

    class Meta:
        model = ProfileImage
        fields = ['image', 'uploaded_at']

    def get_image(self, obj):
        if obj.image:
            full_url = obj.image.url
            path = full_url.split('.com/')[-1]
            
            # Construct a new URL without the bucket name
            return f"{path}"
        return None



#회원가입 후 유저의 이름, 성별, 나이 설정하기 위해 사용    
class UserGenderNameAgeSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ('name', 'feedback_style')
        
    def update(self,instance, validated_data):
        #이름, 성별, 출생연도 설정
        instance.name = validated_data.get('name', instance.name)
        instance.feedback_style = validated_data.get('feedback_style', instance.feedback_style)
        
        instance.save()
        return instance       
        
# 이름, 성별, 나이 설정 이후 유저의 업무 성향, 관심 직종 설정하기 위해 사용
# PrimaryKeyRelatedField를 사용하여 유저의 업무 성향, 관심 직종을 설정할 수 있도록 함 -> 유저가 선택하여 특정 업무 성향, 관심 직종을 선택할 수 있도록 함
# (참고) 온보딩 과정 분리로 인해 엔드포인트도 분리하여 진행함
class UserWorkStyleSerializer(serializers.ModelSerializer):
    work_styles = serializers.PrimaryKeyRelatedField(queryset=WorkStyle.objects.all(), many=True)
    
    class Meta:
        model = User
        fields = ('work_styles', )
        
    def update(self, instance, validated_data):
        
        #클라이언트에서 보낸 유저의 (초기 설정) 데이터를 가지고 유저 인스턴스의 work_styles, interests 필드에 추가
        #왜 변수에 따로 빼놓은건가요? -> 클라이언트가 보낸 요청(validated_data)의 work_styles, interests 데이터를 따로 빼놓고 유저 인스턴스의 work_styles, interests 필드에 추가하는 작업을 하기 위함
        work_styles_data = validated_data.pop('work_styles', [])
        
        #클라이언트에서 보낸 유저의 초기 설정 데이터를 가지고 유저 인스턴스의 work_styles, interests 필드에 추가
        instance.work_styles.set(work_styles_data)

        instance.save()
        return instance
    
class UserInterestSerializer(serializers.ModelSerializer):
    interests = serializers.PrimaryKeyRelatedField(queryset = Interest.objects.all(), many = True)
    
    class Meta:
        model = User
        fields = ('interests', )
        
    def update(self, instance, validated_data):
        
        #클라이언트에서 보낸 유저의 (초기 설정) 데이터를 가지고 유저 인스턴스의 work_styles, interests 필드에 추가
        #왜 변수에 따로 빼놓은건가요? -> 클라이언트가 보낸 요청(validated_data)의 work_styles, interests 데이터를 따로 빼놓고 유저 인스턴스의 work_styles, interests 필드에 추가하는 작업을 하기 위함
        interests_data = validated_data.pop('interests', [])
        
        #클라이언트에서 보낸 유저의 초기 설정 데이터를 가지고 유저 인스턴스의 work_styles, interests 필드에 추가
        instance.interests.set(interests_data)

        instance.save()
        return instance
        

#회원가입 시 유저의 id, 비번 설정하기 위해 사용
#토큰을 받아오기 위해 기능 추가
class UserRegisterSerializer(RegisterSerializer):
    class Meta:
        model = User
        fields = ('username', 'password1', 'password2')
        
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
    profile_image = ProfileImageSerializer(source='profile_image_object', read_only=True)
    feedback_count = serializers.SerializerMethodField()
    feedback_workstyles = serializers.SerializerMethodField()
    disc_scores = serializers.SerializerMethodField()
    disc_character = serializers.SerializerMethodField()
     
    class Meta:
        model = User
        fields = (
            'username', 'name', 'gender', 'age', 'work_styles', 'interests', 
            'disc_character', 'gpt_summarized_personality', 'profile_image', 
            'feedback_count','disc_scores', 'feedback_workstyles','bio'
        )

    def get_feedback_count(self, obj):
        return obj.feedback_count
    
    def get_feedback_workstyles(self, obj):
        return obj.calculate_workstyles
    
    def get_disc_scores(self, obj):
        return obj.calculate_disc_scores
    
    def get_disc_character(self, obj):
        return obj.calculate_disc_character




# 친구목록을 보여주는 모델    
class FriendSerializer(serializers.ModelSerializer):
    profile_image = ProfileImageSerializer(source='profile_image_object', read_only=True)
    class Meta:
        model = User
        fields = ['username', 'name', 'disc_character', 'profile_image', 'feedback_count']

# 유저 검색 모델
class UserSearchResultSerializer(serializers.ModelSerializer):
    profile_image = ProfileImageSerializer(source='profile_image_object', read_only=True)
    class Meta:
        model = User
        fields = ['username', 'name', 'profile_image']
    
# 아이디 중복 검사를 위한 로직
class UserUniqueIdSerializer(serializers.ModelSerializer):
    username = serializers.CharField(required=True, min_length=3, max_length=30)

    class Meta:
        model = User
        fields = ('username',)

# 서술형 기본 모델
class LongQuestionSerializer(serializers.ModelSerializer):
    class Meta:
        model = LongQuestion
        fields = ['user', 'long_question']
    
    def get_user(self, obj):
        return obj.user.username


# 서술형 질문 - 답 기본 모델
class QuestionAnswerSerializer(serializers.ModelSerializer):
    question = LongQuestionSerializer()

    class Meta:
        model = QuestionAnswer
        fields = ['question', 'answer']


# 점수 모델
class ScoreSerializer(serializers.ModelSerializer):
    class Meta:
        model = Score
        fields = ['d_score', 'i_score', 's_score', 'c_score']


# 단답형 질문
class ShortQuestionSerializer(serializers.ModelSerializer):
    class Meta:
        model = ShortQuestion
        fields = ['id', 'question', 'answer1', 'answer2', 'answer3', 'answer4']

class FeedbackSerializer(serializers.ModelSerializer):
    user = serializers.SlugRelatedField(slug_field='username', queryset=User.objects.all(), allow_null=True)
    user_by = serializers.SlugRelatedField(slug_field='username', queryset=User.objects.all(), allow_null=True)
    work_styles = serializers.ListField(write_only=True, child=serializers.DictField())
    score = ScoreSerializer(allow_null=True)
    question_answers = QuestionAnswerSerializer(many=True)  # Removed source keyword

    class Meta:
        model = Feedback
        fields = ['id', 'user', 'user_by', 'work_styles', 'score', 'question_answers']

    def create(self, validated_data):
        work_styles_data = validated_data.pop('work_styles')
        score_data = validated_data.pop('score', None)
        question_answers_data = validated_data.pop('question_answers')
        
        # User 관련 데이터는 이미 validated_data에 포함되어 있음
        feedback = Feedback.objects.create(**validated_data)
        
        # Workstyles
        for work_style_data in work_styles_data:
            name = work_style_data['name']
            work_style, created = WorkStyle.objects.get_or_create(name=name)
            feedback.work_styles.add(work_style)
        
        # Score Data
        if score_data:
            score = Score.objects.create(**score_data)
            feedback.score = score
        
        # Question - Answer pairs
        for question_answer_data in question_answers_data:
            question_data = question_answer_data.pop('question')
            question, created = LongQuestion.objects.get_or_create(**question_data)
            question_answer = QuestionAnswer.objects.create(question=question, **question_answer_data)
            feedback.question_answers.add(question_answer)
        
        feedback.save()
        return feedback

    def update(self, instance, validated_data):
        work_styles_data = validated_data.pop('work_styles')
        score_data = validated_data.pop('score', None)
        question_answers_data = validated_data.pop('question_answers')
        
        instance.user = validated_data.get('user', instance.user)
        instance.user_by = validated_data.get('user_by', instance.user_by)
        instance.save()

        # Workstyle
        for work_style_data in work_styles_data:
            try:
                work_style = WorkStyle.objects.get(name=work_style_data['name'])
            except WorkStyle.DoesNotExist:
                raise serializers.ValidationError(f"WorkStyle with name '{work_style_data['name']}' does not exist.")
            instance.work_styles.add(work_style)
        
        # Score
        if score_data:
            if instance.score:
                Score.objects.filter(id=instance.score.id).update(**score_data)
            else:
                instance.score = Score.objects.create(**score_data)
        
        # Question - Answer pairs
        instance.question_answers.clear()
        for question_answer_data in question_answers_data:
            question_data = question_answer_data.pop('question')
            question, created = LongQuestion.objects.get_or_create(**question_data)
            question_answer = QuestionAnswer.objects.create(question=question, **question_answer_data)
            instance.question_answers.add(question_answer)
        
        instance.save()
        return instance