FROM node:20-alpine

RUN corepack enable && corepack prepare pnpm@latest --activate

WORKDIR /app

COPY package.json ./
RUN pnpm install --prod=false

COPY . .

RUN pnpm run build || true

EXPOSE 3001

CMD ["node", "--import", "tsx", "src/index.ts"]
