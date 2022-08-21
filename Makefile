.PHONY: migrate
migrate:
	docker-compose run --rm backend python manage.py migrate

.PHONY: makemigrations
makemigrations:
	docker-compose run --rm backend python manage.py makemigrations

.PHONY: createsuperuser
createsuperuser:
	docker-compose run --rm backend python manage.py createsuperuser
