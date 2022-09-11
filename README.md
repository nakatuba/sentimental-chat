# Sentimental Chat
## Setup
### frontend
```
docker-compose run --rm frontend npm install
```
frontend/.env.local
```
NEXTAUTH_SECRET=xxxx # Set the random number generated by running `openssl rand -base64 32`
NEXT_PUBLIC_PUSHER_APP_KEY=xxxx
NEXT_PUBLIC_PUSHER_APP_CLUSTER=xxxx
```
### backend
```
make migrate
make createsuperuser
```
backend/.env
```
SECRET_KEY=xxxx
DEBUG=True
PUSHER_APP_ID=xxxx
PUSHER_APP_KEY=xxxx
PUSHER_APP_SECRET=xxxx
PUSHER_APP_CLUSTER=xxxx
```

## Run server
```
docker-compose up -d
```
* frontend
  * [localhost:3000](http://localhost:3000)
* backend
  * [localhost:8000](http://localhost:8000)
