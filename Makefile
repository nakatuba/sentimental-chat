.PHONY: migrate
migrate:
	docker-compose run --rm backend python manage.py migrate

.PHONY: createsuperuser
createsuperuser:
	docker-compose run --rm backend python manage.py createsuperuser
