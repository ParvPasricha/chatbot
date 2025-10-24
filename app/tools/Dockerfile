FROM node:18-alpine AS deps
WORKDIR /app
COPY package.json ./
COPY tsconfig.json ./
COPY app/shared/package.json app/shared/
COPY app/tools/kb_search/package.json app/tools/kb_search/
COPY app/tools/product_adapter/package.json app/tools/product_adapter/
COPY app/tools/lead/package.json app/tools/lead/
COPY app/tools/handoff/package.json app/tools/handoff/
RUN npm install --workspaces --include-workspace-root=false

FROM node:18-alpine AS build
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY package.json ./
COPY tsconfig.json ./
COPY app ./app
RUN npm run build --workspace @chatbot/kb-search \
  && npm run build --workspace @chatbot/product-adapter \
  && npm run build --workspace @chatbot/lead \
  && npm run build --workspace @chatbot/handoff

FROM node:18-alpine
WORKDIR /srv/app
COPY --from=build /app/app/tools ./tools
CMD ["node", "tools/kb_search/dist/index.js"]
