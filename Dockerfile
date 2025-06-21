FROM node:22-alpine

# Create app directory
WORKDIR /app

# Install app dependencies
COPY package.json ./
COPY yarn.lock ./

RUN yarn

# Bundle app source
COPY . .

# Build client
RUN cd client \
  && yarn install --production \
  && yarn run build \
  && rm -rf src public node_modules

EXPOSE 8000

CMD ["node", "server.js"]