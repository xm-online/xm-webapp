FROM node:16.13.0

LABEL version="0.0.1-SNAPSHOT"
LABEL description="XM^online webapp dev"

ADD install_chrome-stable.sh .
RUN chmod +x ./install_chrome-stable.sh
RUN ./install_chrome-stable.sh#

WORKDIR /app
ADD . /app
RUN npm i
RUN npm test:prod
