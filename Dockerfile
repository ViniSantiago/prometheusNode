FROM node:10.5-alpine
WORKDIR /var/app
ADD package.json /var/app/
ADD /src/ /var/app/
ENV HTTP_PROXY=http://10.8.5.222:3128
ENV HTTPS_PROXY=http://10.8.5.222:3128
RUN npm install
EXPOSE 3443
CMD ["node", "api.js"]