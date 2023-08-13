# Rootから実行する
# docker build -f ./packages/graphql-server .
FROM node:18-slim

WORKDIR /usr/src/app

COPY ./packages/graphql-server ./packages/graphql-server
COPY package*.json ./

RUN npm ci

ENV PORT 8000
# ENV NODE_ENV=production

RUN npm run build -w graphql-server
COPY ./packages/graphql-server/dist ./packages/graphql-server/dist

CMD ["npm", "run", "start", "-w", "graphql-server"]