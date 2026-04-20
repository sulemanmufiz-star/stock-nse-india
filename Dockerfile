FROM node:20-alpine

WORKDIR /app

COPY build/ build/
COPY src/ src/
COPY package.json ./
COPY yarn.lock ./

ENV TZ="Asia/Kolkata"
ENV NODE_ENV=production
ENV PORT=3001
ENV OPENAI_API_KEY=dummy-not-needed

RUN yarn install --production --ignore-engines

EXPOSE 3001

CMD ["node", "build/server.js"]