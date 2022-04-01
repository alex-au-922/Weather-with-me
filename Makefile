build:
	cd frontend/ && npm run build
	docker-compose build
npm-install:
	cd backend/ && npm i
	cd frontend/ && npm i
up:
	docker-compose up -d
down:
	docker-compose down