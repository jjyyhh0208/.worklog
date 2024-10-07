# backend/Dockerfile

# Python 기반 이미지 사용
FROM python:3.10-slim

# 작업 디렉토리 설정
WORKDIR /app

# Postgre와 연동하기 위한 명령어
RUN apt-get update && apt-get install -y \
    libpq-dev \
    gcc

# 파이썬 패키지 설치 -> 소스코드보다 먼저 COPY 하여 이미지 캐시를 최대한 활용
COPY requirements.txt requirements.txt
RUN pip install --no-cache-dir -r requirements.txt

# 소스 코드 복사
COPY . .

# 환경변수 설정
ENV PYTHONDONTWRITEBYTECODE 1
ENV PYTHONUNBUFFERED 1

# 장고 실행 명령어
CMD ["python", "manage.py", "runserver", "0.0.0.0:8000"]
