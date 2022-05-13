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
connect:
	autossh -M 10086 -N  -R 10083:127.0.0.1:10083 -R 10084:127.0.0.1:10084 -N -i ./lightsail_bitnami.pem bitnami@52.76.77.52
