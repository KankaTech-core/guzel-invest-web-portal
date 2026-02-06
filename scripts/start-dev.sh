#!/bin/bash

# Color codes
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo "${GREEN}🚀 Starting Güzel Invest Development Environment...${NC}"

# 1. Start Docker Containers
echo "${GREEN}📦 Starting Docker services (PostgreSQL & MinIO)...${NC}"
docker-compose up -d

# 2. Check if Port 3000 is in use and kill the process
PORT=3000
PID=$(lsof -ti :$PORT)

if [ -n "$PID" ]; then
  echo "${YELLOW}⚠️  Port $PORT is already in use by process $PID. Killing it...${NC}"
  kill -9 $PID
  echo "${GREEN}✅ Process on port $PORT killed.${NC}"
fi

# 3. Start Next.js App
echo "${GREEN}💻 Starting Next.js server...${NC}"
npm run dev
