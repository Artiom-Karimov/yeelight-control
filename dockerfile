FROM node:lts-bullseye-slim
WORKDIR /usr/src/app
COPY . /usr/src/app/
RUN npm install && npm run build
CMD npm run start