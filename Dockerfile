FROM node:18-alpine AS builder

WORKDIR /app

ADD package.json package-lock.json* /app/
RUN npm install

ADD . /app
RUN yarn build

ARG NODE_ENV
ENV NODE_ENV $NODE_ENV

RUN yarn --pure-lockfile

FROM node:18-alpine

EXPOSE 3000

WORKDIR /app

# install curl
RUN apk --no-cache add curl && rm -rf /var/cache/apk/*

COPY --from=builder /app .
