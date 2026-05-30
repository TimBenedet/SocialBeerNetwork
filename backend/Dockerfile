# SocialBeerNetwork backend — Node + Express + better-sqlite3
FROM node:20-alpine

WORKDIR /app

# better-sqlite3 compiles a native addon → needs build tools on alpine (musl).
RUN apk add --no-cache python3 make g++

# install only production deps (compiles better-sqlite3 against this image)
COPY package.json package-lock.json* ./
RUN npm install --omit=dev

EXPOSE 3001
ENV PORT=3001
ENV DATA_DIR=/data

COPY server.js ./

CMD ["node", "server.js"]
