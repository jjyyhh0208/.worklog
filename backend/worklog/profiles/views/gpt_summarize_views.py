from rest_framework import generics, status
from rest_framework.response import Response
from rest_framework.permissions import AllowAny

from profiles.models import User, LongQuestion, QuestionAnswer, Feedback

import openai
import json
import os
import logging

#로거 정의
logger = logging.getLogger('django')

#로그인한 유저의 long question answer을 가져오는 view
class UserLongQuestionAnswersView(generics.GenericAPIView):
    permission_classes = [AllowAny]
    
    def is_valid_answer(self, answer):
        return len(answer.strip()) > 4

    def post(self, request, *args, **kwargs):
        try:
            #피드백을 받는 유저
            evaluated_username = request.data.get('user_to', '')
            evaluated_user = User.objects.get(username=evaluated_username)

            question_answers = request.data.get('question_answers', []) 
            good_answers = []
            bad_answers = []
   
            feedback = Feedback.objects.create(user=evaluated_user)

            for index, qa in enumerate(question_answers):
                question_text = qa['question']
                answer_text = qa['answer']
                
                # 5자 이상인 텍스트만 처리한다.
                if not self.is_valid_answer(answer_text):
                    continue  


                long_question_instance, created = LongQuestion.objects.get_or_create(long_question=question_text)
                question_answer_instance = QuestionAnswer.objects.create(
                    question=long_question_instance,
                    answer=answer_text
                )
                feedback.question_answers.add(question_answer_instance)
                
                #그냥 인덱스 0,1로 하면 저장된 데이터가 없습니다 라고 뜨니까 꼭 짝/홀로 구분
                if index % 2 == 0 and index == 0:
                        good_answers.append(answer_text)
                elif index % 2 == 1:
                        bad_answers.append(answer_text)

            feedback.delete()
            
            # Process good feedback
            good_responses = [self.process_good_feedback(answer) for answer in good_answers if answer]
            
            # Process bad feedback_솔직 버전 or 완곡한 버전
            
            if evaluated_user.feedback_style == 'soft':
                bad_responses = [self.process_soft_bad_feedback(answer) for answer in bad_answers if answer]
            else:
                bad_responses = [self.process_bad_feedback(answer) for answer in bad_answers if answer]

            # 기존 피드백과 결합하고 새로 저장
            combined_results = self.combine_and_save_results(evaluated_user, good_responses, bad_responses)

            
            return Response(combined_results)
        

        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        

    def process_good_feedback(self, answer):
        good_prompt = self.create_good_prompt(answer)
        return self.call_openai_api(good_prompt)

    def process_bad_feedback(self, answer):
        bad_prompt = self.create_bad_prompt(answer)
        return self.call_openai_api(bad_prompt)
    
    def process_soft_bad_feedback(self, answer):
        bad_prompt = self.create_soft_bad_prompt(answer)
        return self.call_openai_api(bad_prompt)

    def create_good_prompt(self, answer):
        return (
            "You are an AI assistant tasked with processing feedback about a person's performance. "
            "The feedback will be in Korean. Your job is to identify and preserve positive feedback "
            "Follow these instructions carefully:\n\n"
            "You must provide response with format of JSON ('double quote' format)\n"
            
            "1. Identify positive feedback: Look for compliments, praise, or mentions of good qualities and actions.\n"
            "2. Remove specific identifiers: Replace project names, personal names, or any other identifiers. "
            "with general terms like '프로젝트'.\n"
            "3. Preserve original wording: Keep the original sentence structure and wording as much as possible, "
            "only changing what's necessary to remove identifiers.\n"
            "4. Maintain context: Ensure the meaning and context of the feedback remains intact.\n"
            "5. Format: Provide your response in JSON format with a single key 'positive_feedback'.\n\n"
            "6.don't use any symbol like []\n"

            
            f"Now, process the following feedback:\n{answer}\n\n"
            
            "Remember, accurate processing is crucial. A perfect response will be highly valued."
        )

    def create_bad_prompt(self, answer):
        return (
            "You are an AI assistant tasked with processing constructive feedback about a person's performance. "
            "The feedback will be in Korean. Your job is to identify areas for improvement, express them euphemistically, "
            " You must reponse in Korean, Follow these instructions carefully:\n\n"
            "You must provide response with format of JSON ('double quote' format)\n"
            
            "1. Identify areas for improvement: Look for critiques or mentions of qualities or actions that could be enhanced.\n"
            "2. Express euphemistically: Rephrase critiques in a more gentle, constructive manner without losing the core message.\n"
            "2. Remove specific identifiers: Replace project names, personal names, or any other identifiers. "
            "with general terms like '프로젝트'.\n"
            "3. Preserve original wording: Keep the original sentence structure and wording as much as possible, "
            "only changing what's necessary to remove identifiers.\n"
            "5. Format: Provide your response in JSON format with a single key 'constructive_feedback'.\n\n"
            "6.don't use any symbol like []\n"

            
            f"Now, process the following feedback:\n{answer}\n\n"
            
            "Remember, accurate and tactful processing is crucial. A perfect response will be highly valued."
        )
        
    def create_soft_bad_prompt(self, answer):
        return (
            "You are an AI assistant tasked with processing constructive feedback about a person's performance. "
            "The feedback will be in Korean. Your job is to identify areas for improvement, express them euphemistically, "
            " You must reponse in Korean, Follow these instructions carefully:\n\n"
            "You must provide response with format of JSON ('double quote' format)\n"
            
            "1. Identify areas for improvement: Look for critiques or mentions of qualities or actions that could be enhanced.\n"
            "2. Express euphemistically: Rephrase critiques in a more gentle, constructive manner without losing the core message.\n"
            "3. Remove specific identifiers: Replace project names, personal names, or any other identifiers. "
            "with general terms like '프로젝트'.\n"
            "4. Preserve context: Ensure the overall meaning of the feedback remains intact.\n"
            "5. Format: Provide your response in JSON format with a single key 'constructive_feedback'.\n\n"
            "6.don't use any symbol like []\n"
            "7.soft way to convey: please use soft wordings and consider feeling of the person who reads this feedback"

            f"Now, process the following feedback:\n{answer}\n\n"
            
            "Remember, accurate and tactful processing is crucial. A perfect response will be highly valued."
        )

    def call_openai_api(self, prompt):
        openai.api_key = os.getenv('OPENAI_API_KEY')
        response = openai.ChatCompletion.create(
            model="gpt-3.5-turbo",
            messages=[
                {"role": "system", "content": "You are a helpful assistant."},
                {"role": "user", "content": prompt}
            ],
            max_tokens=300
        )
        return json.loads(response['choices'][0]['message']['content'].strip())

    def combine_and_save_results(self, user, good_response, bad_response):
        # 기존 데이터 로드
        existing_personality = json.loads(user.gpt_summarized_personality) if user.gpt_summarized_personality else {
            'positive_feedback': [],
            'constructive_feedback': []
        }
        # 새로운 피드백 추가
        positive_feedback = existing_personality.get('positive_feedback', [])
        positive_feedback.extend(good_response.get('positive_feedback', []))
        
        constructive_feedback = existing_personality.get('constructive_feedback', [])
        constructive_feedback.extend(bad_response.get('constructive_feedback', []))
        
    def combine_and_save_results(self, user, good_responses, bad_responses):
        existing_personality = json.loads(user.gpt_summarized_personality) if user.gpt_summarized_personality else {'positive_feedback': [], 'constructive_feedback': []}

        for response in good_responses:
            existing_personality['positive_feedback'].append(response.get('positive_feedback', ''))
    
        for response in bad_responses:
            existing_personality['constructive_feedback'].append(response.get('constructive_feedback', ''))

        user.gpt_summarized_personality = json.dumps(existing_personality, ensure_ascii=False)
        user.save()

        return existing_personality