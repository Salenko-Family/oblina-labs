FROM node:24-alpine

WORKDIR /app

RUN chown node:node /app

COPY --chown=node:node package.json package-lock.json ./

USER node

RUN npm ci

COPY --chown=node:node . .

ENV PORT=4321

EXPOSE 4321

CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0"]