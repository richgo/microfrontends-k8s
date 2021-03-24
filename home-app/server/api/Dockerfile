
FROM node:12-buster-slim
WORKDIR /usr/src/app
COPY package.json yarn.lock ./
RUN yarn install
COPY . ./

CMD [ "node", "gateway.js" ]