build:
	cd frontend/ && npm run build
	docker-compose build
npm-install:
	cd backend/ && npm i
	cd frontend/ && npm i
local-run-frontend-test:
	cd frontend/ && npm start

up:
	docker-compose up -d
local-run-backend-test: up
	docker logs -f node-backend
down:
	docker-compose down