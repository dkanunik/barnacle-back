FROM node:8
WORKDIR /barnacle
COPY package*.json ./
RUN npm install
COPY . .
EXPOSE 3000
CMD [ "npm", "run", "back:start" ]
