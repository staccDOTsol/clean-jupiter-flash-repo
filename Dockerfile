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
#RUN cat /etc/resolv.conf | sed -r "s/^(search.*|options.*)/#\1/" > /tmp/resolv && cat /tmp/resolv > /etc/resolv.conf
#RUN echo "nameserver 1.1.1.1" >> /tmp/resolv && echo "nameserver 8.8.8.8" >> /tmp/resolv && cat /tmp/resolv > /etc/resolv.conf
USER node
EXPOSE 3000
CMD ["yarn", "start"]
