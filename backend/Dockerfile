FROM node:20-alpine

WORKDIR /app

ENV NODE_ENV=production
ENV HOST=0.0.0.0
ENV PORT=4000

COPY package.json ./
RUN npm install --omit=dev

COPY src ./src
COPY /src/data ./data

EXPOSE 4000

CMD ["node", "src/server.js"]
