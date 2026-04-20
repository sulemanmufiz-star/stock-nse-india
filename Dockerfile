FROM node:20-alpine

WORKDIR /app

COPY build/ build/
COPY package.json ./
COPY yarn.lock ./

ENV TZ="Asia/Kolkata"
ENV PORT=3001
ENV NODE_ENV=production

RUN yarn install --production --ignore-engines

EXPOSE 3001

CMD ["node", "build/server.js"]