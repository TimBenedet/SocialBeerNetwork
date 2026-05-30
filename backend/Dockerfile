# SocialBeerNetwork auth backend — Node + Express
FROM node:20-alpine

WORKDIR /app

# install only production deps
COPY package.json package-lock.json* ./
RUN npm install --omit=dev

# app code
COPY server.js ./

EXPOSE 3001
ENV PORT=3001

CMD ["node", "server.js"]
