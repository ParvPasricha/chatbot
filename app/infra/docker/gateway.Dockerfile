FROM node:18-alpine
WORKDIR /app
COPY ../../package.json ./
COPY ../../tsconfig.json ./
COPY ../../app ./app
RUN npm install --workspaces --include-workspace-root=false \
  && npm run build --workspace @chatbot/gateway
CMD ["node", "app/gateway/dist/index.js"]
