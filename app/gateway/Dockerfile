FROM node:18-alpine AS deps
WORKDIR /app
COPY package.json ./
COPY tsconfig.json ./
COPY app/shared/package.json app/shared/
COPY app/gateway/package.json app/gateway/
RUN npm install --workspaces --include-workspace-root=false

FROM node:18-alpine AS build
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY package.json ./
COPY tsconfig.json ./
COPY app ./app
RUN npm run build --workspace @chatbot/gateway

FROM node:18-alpine
WORKDIR /srv/app
COPY --from=build /app/app/gateway/dist ./dist
COPY app/gateway/package.json ./package.json
RUN npm install --production
CMD ["node", "dist/index.js"]
