.PHONY: up down restart logs migrate deploy-migrate seed studio rebuild

up:
	docker compose up -d --build
	@echo "Waiting for database to be ready and running migrations..."
	@sleep 5
	docker compose exec -T web pnpm prisma migrate deploy
	docker compose exec -T web pnpm prisma db seed
	@echo "Local development environment is running at http://localhost:3001"

down:
	docker compose down -v

restart:
	docker compose restart

logs:
	docker compose logs -f web

migrate:
	docker compose exec web pnpm prisma migrate dev

deploy-migrate:
	docker compose exec web pnpm prisma migrate deploy

seed:
	docker compose exec web pnpm prisma db seed

studio:
	docker compose exec -d web pnpm prisma studio --port 5555
	@echo "Prisma Studio is starting at http://localhost:5555"

rebuild:
	docker compose build --no-cache
