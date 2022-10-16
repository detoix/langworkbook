FROM node:16-alpine
WORKDIR /usr/src
COPY ./server ./server
RUN npm install --prefix ./server
COPY ./client/build ./client/build
EXPOSE 8080
ENTRYPOINT [ "node", "server/index.js" ]