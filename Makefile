.PHONY: install dev build test lint typecheck docker-up docker-down seed clean

# Development
install:
	pnpm install

dev:
	pnpm run dev

dev-frontend:
	pnpm --filter frontend dev

dev-api:
	pnpm --filter api dev

# Build
build:
	pnpm run build

build-runner:
	docker build -t algo-learn-runner:latest packages/runner

# Database
seed:
	pnpm --filter api db:seed

migrate:
	pnpm --filter api db:migrate

# Quality
lint:
	pnpm run lint

typecheck:
	pnpm run typecheck

test:
	pnpm run test

test-integration:
	pnpm run test:integration

# Docker
docker-up:
	docker compose up --build -d

docker-down:
	docker compose down

docker-build:
	docker compose build

# Cleanup
clean:
	rm -rf node_modules packages/*/node_modules packages/*/dist data/*.db
