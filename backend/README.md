# Bin Aouf — Backend API

Production REST API for the Bin Aouf Himalayan salt export website **and** admin panel.
Node.js + Express + MongoDB (Mongoose), JWT auth, Zod validation, image uploads, Docker-ready.

The data model mirrors `BinAouf-Admin.html` **1:1** — categories, products (with per‑category
spec columns), home categories, certifications, orders, customers, inquiries, and site settings.

---

## 1. Quick start (local)

```bash
cp .env.example .env          # then edit JWT_SECRET + ADMIN_PASSWORD
npm install
npm run seed                  # loads your exact admin data + creates the admin user
npm run dev                   # http://localhost:4000
```

Health check: `GET http://localhost:4000/api/health`

Requires a running MongoDB. Local Mongo, or just use Docker (below).

## 2. Quick start (Docker — recommended for your self-hosted stack)

```bash
cp .env.example .env          # edit secrets
docker compose up -d --build  # starts mongo + api
docker compose exec api npm run seed
```

API → `http://localhost:4000` · Mongo → `mongodb://localhost:27017/binaouf`
Uploads and DB persist in named volumes (`uploads_data`, `mongo_data`).

## 3. Environment

| Var | Purpose |
|---|---|
| `PORT` | API port (default 4000) |
| `MONGO_URI` | Mongo connection string |
| `CORS_ORIGINS` | Comma‑separated allowed origins (your site + admin) |
| `PUBLIC_URL` | Public base URL of the API (used to build image URLs) |
| `JWT_SECRET` | Long random secret for signing tokens |
| `JWT_EXPIRES_IN` | Token lifetime (default `7d`) |
| `ADMIN_EMAIL` / `ADMIN_PASSWORD` | Seeded admin login (re-applied on every `npm run seed`) |
| `MAX_UPLOAD_MB` | Max image upload size (default 5) |

---

## 4. Auth

```
POST /api/auth/login   { email, password }  →  { token, user }
GET  /api/auth/me      (Bearer token)        →  { user }
```

Send the token on every admin call:

```
Authorization: Bearer <token>
```

All `/api/admin/*` routes require a valid token. `/api/public/*` is open.

---

## 5. Endpoints

### Public (website — no auth)
| Method | Path | Notes |
|---|---|---|
| GET | `/api/public/products` | Active products. `?cat=edible` to filter |
| GET | `/api/public/products/:id` | Single active product |
| GET | `/api/public/categories` | All categories |
| GET | `/api/public/home-categories` | Home page category cards |
| GET | `/api/public/certifications` | "Our Credentials" |
| GET | `/api/public/settings` | Website-safe settings only |
| POST | `/api/public/inquiries` | Contact form submission |

### Admin (JWT required)
| Resource | Endpoints |
|---|---|
| Products | `GET/POST /api/admin/products` · `GET/PATCH/DELETE /api/admin/products/:id` |
| Categories | `GET/POST /api/admin/categories` · `GET/PATCH/DELETE /api/admin/categories/:id` (id = slug) |
| Home categories | `GET/POST /api/admin/home-categories` · `…/:id` |
| Certifications | `GET/POST /api/admin/certifications` · `…/:id` |
| Orders | `GET/POST /api/admin/orders` · `…/:id` (id = `BA-xxxx`) |
| Customers | `GET/POST /api/admin/customers` · `…/:id` |
| Inquiries | `GET /api/admin/inquiries` (`?read=false&archived=false`) · `PATCH/DELETE …/:id` |
| Product columns | `GET /api/admin/product-columns` (map) · `GET/PUT /api/admin/product-columns/:catId` |
| Settings | `GET/PUT /api/admin/settings` |
| Dashboard | `GET /api/admin/dashboard/stats` |
| Upload | `POST /api/admin/upload` (multipart, field `file`) → `{ url }` |
| Bulk replace | `PUT /api/admin/bulk/{products\|categories\|home-categories\|certifications\|orders\|customers\|inquiries}` · `PUT /api/admin/bulk/product-columns` |

**Response envelope:** success → `{ ok: true, data, count? }` · error → `{ ok: false, error, details? }`

---

## 6. Data model notes

- Every resource keeps its **business `id`** (numeric for products/customers/etc., slug for
  categories, `BA-####` for orders). New IDs are generated atomically via a `Counter` collection.
- **Products** carry a flexible `specs` object whose keys come from that category's
  **product columns** (`art`, `weight`, `size`, `packing`, or anything you add).
- **Images** (`img` on products / certs / home categories) accept either an absolute URL from
  `/api/admin/upload` **or** a base64 data‑URI (keeps your current admin flow working unchanged).
- **Settings** is a single document; the public endpoint exposes only website-safe fields.
- **Inquiries** created from the site expose a relative `time` string (e.g. "12 min ago") for the
  admin inbox, derived from `createdAt`.

## 7. Image upload example

```bash
curl -X POST http://localhost:4000/api/admin/upload \
  -H "Authorization: Bearer $TOKEN" \
  -F "file=@lamp.jpg"
# → { "ok": true, "data": { "url": "http://localhost:4000/uploads/img-...jpg" } }
```

Then set that `url` as the product's `img`.

---

## 8. Re-seeding

```bash
npm run seed         # upsert: safe, won't wipe orders/inquiries you've added
npm run seed:fresh   # wipes content collections, reloads clean catalog
```

See **INTEGRATION.md** to wire your existing `index.html` + `BinAouf-Admin.html` to this API.

## 9. Pre-wired HTML (included)

Ready-to-run versions of both pages ship alongside this backend:

- **`index.html`** — contact form posts real inquiries to `/api/public/inquiries`
  (loading state + graceful error). Set `const API=` at the top of its script.
- **`BinAouf-Admin.html`** — fully API-backed: JWT login overlay, loads every collection
  from the API on boot, and every add/edit/delete syncs to the backend via the **bulk replace**
  endpoints (debounced 600ms). No `localStorage` dependency. Set `const API=` + sign in with your
  seeded admin credentials.

Both default to `http://localhost:4000/api` — change that one line for production.
Remember to add the page's origin to `CORS_ORIGINS` in `.env`.
