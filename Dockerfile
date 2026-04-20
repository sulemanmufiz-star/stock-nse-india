FROM node:20-alpine

WORKDIR /app

COPY . .

ENV TZ="Asia/Kolkata"
ENV NODE_ENV=production
ENV PORT=3001

# Give tsc more memory + skip engine check
RUN yarn install --ignore-engines && \
    NODE_OPTIONS="--max-old-space-size=4096" ./node_modules/.bin/tsc && \
    ./node_modules/.bin/copyfiles -f "./src/**/*.graphql" build/graphql-schema

EXPOSE 3001

CMD ["node", "build/server.js"]
