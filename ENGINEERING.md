# ENGINEERING.md — zen-canvas

> Comprehensive engineering reference for the zen-canvas Mandala Online Shop.  
> Last updated: 2026-02-19

---

## Table of Contents

1. [Project Overview](#1-project-overview)
2. [Architecture](#2-architecture)
3. [Tech Stack](#3-tech-stack)
4. [Repository Structure](#4-repository-structure)
5. [Database Schema](#5-database-schema)
6. [API Reference](#6-api-reference)
7. [Authentication & Security](#7-authentication--security)
8. [Payment Flow (Stripe)](#8-payment-flow-stripe)
9. [Cart Strategy](#9-cart-strategy)
10. [Frontend Architecture](#10-frontend-architecture)
11. [Environment Variables](#11-environment-variables)
12. [Local Development Setup](#12-local-development-setup)
13. [CI/CD](#13-cicd)
14. [Architecture Decisions](#14-architecture-decisions)
15. [Phases Completed](#15-phases-completed)
16. [Pending / Roadmap](#16-pending--roadmap)

---

## 1. Project Overview

zen-canvas is a full-stack e-commerce platform for selling mandala art — wall art, posters, originals, and gift sets. Designed for a single operator (admin) with full customer-facing shopping experience.

**Core philosophy:**
- **All business logic lives in Java/Spring Boot.** The Next.js frontend is a pure view layer — it renders data and calls REST APIs. Zero business logic in UI files.
- **Services layer in Next.js** (`src/services/`) handles all API calls. Page and component files never call APIs directly.

---

## 2. Architecture

```
┌─────────────────────────────────────────────────┐
│                  Next.js 15 (App Router)         │
│  apps/web/                                        │
│  ┌─────────────┐    ┌──────────────────────────┐ │
│  │  Pages /    │    │  src/services/*.service.ts│ │
│  │  Components │───▶│  (all API calls here)     │ │
│  └─────────────┘    └──────────┬───────────────┘ │
└──────────────────────────────┬─┘─────────────────┘
                               │ REST (JSON)
                               ▼
┌─────────────────────────────────────────────────┐
│          Spring Boot 3.5.0 (Java 25)             │
│  src/main/java/com/zencanvas/api/               │
│  ├── controller/   REST endpoints                │
│  ├── service/      Business logic                │
│  ├── domain/       Entities + Repositories       │
│  ├── dto/          Request/Response records       │
│  ├── security/     JWT filter + SecurityConfig   │
│  └── config/       Stripe, CORS, etc.            │
└──────────────────────────────┬──────────────────┘
                               │ JPA/Hibernate
                               ▼
┌─────────────────────────────────────────────────┐
│          PostgreSQL 16 (via Docker locally)       │
│          Flyway migrations (V1, V2, V4)          │
└─────────────────────────────────────────────────┘
```

External services:
- **Stripe** — payment intents + webhooks
- **Cloudinary** — product image hosting
- **Vercel** — Next.js deployment (planned)
- **Railway** — Spring Boot + PostgreSQL deployment (planned)

---

## 3. Tech Stack

| Layer | Technology | Notes |
|---|---|---|
| Frontend | Next.js 15, React 19, TypeScript | App Router, Server + Client Components |
| Styling | Tailwind CSS v4 | Purple/violet/fuchsia/amber palette |
| State | Zustand + persist | Cart state in `localStorage` |
| HTTP client | Axios | JWT interceptor, session header |
| Backend | Spring Boot 3.5.0 | Java 25 (Temurin/Adoptium) |
| Build tool | Gradle Groovy DSL 9.3.1 | Not Maven, not KTS |
| ORM | Spring Data JPA / Hibernate | `ddl-auto: validate` |
| DB migrations | Flyway | V1, V2, V4 |
| Database | PostgreSQL 16 | JSONB for variant attributes |
| Auth | JWT (jjwt 0.12.6) | HMAC-SHA256, stateless |
| Passwords | BCrypt | Spring Security default |
| Payments | Stripe Java SDK 26.3.0 | PaymentIntent + Webhook |
| Images | Cloudinary | Only public_id + secure_url stored |
| Utilities | Lombok, Apache Commons Lang 3.17.0 | Boilerplate reduction |
| Containerization | Docker Compose | Local PostgreSQL only |
| CI | GitHub Actions | Java 25 Temurin, Gradle |

---

## 4. Repository Structure

```
zen-canvas/                        ← repo root = Spring Boot project
├── src/
│   └── main/
│       ├── java/com/zencanvas/api/
│       │   ├── ZenCanvasApiApplication.java
│       │   ├── controller/
│       │   │   ├── HealthController.java
│       │   │   ├── ProductController.java
│       │   │   ├── CartController.java
│       │   │   ├── CheckoutController.java
│       │   │   ├── WebhookController.java
│       │   │   ├── AuthController.java
│       │   │   ├── UserController.java
│       │   │   ├── OrderController.java
│       │   │   └── AdminController.java
│       │   ├── service/
│       │   │   ├── ProductService.java
│       │   │   ├── CartService.java
│       │   │   ├── OrderService.java
│       │   │   ├── AdminOrderService.java
│       │   │   ├── AuthService.java
│       │   │   └── JwtService.java
│       │   ├── domain/
│       │   │   ├── entity/
│       │   │   │   ├── User.java
│       │   │   │   ├── Category.java
│       │   │   │   ├── Product.java
│       │   │   │   ├── ProductImage.java
│       │   │   │   ├── ProductVariant.java
│       │   │   │   ├── CartItem.java
│       │   │   │   ├── Order.java
│       │   │   │   └── OrderItem.java
│       │   │   └── repository/
│       │   │       ├── UserRepository.java
│       │   │       ├── CategoryRepository.java
│       │   │       ├── ProductRepository.java
│       │   │       ├── ProductVariantRepository.java
│       │   │       ├── CartItemRepository.java
│       │   │       └── OrderRepository.java
│       │   ├── dto/
│       │   │   └── (Java records for all request/response types)
│       │   ├── security/
│       │   │   ├── JwtAuthFilter.java
│       │   │   └── SecurityConfig.java
│       │   └── config/
│       │       ├── StripeConfig.java
│       │       └── CorsConfig.java
│       └── resources/
│           ├── application.yml
│           └── db/migration/
│               ├── V1__initial_schema.sql
│               ├── V2__cart_and_orders.sql
│               └── V4__seed_demo_data.sql
├── apps/
│   └── web/                       ← Next.js frontend
│       └── src/
│           ├── app/               ← App Router pages
│           │   ├── page.tsx       ← Homepage
│           │   ├── products/[slug]/page.tsx
│           │   ├── cart/page.tsx
│           │   ├── checkout/page.tsx
│           │   ├── login/page.tsx
│           │   ├── register/page.tsx
│           │   ├── orders/page.tsx
│           │   └── admin/orders/page.tsx
│           ├── components/
│           │   ├── Header.tsx
│           │   ├── CartDrawer.tsx
│           │   ├── ProductCard.tsx
│           │   ├── ProductDetail.tsx
│           │   ├── ProductGrid.tsx
│           │   └── CategoryFilter.tsx
│           ├── services/          ← ALL API calls live here
│           │   ├── product.service.ts
│           │   ├── cart.service.ts
│           │   ├── auth.service.ts
│           │   └── order.service.ts
│           ├── lib/
│           │   ├── api.ts         ← Axios instance + interceptors
│           │   └── session.ts     ← UUID session ID (localStorage)
│           ├── store/
│           │   └── cart.ts        ← Zustand cart store
│           └── types/
│               └── index.ts       ← All shared TypeScript types
├── build.gradle
├── settings.gradle
├── gradlew / gradlew.bat
├── docker-compose.yml
├── .github/workflows/ci.yml
└── ENGINEERING.md
```

---

## 5. Database Schema

### Migrations

| File | Description |
|---|---|
| `V1__initial_schema.sql` | users, categories, products, product_images, product_variants, orders, order_items, password_reset_tokens, all indexes |
| `V2__cart_and_orders.sql` | cart_items table (session-based + user-linked) |
| `V4__seed_demo_data.sql` | 4 categories, 8 products, 8 images, 17 variants (demo data) |

> Note: V3 was deleted — it attempted to create `password_reset_tokens` which already existed in V1.

### Key Tables

#### `users`
| Column | Type | Notes |
|---|---|---|
| id | UUID PK | |
| email | VARCHAR UNIQUE | |
| password_hash | VARCHAR | BCrypt |
| first_name | VARCHAR | |
| last_name | VARCHAR | |
| role | VARCHAR | `CUSTOMER` or `ADMIN` |
| created_at | TIMESTAMP | |

#### `products`
| Column | Type | Notes |
|---|---|---|
| id | UUID PK | |
| name | VARCHAR | |
| slug | VARCHAR UNIQUE | URL-safe identifier |
| description | TEXT | |
| category_id | UUID FK | → categories |
| published | BOOLEAN | false = draft |
| created_at | TIMESTAMP | |

#### `product_variants`
| Column | Type | Notes |
|---|---|---|
| id | UUID PK | |
| product_id | UUID FK | → products |
| sku | VARCHAR UNIQUE | |
| price | DECIMAL(10,2) | |
| stock | INTEGER | |
| attributes | JSONB | e.g. `{"size": "A3", "material": "matte"}` |

#### `cart_items`
| Column | Type | Notes |
|---|---|---|
| id | UUID PK | |
| session_id | VARCHAR | anonymous cart |
| user_id | UUID FK nullable | linked after login |
| variant_id | UUID FK | → product_variants |
| quantity | INTEGER | |
| UNIQUE | (session_id, variant_id) | prevents duplicate rows |

#### `orders`
| Column | Type | Notes |
|---|---|---|
| id | UUID PK | |
| user_id | UUID FK | → users |
| status | VARCHAR | `PENDING`, `PROCESSING`, `SHIPPED`, `DELIVERED`, `CANCELLED`, `REFUNDED` |
| total_amount | DECIMAL(10,2) | |
| payment_intent_id | VARCHAR UNIQUE | Stripe idempotency guard |
| shipping_name | VARCHAR | |
| shipping_email | VARCHAR | |
| shipping_address | VARCHAR | |
| created_at | TIMESTAMP | |

---

## 6. API Reference

All routes are prefixed with `/api`. Base URL locally: `http://localhost:8080/api`.

### Public Routes (no auth required)

| Method | Path | Description |
|---|---|---|
| GET | `/health` | Health check — returns `{status, service, timestamp}` |
| GET | `/products` | List published products. Query: `search`, `categoryId`, `page`, `size`, `sort` |
| GET | `/products/{slug}` | Get product by slug |
| GET | `/products/categories` | List all categories |
| POST | `/auth/register` | Register new customer |
| POST | `/auth/login` | Login, returns JWT |
| GET | `/cart` | Get cart by session | Header: `X-Session-Id` |
| POST | `/cart/items` | Add item to cart | Header: `X-Session-Id` |
| PUT | `/cart/items/{variantId}` | Update cart item quantity | Header: `X-Session-Id` |
| DELETE | `/cart/items/{variantId}` | Remove item from cart | Header: `X-Session-Id` |
| POST | `/checkout/payment-intent` | Create Stripe PaymentIntent, creates pending Order |
| POST | `/webhooks/stripe` | Stripe webhook receiver |

### Customer Routes (JWT required — role: CUSTOMER or ADMIN)

| Method | Path | Description |
|---|---|---|
| GET | `/users/me` | Get current user profile |
| GET | `/orders/my` | List my orders |
| GET | `/orders/my/{orderId}` | Get specific order |

### Admin Routes (JWT required — role: ADMIN only)

| Method | Path | Description |
|---|---|---|
| GET | `/admin/orders` | List all orders. Query: `status` (optional filter) |
| GET | `/admin/orders/{orderId}` | Get any order by ID |
| PATCH | `/admin/orders/{orderId}/status` | Update order status |

---

## 7. Authentication & Security

### JWT

- Library: `io.jsonwebtoken:jjwt-api:0.12.6`
- Algorithm: HMAC-SHA256
- Claims: `userId` (UUID), `email`, `role`
- Secret: `${JWT_SECRET}` env var (minimum 256-bit key)
- Expiration: configurable via `${JWT_EXPIRATION_MS}` (default 86400000 = 24h)
- Sent as: `Authorization: Bearer <token>`

### Security Config

```
Public:        GET /products/**, /auth/**, /cart/**, /checkout/**, /webhooks/**, /health, /actuator/**
Authenticated: GET /users/me, GET /orders/my/**  (CUSTOMER or ADMIN)
Admin only:    /admin/**  (@PreAuthorize("hasRole('ADMIN')"))
```

### JWT Filter Flow

1. `JwtAuthFilter extends OncePerRequestFilter`
2. Reads `Authorization: Bearer <token>` header
3. Calls `JwtService.isValid(token)`
4. On valid: sets `UsernamePasswordAuthenticationToken` with `ROLE_<role>` authority
5. On invalid/missing: continues filter chain unauthenticated (public routes pass through)

### Password Hashing

BCrypt via Spring Security's `BCryptPasswordEncoder`.

---

## 8. Payment Flow (Stripe)

```
Client                    Spring Boot              Stripe
  │                           │                      │
  │── POST /checkout/pi ──────▶│                      │
  │                           │── createPaymentIntent▶│
  │                           │◀── clientSecret ──────│
  │                           │  (save paymentIntentId│
  │                           │   + create Order PENDING)
  │◀── clientSecret ──────────│                      │
  │                           │                      │
  │── Stripe.js confirmPayment▶────────────────────▶ │
  │                           │                      │
  │                           │◀── webhook: payment_intent.succeeded
  │                           │  (check existsByPaymentIntentId — idempotency)
  │                           │  (update Order → PROCESSING)
  │                           │  (clear cart)
```

**Idempotency**: `payment_intent_id` has a UNIQUE constraint in `orders` table. `WebhookController` calls `existsByPaymentIntentId` before processing to prevent duplicate fulfillment.

---

## 9. Cart Strategy

- **Session-based** — no login required to add to cart
- `X-Session-Id` header carries a UUID (generated client-side, stored in `localStorage.zc_session`)
- Cart items stored server-side in `cart_items` table (`session_id` column)
- After login, cart can be linked to `user_id` for persistence across devices
- Client-side Zustand store (`src/store/cart.ts`) mirrors server cart state for UI reactivity

---

## 10. Frontend Architecture

### Rules (non-negotiable)

1. **Pages and components contain zero API calls.** They import from `src/services/` only.
2. **Services layer** (`src/services/*.service.ts`) owns all HTTP calls via the Axios instance.
3. **All business logic is on the Java side.** The UI computes nothing beyond display formatting.

### Axios Instance (`src/lib/api.ts`)

- `baseURL`: `NEXT_PUBLIC_API_URL` env var
- Request interceptor: attaches `Authorization: Bearer <token>` from `localStorage.zc_token`
- Session header: `X-Session-Id` from `src/lib/session.ts`

### Services

| File | Responsibility |
|---|---|
| `product.service.ts` | `getProducts`, `getProductBySlug`, `getCategories` |
| `cart.service.ts` | `getCart`, `addToCart`, `updateCartItem`, `removeCartItem` |
| `auth.service.ts` | `login`, `register` (saves JWT to localStorage on success) |
| `order.service.ts` | `getMyOrders`, `createPaymentIntent`, `getAdminOrders`, `updateOrderStatus` |

### Zustand Cart Store (`src/store/cart.ts`)

- Persisted to `localStorage` key `zc-cart`
- Actions: `addItem`, `removeItem`, `updateQuantity`, `clearCart`
- Getters: `totalItems()`, `totalPrice()`

### UI Palette

| Color role | Tailwind classes |
|---|---|
| Primary gradient | `from-violet-600 via-purple-600 to-fuchsia-600` |
| Accent | `amber-400` / `amber-500` |
| Backgrounds | `purple-50`, `violet-50`, lavender radial gradient |
| Category badges | violet (Wall Art), fuchsia (Posters), rose (Originals), amber (Gift Sets) |

---

## 11. Environment Variables

### Spring Boot (`application.yml` / system env)

| Variable | Description | Example |
|---|---|---|
| `DB_HOST` | PostgreSQL host | `localhost` |
| `DB_PORT` | PostgreSQL port | `5432` |
| `DB_NAME` | Database name | `zencanvas` |
| `DB_USER` | Database user | `zencanvas` |
| `DB_PASSWORD` | Database password | `zencanvas` |
| `JWT_SECRET` | HMAC-SHA256 secret (min 256-bit) | `your-secret-key-at-least-32-chars` |
| `JWT_EXPIRATION_MS` | Token lifetime in ms | `86400000` |
| `STRIPE_API_KEY` | Stripe secret key | `sk_test_...` |
| `STRIPE_WEBHOOK_SECRET` | Stripe webhook signing secret | `whsec_...` |
| `CLOUDINARY_CLOUD_NAME` | Cloudinary cloud name | `your-cloud` |
| `CLOUDINARY_API_KEY` | Cloudinary API key | |
| `CLOUDINARY_API_SECRET` | Cloudinary API secret | |
| `CORS_ALLOWED_ORIGINS` | Comma-separated allowed origins | `http://localhost:3000` |

### Next.js (`apps/web/.env.local`)

| Variable | Description | Example |
|---|---|---|
| `NEXT_PUBLIC_API_URL` | Spring Boot base URL | `http://localhost:8080/api` |
| `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` | Stripe publishable key | `pk_test_...` |

---

## 12. Local Development Setup

### Prerequisites

- Java 25 (Temurin/Adoptium) — `sdk install java 25-tem` via SDKMAN or download from adoptium.net
- Docker Desktop
- Node.js 20+
- npm or yarn

### 1. Start PostgreSQL

```bash
docker compose up -d
```

This starts PostgreSQL 16 on `localhost:5432` with:
- Database: `zencanvas`
- User: `zencanvas`
- Password: `zencanvas`

Flyway runs automatically on Spring Boot startup — no manual migration needed.

### 2. Set Environment Variables

Add to `~/.bash_profile` (or `~/.zshrc`):

```bash
export DB_HOST=localhost
export DB_PORT=5432
export DB_NAME=zencanvas
export DB_USER=zencanvas
export DB_PASSWORD=zencanvas
export JWT_SECRET=your-secret-key-must-be-at-least-32-characters-long
export JWT_EXPIRATION_MS=86400000
export STRIPE_API_KEY=sk_test_...
export STRIPE_WEBHOOK_SECRET=whsec_...
export CLOUDINARY_CLOUD_NAME=your-cloud
export CLOUDINARY_API_KEY=...
export CLOUDINARY_API_SECRET=...
export CORS_ALLOWED_ORIGINS=http://localhost:3000
```

### 3. Run Spring Boot

```bash
# From repo root
./gradlew bootRun
```

API available at: `http://localhost:8080/api`
Health check: `http://localhost:8080/api/health`

Or run from IntelliJ — open the repo root as the project, IntelliJ will auto-detect the Spring Boot application.

### 4. Run Next.js

```bash
cd apps/web
npm install
cp .env.example .env.local   # then fill in values
npm run dev
```

Frontend available at: `http://localhost:3000`

### 5. Verify

- `GET http://localhost:8080/api/health` → `{"status":"UP",...}`
- `GET http://localhost:8080/api/products` → paginated list with seed data
- `http://localhost:3000` → homepage with products grid

---

## 13. CI/CD

### GitHub Actions (`.github/workflows/ci.yml`)

Triggers on push/PR to `main`.

**Jobs (run in parallel):**

1. `api-build` — Java 25 Temurin, Gradle cache, `./gradlew build -x test`, then `./gradlew test`
2. `web-build` — Node 20, `npm ci` in `apps/web/`, lint, `next build`

> Note: Spring Boot tests require a running PostgreSQL — no Testcontainers setup yet, so tests are skipped in CI unless the DB is available.

### Planned Deployment

| Service | Platform | Notes |
|---|---|---|
| Spring Boot API | Railway | PostgreSQL managed DB on Railway too |
| Next.js frontend | Vercel | Connect GitHub repo, set env vars |

---

## 14. Architecture Decisions

### Java Spring Boot over Python FastAPI
Chosen because Spring Boot is Ronin's primary backend stack. FastAPI is reserved for future AI/ML microservices.

### Gradle Groovy DSL over Maven / Gradle KTS
- Maven was initially scaffolded but replaced per user preference
- KTS (Kotlin DSL) rejected — user does not use Kotlin
- Groovy DSL is familiar, concise, widely documented

### Monorepo (Spring Boot at root + Next.js at `apps/web/`)
- Single-developer project: monorepo is simpler to manage
- Spring Boot at repo root (not `apps/api/`) so IntelliJ detects it as a Spring Boot project automatically
- Next.js in `apps/web/` keeps frontend clearly separated

### Session-based Cart (no login required)
- `X-Session-Id` UUID header — generated client-side, persisted to localStorage
- Server stores cart in DB (not pure client-side) for cross-device potential
- No cart data lost on page refresh

### Stripe PaymentIntent (not Checkout Sessions)
- More control over the payment UX
- Idempotency handled via `payment_intent_id` UNIQUE constraint — webhook can fire multiple times safely

### JSONB for Variant Attributes
- Product variants have flexible attributes (size, material, color, etc.)
- JSONB avoids EAV pattern or rigid column schema
- Queryable with PostgreSQL JSON operators if needed

### `ddl-auto: validate` (never auto-create)
- Flyway owns the schema — Hibernate only validates against it
- Prevents accidental schema drift in production

### Java 25 + Temurin (not Corretto)
- Machine had broken Corretto 25 install (`bin/java` missing)
- Toolchain pinned to `JvmVendorSpec.ADOPTIUM` in `build.gradle` to force Temurin selection
- Temurin is the most widely deployed OpenJDK distribution professionally

---

## 15. Phases Completed

### Phase 0 — Scaffold
- Monorepo init, Spring Boot skeleton, PostgreSQL schema (V1), Docker Compose, GitHub Actions CI

### Phase 1 — Product Catalog (Backend + Frontend shell)
- Product, Category, ProductImage, ProductVariant entities + repositories
- ProductService, ProductController (list, search, by slug, categories)
- Next.js 15 App Router scaffold, TypeScript types, Tailwind

### Phase 2 — Cart, Checkout, Payments
- CartItem entity + CartService (session-based) + CartController
- Order, OrderItem entities + OrderService + CheckoutController
- Stripe PaymentIntent integration + WebhookController (with idempotency)
- User entity + UserRepository

### Phase 3 — Authentication & Admin
- JWT auth: JwtService, JwtAuthFilter, SecurityConfig
- AuthService (register/login with BCrypt), AuthController
- UserController (`/users/me`), OrderController (`/orders/my/**`)
- AdminController + AdminOrderService (`/admin/orders/**`)
- GlobalExceptionHandler (400, 409, 422)

### Phase 3.5 — Frontend Build
- All pages: home, product detail, cart, checkout, login, register, orders, admin
- Services layer: product, cart, auth, order services
- Zustand cart store, Axios instance, session UUID
- Colorful Shopify-style UI (purple/violet/fuchsia/amber palette)
- Seed data: V4 migration with 8 products, Unsplash images, 17 variants

### Phase 4 — SEO, CI, Deployment, Confirmation
- `generateMetadata` + Open Graph + Twitter cards on all pages
- Per-route `layout.tsx` with `robots: noindex` for private pages
- `sitemap.ts` (dynamic — fetches products + categories from API)
- `robots.ts` (disallows admin/checkout/orders)
- Frontend CI job (Node 20, npm ci, lint, next build) — runs parallel with api-build
- `railway.toml` for Spring Boot deployment (nixpacks, healthcheck)
- `apps/web/vercel.json` for Vercel deployment
- `apps/web/.env.example` documenting all required env vars
- `/checkout/confirmation` page — Stripe return_url landing, clears cart, shows order reference

### Phase 5 — Post-auth Features
- **Password reset flow** — `PasswordResetToken` entity + repository, `PasswordResetService`
  (generates UUID token, 1hr expiry, logs to console — email wiring is TODO),
  `PasswordResetController` (`POST /auth/forgot-password`, `POST /auth/reset-password`),
  `/forgot-password` + `/reset-password?token=` pages, Forgot password link on login
- **Cart merge on login** — `CartService.mergeSessionCart()` merges guest session into user account
  on login; quantities summed for duplicate variants; `AuthService.login()` accepts `sessionId`;
  `AuthController` reads `X-Session-Id` header; frontend clears `zc_session` after login
- **Demo images** — V5 migration adds 3 extra mandala images per product (32 total, all Unsplash mandala photos)

---

## 16. Pending / Roadmap

### To Go Live
- [ ] Vercel deployment — connect GitHub repo, set env vars (`NEXT_PUBLIC_API_URL`, `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`, `NEXT_PUBLIC_SITE_URL`)
- [ ] Railway deployment — set all Spring Boot env vars, attach PostgreSQL plugin
- [ ] Stripe live keys + register production webhook endpoint at Railway URL
- [ ] Replace Unsplash demo images with real Cloudinary-hosted product photos

### Features Backlog
- [ ] **Email notifications** — replace `log.info` in `PasswordResetService` with SendGrid/JavaMailSender; add order confirmation email in `OrderService.handlePaymentSuccess()`
- [ ] **Product management UI** — admin CRUD for products, variants, images (currently DB-only via migrations)
- [ ] **Admin dashboard** — revenue stats, orders today, top products, low stock alerts
- [ ] **Inventory guard** — block add-to-cart when `stock = 0`; decrement stock on order
- [ ] **Order detail page** — `/orders/[orderId]` with status timeline
- [ ] **Wishlist** — save products for later (DB for logged-in, localStorage for guests)
- [ ] **Product reviews & ratings** — post-purchase star rating + text review
- [ ] **Discount codes** — `POST /cart/apply-coupon`, percentage or fixed amount
- [ ] **Cloudinary upload** — admin drag-and-drop image upload endpoint
- [ ] **Integration tests** — Testcontainers setup for DB-dependent Spring Boot tests
