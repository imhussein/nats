FROM node:alpine
LABEL maintainer="complex"
RUN mkdir app
WORKDIR /app
COPY ./package.json .
RUN npm install --only=prod
COPY . .
CMD ["npm", "start"]