FROM node:24-alpine
WORKDIR /app
ENV NG_CLI_ANALYTICS=false
COPY package.json package-lock.json ./
RUN npm ci --no-audit --no-fund
COPY . .
RUN npm run build:demo && npm run build
EXPOSE 4200
CMD ["npm", "start"]
