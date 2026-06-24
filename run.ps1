param (
    [Parameter(Position=0)]
    [ValidateSet("up", "down", "logs", "migrate", "seed", "studio")]
    [string]$Action = "up"
)

switch ($Action) {
    "up" {
        docker compose up -d --build
        Write-Host "Waiting for database to be ready and running migrations..."
        Start-Sleep -Seconds 5
        docker compose exec -T web pnpm prisma migrate dev --name init
        Write-Host "Local development environment is running at http://localhost:3001"
    }
    "down" {
        docker compose down -v
    }
    "logs" {
        docker compose logs -f web
    }
    "migrate" {
        docker compose exec web pnpm prisma migrate dev
    }
    "seed" {
        docker compose exec web pnpm prisma db seed
    }
    "studio" {
        docker compose exec -d web pnpm prisma studio --port 5555
        Write-Host "Prisma Studio is starting at http://localhost:5555"
    }
}
