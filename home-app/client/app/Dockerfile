FROM node:12-buster-slim

RUN mkdir -p /usr/src/app

WORKDIR /usr/src/app

COPY package.json /usr/src/app
COPY yarn.lock /usr/src/app
COPY /public /usr/src/app

RUN yarn install

COPY . /usr/src/app

RUN yarn build

CMD [ "yarn", "start" ]