FROM node:18-alpine

WORKDIR /app

COPY . .

ENV NODE_ENV development

RUN yarn install

EXPOSE 1337

CMD ["yarn", "dev"]

