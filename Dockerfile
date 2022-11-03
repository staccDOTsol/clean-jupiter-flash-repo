FROM node:lts-alpine
RUN apk add --upgrade coreutils
ENV NODE_ENV=production
WORKDIR /usr/src/app
COPY ["package.json", "package-lock.json*", "npm-shrinkwrap.json*", "./"]
RUN npm install yarn ts-node -g --force
RUN yarn install --force  && mv node_modules ../

COPY . .
RUN cp -r buffer-layout/* ../node_modules/@solana/buffer-layout/ 
RUN chown -R node /usr/src/app
USER node
EXPOSE 3000
CMD ["yarn", "start"]
