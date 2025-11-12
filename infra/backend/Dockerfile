FROM node:20-alpine AS builder
WORKDIR /app

RUN corepack enable
COPY package.json yarn.lock ./
RUN yarn install --frozen-lockfile
COPY . .
RUN yarn build

FROM node:20-alpine
WORKDIR /app
RUN corepack enable

COPY --from=builder /app/dist ./dist
COPY package.json yarn.lock tsconfig.json ./
RUN yarn install --production --frozen-lockfile && yarn cache clean

COPY uploads ./uploads

EXPOSE 4001
CMD ["node", "dist/main.js"]
