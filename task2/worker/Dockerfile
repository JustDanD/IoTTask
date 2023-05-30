FROM node:latest

RUN apt-get -y update

COPY . .

RUN npm install

CMD [ "node", "index.js" ]

