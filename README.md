# Sentimental Chat
## Setup
### frontend
```
docker-compose run --rm frontend npm install
```
frontend/.env.local
```
NEXTAUTH_SECRET=xxxx  # Set the random number generated by running `openssl rand -base64 32`
```
### backend
```
docker-compose run --rm backend python manage.py migrate
```
backend/.env
```
SECRET_KEY=xxxx
DEBUG=True
```

## Run server
```
docker-compose up -d
```
