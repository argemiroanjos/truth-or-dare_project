FROM node:18-alpine

WORKDIR /usr/src/app

COPY package*.json ./
COPY packages/api/package*.json ./packages/api/
COPY packages/ui/package*.json ./packages/ui/
COPY packages/common/package*.json ./packages/common/

RUN npm install

COPY . .

EXPOSE 3000