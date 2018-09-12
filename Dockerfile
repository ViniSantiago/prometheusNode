FROM node:10.5-alpine

WORKDIR /data/

ENV NODE_ENV=development

COPY package.json /data/

#ENV HTTP_PROXY=http://10.8.5.222:3128
#ENV HTTPS_PROXY=http://10.8.5.222:3128

RUN npm install && npm install -g nodemon

ENV NODE_PATH=/data/node_modules

ADD /src/ /var/app/

WORKDIR /var/app
EXPOSE 3443

CMD npm run start