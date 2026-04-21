FROM node:18.6.0
WORKDIR /app
COPY package*.json ./
COPY .npmrc ./
RUN npm install -g npm@9.8.1
RUN npm config set registry https://registry.npm.taobao.org/

RUN npm install
COPY . .
RUN npm run buildlocal