#!/bin/bash

# 이전 컨테이너 중지 및 제거
docker-compose down

# 최신 이미지 가져오기
docker-compose pull

# 컨테이너 시작
docker-compose up -d

# 로그 확인
docker-compose logs -f 