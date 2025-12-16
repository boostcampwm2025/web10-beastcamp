FROM node:24.12.0-alpine

WORKDIR /usr/src/app

COPY package*.json ./
RUN npm install
RUN apk add --no-cache bash

EXPOSE 3000

CMD ["bash"]