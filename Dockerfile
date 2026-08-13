FROM node:20-alpine

WORKDIR /app

ADD package.json package-lock.json* /app/
RUN npm install

ADD . /app
RUN npm run build

ARG NODE_ENV
ENV NODE_ENV $NODE_ENV

RUN npm prune --production

FROM node:20-alpine

EXPOSE 3000

WORKDIR /app

COPY --from=0 /app/dist ./dist
COPY --from=0 /app/node_modules ./node_modules
COPY --from=0 /app/package.json ./package.json
COPY --from=0 /app/.env.example ./.env.example

CMD ["node", "dist/index.js"]