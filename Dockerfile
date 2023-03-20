FROM node:16.13.0

WORKDIR /var/www/app

COPY . .

RUN npm install && \
    npm run lint  && \
    npm run build:prod

EXPOSE 3000

CMD ["npm", "run", "test:prod"]
