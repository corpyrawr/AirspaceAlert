FROM node:22
RUN apt-get update

WORKDIR /usr/app
COPY ./src /usr/app/src
COPY ./package.json /usr/app
COPY ./tsconfig.json /usr/app

RUN npm install
RUN npm run build
CMD npm run start