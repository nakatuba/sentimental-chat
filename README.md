# Sentimental Chat

## Setup

### frontend

```
docker-compose run --rm frontend npm install
```

`frontend/.env.local`

```
NEXTAUTH_SECRET=xxxx  # Set the random number generated by running `openssl rand -base64 32`
NEXT_PUBLIC_BACKEND_HOST=http://localhost:8000
BACKEND_HOST=http://backend:8000
```

### backend

```
docker-compose run --rm backend python manage.py migrate
```

`backend/.env`

```
SECRET_KEY=xxxx
DEBUG=True
ANALYZER_HOST=http://analyzer:9000
```

## Run Server

```
docker-compose up -d
```
