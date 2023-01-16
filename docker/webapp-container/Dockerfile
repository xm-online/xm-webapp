FROM node:14.16.1
WORKDIR /app
EXPOSE 4200 49153
EXPOSE 80 19999
LABEL version="0.0.1-SNAPSHOT"
LABEL description="XM^online webapp container"
ADD ./ /app
RUN cd ./app && npm i
