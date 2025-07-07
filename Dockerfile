# PRIMEIRO ESTÁGIO - Build
FROM node:18-alpine AS builder

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install

COPY . .

RUN npm run build

# SEGUNDO ESTÁGIO - Imagem Final de Produção

FROM node:18-alpine

WORKDIR /usr/src/app

COPY package*.json ./

# Instalando apenas as dependências de produção
RUN npm install --only=production

# Copiando código do 'builder'
COPY --from=builder /usr/src/app/dist ./dist

EXPOSE 3000

CMD [ "node", "dist/server.js" ]