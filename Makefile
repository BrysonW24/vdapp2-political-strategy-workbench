.PHONY: help install dev build test clean

API_DIR = backend/api-server

help:
	@echo "Political Strategy Workbench - Available Commands"
	@echo ""
	@echo "Installation:"
	@echo "  make install          - Install all dependencies"
	@echo "  make install-frontend - Install frontend dependencies"
	@echo "  make install-backend  - Install backend dependencies"
	@echo ""
	@echo "Development:"
	@echo "  make dev              - Start both frontend and backend"
	@echo "  make dev-frontend     - Start frontend only"
	@echo "  make dev-backend      - Start backend only"
	@echo ""
	@echo "Build:"
	@echo "  make build            - Build for production"
	@echo "  make build-frontend   - Build frontend"
	@echo "  make build-backend    - Build backend"
	@echo ""
	@echo "Database:"
	@echo "  make db-setup         - Setup database"
	@echo "  make db-migrate       - Run migrations"
	@echo "  make db-studio        - Open Prisma Studio"
	@echo "  make db-reset         - Reset database"
	@echo ""
	@echo "Docker:"
	@echo "  make docker-up        - Start Docker containers"
	@echo "  make docker-down      - Stop Docker containers"
	@echo "  make docker-build     - Build Docker images"
	@echo ""
	@echo "Testing:"
	@echo "  make test             - Run all tests"
	@echo "  make lint             - Run linters"
	@echo ""
	@echo "Utilities:"
	@echo "  make clean            - Clean build artifacts"
	@echo "  make quick-start      - Install + setup + start dev"

install:
	@echo "Installing dependencies..."
	npm install
	cd $(API_DIR) && npm install
	@echo "Dependencies installed!"

install-frontend:
	@echo "Installing frontend dependencies..."
	npm install

install-backend:
	@echo "Installing backend dependencies..."
	cd $(API_DIR) && npm install

dev-frontend:
	npm run dev

dev-backend:
	cd $(API_DIR) && npm run start:dev

build:
	npm run build
	cd $(API_DIR) && npm run build

build-frontend:
	npm run build

build-backend:
	cd $(API_DIR) && npm run build

test:
	npm run test -- --run
	cd $(API_DIR) && npm run test

test-frontend:
	npm run test -- --run

test-backend:
	cd $(API_DIR) && npm run test

test-coverage:
	npm run test:coverage -- --run
	cd $(API_DIR) && npm run test:cov

db-setup:
	cd $(API_DIR) && npm run db:setup

db-migrate:
	cd $(API_DIR) && npm run prisma:migrate

db-generate:
	cd $(API_DIR) && npm run prisma:generate

db-push:
	cd $(API_DIR) && npm run prisma:push

db-studio:
	cd $(API_DIR) && npm run prisma:studio

db-reset:
	cd $(API_DIR) && npm run db:reset

docker-build:
	docker-compose -f docker-configs/docker-compose.yml build

docker-up:
	docker-compose -f docker-configs/docker-compose.yml up -d

docker-down:
	docker-compose -f docker-configs/docker-compose.yml down

docker-logs:
	docker-compose -f docker-configs/docker-compose.yml logs -f

docker-restart:
	docker-compose -f docker-configs/docker-compose.yml restart

lint:
	npm run lint
	cd $(API_DIR) && npm run lint

lint-fix:
	npm run lint:fix
	cd $(API_DIR) && npm run lint

format:
	npm run format
	cd $(API_DIR) && npm run format

typecheck:
	npm run typecheck
	cd $(API_DIR) && npm run type-check

clean:
	rm -rf .next node_modules dist
	cd $(API_DIR) && rm -rf dist node_modules

clean-build:
	rm -rf .next
	cd $(API_DIR) && rm -rf dist

ci:
	make install
	make lint
	make typecheck
	make test
	make build

quick-start:
	make install
	make db-setup
	@echo "Setup complete! Run 'make dev-frontend' and 'make dev-backend' in separate terminals"
