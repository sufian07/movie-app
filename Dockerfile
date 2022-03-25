FROM node:16.14.2 as development
RUN mkdir -p /usr/src/app && chown -R node:node /usr/src/app
WORKDIR /usr/src/app
COPY package*.json ./
RUN yarn install
COPY . .

ENV PATH /usr/src/app/node_modules/.bin:$PATH
COPY --chown=node:node . .
RUN yarn run build

CMD ["node", "dist/main"]