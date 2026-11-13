# NestJS Auth, Roles, Products & Orders (Docker)

NestJS + MongoDB API with JWT authentication and role-based authorization (**Admin** / **Customer**),
running as two containers (API + MongoDB) on a Docker network, with a persistent MongoDB volume.

## Quick start

```bash
cp .env.example .env        # then edit: set real passwords / JWT secret
docker compose up -d --build
docker compose logs -f api  # look for: "Seeded admin user ..." and "API listening on port 3000"
```

API: `http://localhost:3000` (override with `PORT` in `.env`).
Stop: `docker compose down` (data kept)  |  `docker compose down -v` (data **deleted**).

Verify the whole checklist automatically (Node 18+):

```bash
ADMIN_EMAIL=admin@example.com ADMIN_PASSWORD='<your ADMIN_PASSWORD>' node scripts/smoke-test.js
```

## Architecture

```
            app-network (bridge)
     ┌─────────────┴─────────────┐
 nest-api (NestJS)  ───────►  nest-mongo (mongo:7)
 published: :3000              not published to host
 MONGO_URI=mongodb://…@mongo:27017/…      │
                                    volume: mongo-data → /data/db
```

* The API reaches MongoDB via the **service name `mongo`** (Docker DNS), never `localhost`.
* Mongo has **no published port**, so only containers on `app-network` can reach it.
* `depends_on` + healthcheck: the API starts only after Mongo answers a ping.
* Config comes from environment variables (`MONGO_URI`, `JWT_SECRET`, `PORT`, …); `.env` is git-ignored, `.env.example` is committed.

## Roles & permissions

| Endpoint | Public | Customer | Admin |
|---|:-:|:-:|:-:|
| `POST /auth/register` (always creates a *customer*) | ✅ | | |
| `POST /auth/login` | ✅ | | |
| `GET /users/me` | | ✅ | ✅ |
| `GET /users` | | | ✅ |
| `POST/GET/PATCH/DELETE /products[/:id]` | | ❌ 403 | ✅ |
| `POST /orders` | | ✅ | ❌ 403 |
| `GET /orders/my`, `PATCH /orders/:id/cancel` (own, pending only) | | ✅ | |
| `GET /orders[?status=]`, `PATCH /orders/:id/status` | | ❌ 403 | ✅ |
| `GET /orders/:id` | | own only | any |

No token / bad token → **401**. Wrong role → **403**.

**How it works:** `JwtAuthGuard` and `RolesGuard` are registered globally (`APP_GUARD`), so every route is protected by default;
`@Public()` opts out (register/login) and `@Roles(...)` restricts by role. The JWT strategy re-loads the user on each request,
so a deleted user's token stops working immediately.

**Admin accounts** can't be self-registered. The first admin is seeded on startup from `ADMIN_EMAIL` / `ADMIN_PASSWORD`.

## Orders

* Request body: `{ "items": [{ "productId": "<id>", "quantity": 2 }] }` — the client never sends prices.
* Server reads price/name from the DB, stores a snapshot on the order, computes `totalPrice`.
* Stock is reserved with an atomic conditional update (`stock >= qty`), so concurrent orders can't oversell.
  If any line fails, earlier reservations are rolled back.
* Status flow: `pending → confirmed → shipped → delivered`; `pending/confirmed → cancelled` (stock restored). Terminal states can't change.

## Try it by hand

```bash
# register + login as customer
curl -s -X POST localhost:3000/auth/register -H 'content-type: application/json' \
  -d '{"name":"Ann","email":"ann@example.com","password":"Password123!"}'

# login as admin (from .env)
curl -s -X POST localhost:3000/auth/login -H 'content-type: application/json' \
  -d '{"email":"admin@example.com","password":"<ADMIN_PASSWORD>"}'

# use the token
curl -s localhost:3000/products -H "Authorization: Bearer $TOKEN"
```

## Verifying the Docker requirements

```bash
docker compose ps                                   # two containers: nest-api, nest-mongo
docker network inspect <project>_app-network        # both containers listed
docker compose exec api node -e "console.log(process.env.MONGO_URI.includes('@mongo:'))"   # true -> uses service name
docker volume ls | grep mongo-data                  # volume exists

# persistence test
docker compose down                                 # removes containers, keeps volume
docker compose up -d                                # data (users/products/orders) is still there
```

## Local development (without Docker for the API)

```bash
docker compose up -d mongo   # add a temporary `ports: ["27017:27017"]` to the mongo service for this
npm install
# set MONGO_URI=mongodb://<user>:<pass>@localhost:27017/nest_shop?authSource=admin in .env
npm run start:dev
```

## Project layout

```
src/
  auth/      register, login, JWT strategy, JwtAuthGuard, RolesGuard
  users/     schema, service (+ admin seeding), /users/me
  products/  schema, DTOs, admin-only CRUD
  orders/    schema, DTOs, order logic (stock, totals, status flow)
  common/    Role enum, @Roles, @Public, @CurrentUser, ParseObjectIdPipe
Dockerfile · docker-compose.yml · .env.example
```
