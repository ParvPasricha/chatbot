FROM node:18-alpine AS build
WORKDIR /app
COPY package.json ./
COPY tsconfig.json ./
COPY app/shared/package.json ../shared/package.json
COPY app/widget ./src
RUN npm install && npm run build

FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html
