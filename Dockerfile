FROM node:10.5-alpine

WORKDIR /var/app

ENV NODE_ENV=production

COPY package.json /var/app/

#ENV HTTP_PROXY=http://10.8.5.222:3128
#ENV HTTPS_PROXY=http://10.8.5.222:3128

RUN npm install

ADD /src/ /var/app/

EXPOSE 3443

CMD ["npm", "start"]