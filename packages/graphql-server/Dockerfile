# Rootから実行する
# docker build -f ./packages/graphql-server .
FROM node:18-slim

WORKDIR /usr/src/app

COPY ./packages/graphql-server ./packages/graphql-server
COPY package*.json ./

RUN npm ci

ENV PORT 8080
ENV NODE_ENV=production

RUN npm run build -w graphql-server

CMD ["npm", "run", "start", "-w", "graphql-server"]