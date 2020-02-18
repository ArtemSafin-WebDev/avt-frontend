FROM node:alpine
#FROM node:6.9

WORKDIR /srv/www/app


ADD package.json .
ADD package-lock.json .

#USER app

RUN rm -rf node_modules && npm install --no-cache && npm i react-yandex-metrika && rm -rf ~/tmp/*

ADD . .

RUN npm run build:prod
EXPOSE 5000

CMD npm start:prod



