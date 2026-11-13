# NestJS Authentication, Products and Orders API

## Run with Docker

1. Copy `.env.example` to `.env` and replace the values, especially `JWT_SECRET` and `ADMIN_PASSWORD`.
2. Start both containers:

```bash
docker compose up --build
```

The API is available at `http://localhost:3000`. MongoDB is on the private `app-network` and persists data in the `mongo-data` volume.

The admin account is created from `ADMIN_EMAIL` and `ADMIN_PASSWORD` on first startup. Public registration creates customer accounts only.

## API routes

- `POST /users/register` - customer registration
- `POST /auth/login` - login and receive a JWT
- `GET /products` - admin only
- `POST /products` - admin only
- `PATCH /products/:id` - admin only
- `DELETE /products/:id` - admin only
- `POST /orders` - customer only
- `GET /orders` - admin only
- `GET /orders/my` - authenticated customer
- `PATCH /orders/:id/status` - admin only

Send the JWT as `Authorization: Bearer <token>`.
