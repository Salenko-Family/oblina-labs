FROM node:24-alpine

WORKDIR /app

RUN chown node:node /app

COPY --chown=node:node package.json package-lock.json ./

USER node

RUN npm ci

COPY --chown=node:node . .
RUN npm run build

ENV HOST=0.0.0.0
ENV PORT=4321
EXPOSE 4321

CMD ["node", "./dist/server/entry.mjs"]