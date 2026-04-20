FROM node:20-alpine

WORKDIR /app

COPY . .

ENV TZ="Asia/Kolkata"
ENV NODE_ENV=production
ENV PORT=3001

RUN yarn install --ignore-engines && \
    NODE_OPTIONS="--max-old-space-size=4096" ./node_modules/typescript/bin/tsc && \
    ./node_modules/copyfiles/copyfiles -f "./src/**/*.graphql" build/graphql-schema && \
    rm -rf node_modules && \
    yarn install --ignore-engines --production

EXPOSE 3001

CMD ["node", "build/server.js"]
