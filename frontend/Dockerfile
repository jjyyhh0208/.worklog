# frontend/Dockerfile

# Node.js 기반 이미지 사용
FROM node:16

# 작업 디렉토리 설정
WORKDIR /app

# 의존성 파일 복사 및 설치
COPY package.json yarn.lock ./
RUN yarn install

# 애플리케이션 소스 복사
COPY . .

# 빌드 실행
RUN yarn build

# 서버 실행
CMD ["yarn", "start"]
