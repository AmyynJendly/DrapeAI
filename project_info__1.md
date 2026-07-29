# DrapeAI — Full Codebase Review

## Summary

DrapeAI is a full-stack e-commerce web application for a fashion brand that features an **AI Virtual Try-On (VTO)** capability. It allows users to browse a curated catalog of apparel and footwear, select a product, upload or capture a photo of themselves (or use a preset model), and have the garment rendered onto their image via AI. The stack is Spring Boot 3.3 (Java 21) + MongoDB on the backend, React 18 + TypeScript + Vite + Tailwind on the frontend, and a Google Colab notebook using the IDM-VTON model via Hugging Face Gradio Spaces for the AI inference tier. The entire application is Dockerized and deployed via docker-compose with CI/CD through GitHub Actions to Docker Hub.

---

## Architecture

**Pattern**: Layered monolith (backend) + Single Page Application (frontend) + External AI service (Colab/Gradio)

**Technology Stack**:
- **Backend**: Java 21, Spring Boot 3.3, Spring Security, Spring Data MongoDB, JWT (jjwt 0.12.3), Lombok 1.18.46, Maven
- **Frontend**: React 18, TypeScript 5, Vite 5, Tailwind CSS 3.4, React Router 6, Framer Motion 12, Axios, Lucide React icons
- **AI Inference**: Google Colab (T4 GPU), ngrok tunnel, Gradio Client talking to Nymbo/Virtual-Try-On or yisol/IDM-VTON Hugging Face Spaces
- **Database**: MongoDB 7 (latest)
- **Infrastructure**: Docker Compose, Nginx (frontend serving + reverse proxy), GitHub Actions CI/CD

**Entry Points**:
- Backend: `drapeai-backend/src/main/java/com/drapeai/DrapeAiApplication.java` → `SpringApplication.run()`
- Frontend: `drapeai-frontend/src/main.tsx` → mounts `<App/>` into `#root`
- AI Service: `colab/drapeai_vto_backend.py` → FastAPI server on port 8000, exposed via ngrok

**How Execution Starts**:
1. `docker-compose up` starts MongoDB → waits for health check → starts `drapeai-backend` → waits for health check → starts `drapeai-frontend`
2. Backend starts: seeds 10 curated products into MongoDB via `DatabaseSeeder`, then listens on port 8080
3. Frontend starts: Nginx serves the built React SPA on port 80, proxies `/api/*` to `backend:8080`
4. User navigates to the SPA, which calls backend REST APIs for products, auth, orders, and VTO

---

## Directory Structure

```
DrapeAI/
├── docker-compose.yml              — 3-service orchestration (MongoDB, backend, frontend)
├── .env.local                      — Contains HF_TOKEN and VTO_COLAB_API_URL (ngrok URL)
├── .github/workflows/ci.yml        — GitHub Actions: build backend, build frontend, push Docker images
│
├── colab/
│   ├── drapeai_vto_backend.py      — Colab FastAPI server (VTO inference via Gradio client)
│   └── README.md                   — Setup instructions for Colab
│
├── drapeai-backend/
│   ├── pom.xml                     — Maven project (Spring Boot 3.3, Java 21, MongoDB, JWT, Lombok)
│   ├── Dockerfile                  — Multi-stage build with Maven cache
│   ├── settings.xml                — Maven config
│   └── src/main/java/com/drapeai/
│       ├── DrapeAiApplication.java — Spring Boot entry point
│       ├── config/
│       │   ├── SecurityConfig.java — Spring Security: stateless JWT auth, CORS, endpoint permissions
│       │   ├── WebConfig.java      — WebMvc CORS config (allowed origins for dev)
│       │   ├── DatabaseSeeder.java — CommandLineRunner: seeds 10 products on empty DB
│       │   └── RestTemplateConfig.java — RestTemplate with 15s connect / 180s read timeouts
│       ├── controller/
│       │   ├── AuthController.java      — POST /api/auth/register, POST /api/auth/login
│       │   ├── ProductController.java   — CRUD /api/products, filterable by category
│       │   ├── TryOnController.java     — POST /api/try-on/process, GET /api/try-on/history
│       │   ├── OrderController.java     — POST /api/orders, GET /api/orders, PUT status, admin all
│       │   ├── AccountController.java   — GET/PUT /api/account/me
│       │   └── HealthController.java    — GET /api/health
│       ├── model/
│       │   ├── User.java               — MongoDB user document (email, password, role, profile)
│       │   ├── Product.java            — MongoDB product document (brand, name, price, category, etc.)
│       │   ├── Order.java              — MongoDB order document (items, shipping, status)
│       │   └── TryOnHistory.java       — MongoDB VTO history document
│       ├── model/dto/                  — Request/Response DTOs (AuthResponse, TryOnRequest, etc.)
│       ├── repository/                 — Spring Data MongoDB repositories
│       ├── security/
│       │   └── JwtAuthFilter.java      — OncePerRequestFilter: extracts JWT, sets SecurityContext
│       └── service/
│           ├── AuthService.java        — Register/login logic, token generation
│           ├── JwtService.java         — JWT creation/validation (HS256, 24h expiry)
│           ├── CustomUserDetailsService.java — Loads user by email for Spring Security
│           ├── TryOnService.java       — 3-tier AI pipeline (Colab → HF Gradio → Fallback)
│           └── OrderService.java       — Order creation, retrieval, status management
│
├── drapeai-frontend/
│   ├── package.json               — React + Vite + Tailwind dev dependencies
│   ├── Dockerfile                 — Multi-stage: node:20 build → nginx:alpine serve
│   ├── nginx.conf                 — Serves SPA, proxy_pass /api/ to backend:8080
│   ├── vite.config.ts             — Dev server on :5173, proxy /api to localhost:8080
│   ├── index.html                 — SPA shell with Plus Jakarta Sans font
│   ├── src/
│   │   ├── main.tsx               — React DOM mount
│   │   ├── App.tsx                — Router + Context providers + HomePage component
│   │   ├── index.css              — Tailwind + custom fonts (Bodoni Moda, Hanken Grotesk)
│   │   ├── types/
│   │   │   ├── index.ts           — Product, TryOnRequest, TryOnResponse interfaces
│   │   │   ├── auth.ts            — Auth-related interfaces
│   │   │   ├── cart.ts            — CartItem interface
│   │   │   └── order.ts           — Order request/response payload interfaces
│   │   ├── context/
│   │   │   ├── AuthContext.tsx     — Auth state management (login, register, logout, refresh)
│   │   │   └── CartContext.tsx     — Cart state (add, remove, update, clear, persist to localStorage)
│   │   ├── services/
│   │   │   ├── api.ts             — Axios client with retry interceptor + all API endpoints
│   │   │   └── hfVtoService.ts    — VTO service: converts images to base64, calls /try-on/process
│   │   ├── data/
│   │   │   └── catalog.ts         — Local curated catalog (10 products) as fallback
│   │   ├── components/
│   │   │   ├── TopBanner.tsx      — Announcement banner
│   │   │   ├── Navbar.tsx         — Fixed top nav with search, cart icon, user menu dropdown
│   │   │   ├── HeroSection.tsx    — Parallax hero with watermark + model image + CTA
│   │   │   ├── BrandBar.tsx       — Scrolling brand marquee
│   │   │   ├── ProductCard.tsx    — Product grid card with hover overlay, try-on button
│   │   │   ├── TryOnModal.tsx     — Full VTO modal: preset/upload/webcam → processing → result slider
│   │   │   ├── WebcamCapture.tsx  — Browser webcam component for selfie capture
│   │   │   ├── CartDrawer.tsx     — Slide-out cart drawer
│   │   │   ├── EditorialShowcase.tsx
│   │   │   ├── QuoteSection.tsx
│   │   │   ├── Footer.tsx
│   │   │   ├── Logo.tsx
│   │   │   ├── ProtectedRoute.tsx — Auth guard for authenticated routes
│   │   │   └── ErrorBoundary.tsx  — React error boundary with fallback UI
│   │   └── pages/
│   │       ├── LoginPage.tsx      — Split-screen login with glassmorphism card
│   │       ├── RegisterPage.tsx   — Registration page
│   │       ├── ProductDetailPage.tsx — Full product detail with related items
│   │       ├── CheckoutPage.tsx   — Order form + summary
│   │       ├── OrdersPage.tsx     — Order history with status badges
│   │       ├── AccountPage.tsx    — Profile view + recent orders
│   │       ├── SettingsPage.tsx   — Account settings form
│   │       └── AdminPage.tsx      — Product inventory CRUD + order management table
```

---

## Key Abstractions

### Backend

#### `TryOnService` (drapeai-backend/src/main/java/com/drapeai/service/TryOnService.java)
- **Responsibility**: Orchestrates the 3-tier AI virtual try-on pipeline
- **Interface**:
  - `processTryOn(userEmail, request)` → `TryOnResponse` — main entry point
  - `getUserHistory(userEmail)` → `List<TryOnResponse>` — returns past VTO results
- **Internal tiers**:
  1. **Tier 1 (Colab)**: Calls `callColabEndpoint()` → sends JSON to ngrok URL, downloads result as base64 data URL
  2. **Tier 2 (HF Gradio)**: Calls `callHuggingFaceGradio()` → uploads images via `/upload`, submits to `/queue/join`, polls `/queue/data` SSE until completion, returns result URL
  3. **Tier 3 (Fallback)**: Returns `product.getImageUrl()` — the garment image itself (user sees the product image instead of a VTO result)
- **Key complexity**: The Colab endpoint returns a URL that requires an ngrok bypass header for the browser to load, so `downloadImageAsBase64()` downloads it server-side and re-encodes it as a data URL
- **Used by**: `TryOnController`

#### `JwtAuthFilter` (drapeai-backend/src/main/java/com/drapeai/security/JwtAuthFilter.java)
- **Responsibility**: Extracts JWT from `Authorization: Bearer <token>` header on every request, validates it, and sets the Spring Security authentication context
- **Key behavior**: Silently ignores invalid/missing tokens — lets unauthenticated requests through (controllers check `Authentication` parameter themselves where needed)
- **Used by**: `SecurityConfig` (added before `UsernamePasswordAuthenticationFilter`)

#### `JwtService` (drapeai-backend/src/main/java/com/drapeai/service/JwtService.java)
- **Responsibility**: Creates and validates JWTs with HS256 signing
- **Key detail**: Uses a hardcoded fallback secret (`drapeai-super-secret-key...`) via `@Value("${jwt.secret:...}")` — production should override this
- **Token expiry**: 24 hours (86400000ms)

#### `Order` Model (drapeai-backend/src/main/java/com/drapeai/model/Order.java)
- **Responsibility**: MongoDB document with nested `OrderItem` and `ShippingAddress` inner classes
- **Status enum**: `PENDING` → `PROCESSING` → `SHIPPED` → `DELIVERED`
- **Key detail**: `createdAt` has `@Builder.Default` of `Instant.now()`, but in `OrderService.createOrder()` it's explicitly set again

#### `TryOnRequest` DTO
- **Fields**: `productId`, `userImage` (base64 data URL), `category`
- **Used by**: TryOnController → TryOnService → Colab/HF pipeline

### Frontend

#### `AuthContext` (drapeai-frontend/src/context/AuthContext.tsx)
- **Responsibility**: Global auth state — stores JWT token and user info in localStorage, provides `login()`, `register()`, `logout()`, `refreshUser()`
- **Lifecycle**: On mount, reads saved token/user from localStorage, validates by calling `/api/account/me`. If validation fails, clears everything
- **Persistence**: Token + user JSON in `localStorage` keys `drapeai_token` and `drapeai_user`

#### `CartContext` (drapeai-frontend/src/context/CartContext.tsx)
- **Responsibility**: Global cart state — items persisted to `localStorage` under `drapeai_cart`
- **Provides**: `addToCart`, `removeFromCart`, `updateQuantity`, `clearCart`, computed `cartCount` and `cartSubtotal`

#### `TryOnModal` (drapeai-frontend/src/components/TryOnModal.tsx)
- **Responsibility**: 3-step VTO wizard UI — (1) model selection/preset/upload/webcam, (2) processing animation with progress bar + elapsed timer, (3) result view with before/after slider, download, add-to-cart
- **Key implementation**: Uses `processHuggingFaceVTO` from `hfVtoService.ts` which calls `/api/try-on/process` with a 3-minute timeout
- **State machine**: `selectedImage` → `isProcessing` → `resultImage` → `error`

#### `api.ts` Axios Client (drapeai-frontend/src/services/api.ts)
- **Responsibility**: Centralized HTTP client with JWT interceptor and retry logic
- **Retry**: 3 retries with exponential backoff (1s, 2s, 4s) on status codes 408, 429, 500, 502, 503, 504 + network errors
- **All API modules**: `authApi`, `accountApi`, `productApi`, `tryOnApi`, `orderApi`

---

## Data Flow

### Main Flow: User Browses Products
1. User opens `/` → `App.tsx` renders `HomePage`
2. `HomePage` calls `productApi.getProducts()` → Axios GET `/api/products` (with optional `?category=apparel` filter)
3. Backend `ProductController.getAllProducts()` queries MongoDB via `ProductRepository`
4. On failure, `catalog.ts` local curated data is used as fallback
5. Products rendered as `ProductCard` components in a 4-column bento grid

### Auth Flow: Register / Login
1. User fills form on `/login` → `handleSubmit` calls `authApi.login({email, password})`
2. Backend `AuthService.login()` authenticates via `AuthenticationManager` (BCrypt), generates JWT via `JwtService`, returns `AuthResponse`
3. Frontend stores token in `localStorage` → future requests have `Authorization: Bearer <token>` header via Axios interceptor
4. `AuthContext` sets `user` and `isAuthenticated`

### AI Virtual Try-On Flow (The Core Feature)
1. User opens TryOnModal on a product → selects preset/upload/webcam image → clicks "Generate AI Try-On"
2. `processHuggingFaceVTO()` in `hfVtoService.ts` converts user image to base64 data URL
3. POST request to `/api/try-on/process` with `{ productId, userImage (base64), category }`
4. Backend `TryOnService.processTryOn()`:
   a. Loads `Product` from MongoDB by `productId`
   b. Calls `generateResultImage()` which tries 3 tiers:
      - **Tier 1**: POST to Colab ngrok URL (`callColabEndpoint`) → receives `{ result_url }` → downloads image → returns base64 data URL
      - **Tier 2**: Uploads images to HF Gradio `/upload` → POST to `/queue/join` → polls `/queue/data` SSE for `process_completed` → parses result image URL
      - **Tier 3**: Returns product image URL as graceful fallback
   c. Saves `TryOnHistory` document to MongoDB
   d. Returns `TryOnResponse` with `resultImageUrl` (base64 data URL)
5. Frontend receives result → renders before/after slider with original photo vs AI result
6. User can download the result image or add the product to cart

### Order Flow
1. User on `/checkout` fills shipping form → `orderApi.createOrder(payload)`
2. Backend `OrderService.createOrder()` creates `Order` with status `PENDING`
3. Admin on `/admin` can update status via `select` dropdown → PUT `/api/orders/{id}/status?status=PROCESSING`

---

## Non-Obvious Behaviors & Design Decisions

### JWT Secret Security
- **The secret key is hardcoded as a default fallback** in `JwtService.java` line:
  ```java
  @Value("${jwt.secret:drapeai-super-secret-key-that-is-at-least-256-bits-long-for-hs256}")
  ```
- This is a placeholder key — anyone who can read the source can forge tokens. **Production must override** this via `application.properties` or environment variables. This is especially dangerous because the secret is also derivable since it's base64-encoded from raw bytes via `secretKey.getBytes()`.

### CORS Dual Configuration
- The app has **two CORS configurations** that overlap:
  1. `SecurityConfig.corsConfigurationSource()` — allows all origins (`setAllowedOriginPatterns(List.of("*"))`)
  2. `WebConfig.addCorsMappings()` — allows specific origins (`localhost:5173`, `localhost:80`, `localhost`)
- Spring Security's CORS configuration at the filter level takes precedence, so the `WebConfig` is effectively redundant for secured endpoints, but provides CORS for non-Spring-Security-filtered paths.

### 3-Tier VTO Pipeline Fallback Design
- The pipeline tries Colab first (user-controlled GPU, potentially fast) → HF Gradio Space (public model, slow queues) → product image (no AI, graceful degradation)
- Tier 1 (Colab) **downloads the image server-side** and re-encodes as base64 data URL because ngrok-hosted URLs require a custom `ngrok-skip-browser-warning` header that a browser `<img>` tag cannot set. This is a clever workaround but adds latency and memory overhead (base64 is ~33% larger than binary).
- Tier 2 (HF Gradio) uses REST API (not the Gradio JS client) — implements multipart file upload to `/upload`, queues the job via `/queue/join`, then polls the SSE endpoint `/queue/data` — all via `RestTemplate`. This is fragile: the SSE parsing is string-based regex, not structured parsing.
- The Gradio API **function index and trigger_id are hardcoded** (`fn_index: 0`, `trigger_id: 6`) — these depend on the specific Gradio space configuration and could break silently if the space changes.

### Frontend Fallback Catalog
- `curatedCatalog` in `catalog.ts` is shipped as part of the JS bundle (~10 products, ~5KB). Every page that shows products falls back to this catalog when the backend is unreachable.
- However, the **product IDs are hardcoded strings** (`'1'`, `'2'`, ... `'10'`) — these must match the MongoDB IDs seeded by `DatabaseSeeder` exactly for cart/checkout/TryOn flows to work when mixing backend and fallback data.

### Cart Item Type & Backend Payload Mismatch
- Frontend `CartItem` stores `product: Product` (full product object). Backend `CreateOrderRequest` expects `OrderItemPayload[]` with `{ productId, name, imageUrl, price, quantity }`. The `CheckoutPage` correctly transforms cart items into order payload, but this transformation lives only in the checkout flow — there's no shared mapping utility.

### TryOnHistory `userId` vs `userEmail`
- `TryOnHistory` model has both a `userId` field (never set) and a `userEmail` field (always set). The `userId` field is unused dead code. The service sets `userEmail` but never `userId`, making the `userId` field effectively a schema artifact.

### AdminPage Full CRUD
- The admin page has full product CRUD (create, read, update, delete) exposed without any role check on the frontend routes — it relies on the backend's `/api/products` PUT/DELETE being JWT-protected. However, `ProtectedRoute` wraps the admin page, but the backend returns 403 if the user is authenticated but not ADMIN — the frontend doesn't distinguish between USER and ADMIN roles for the admin page.
- The backend `OrderController.getAllOrdersAdmin()` is protected by JWT auth (`.anyRequest().authenticated()`) but has **no ADMIN role check** — any authenticated user can see all orders.

### Health Check Design Pattern
- Both services (`drapeai-backend` and `drapeai-frontend` in docker-compose) have health checks, and the frontend `depends_on` the backend with `condition: service_healthy`. This ensures the full stack starts in order.
- Nginx health check uses `wget --spider`; Backend uses `curl /api/health`; MongoDB uses `mongosh --eval ping`.

### JwtService getSigningKey() Implementation Detail
```java
private SecretKey getSigningKey() {
    byte[] keyBytes = Decoders.BASE64.decode(
            java.util.Base64.getEncoder().encodeToString(secretKey.getBytes())
    );
    return Keys.hmacShaKeyFor(keyBytes);
}
```
This is **re-encoding the raw key bytes as base64 then decoding them** — essentially a no-op that guarantees a valid base64 input for `Decoders.BASE64.decode()`. But if the raw key (from `secretKey.getBytes()`) contains bytes that aren't valid UTF-8 (unlikely for this ASCII string), this could produce different keys. The intended approach is `Keys.hmacShaKeyFor(secretKey.getBytes(StandardCharsets.UTF_8))` — the current approach works but is roundabout.

### Missing `spring.mvc.servlet.max-body-post-size` property
- `application.properties` has `spring.mvc.servlet.max-body-post-size=20MB` — this property doesn't exist in Spring Boot. The correct property for servlet-based applications is `spring.servlet.multipart.max-request-size` (already set). This third line is silently ignored.

### Colab Notebook Exposes ngrok Auth Token
- The Colab script `drapeai_vto_backend.py` contains a hardcoded `NGROK_AUTHTOKEN`:
  ```python
  NGROK_AUTHTOKEN = "2WoSAbuOUvepuRnOcJZQEs7OWkS_6EbQ9C8LmFmBsbtjN3WHx"
  ```
  This is committed to the repository — anyone with access to the repo can use this ngrok token.

### Gradio Polling is Synchronous and Blocking
- `TryOnService.callHuggingFaceGradio()` uses `RestTemplate` with a 180s read timeout and polls every 3 seconds for up to 60 attempts (3 minutes total). This is fully synchronous and **blocks the backend thread** for the entire duration of the AI inference. Under load, this could exhaust the tomcat thread pool.
- There is no async processing, queue, or WebSocket-based status streaming.

### Frontend Processing Animation is Decoupled from Real Progress
- The `TryOnModal` processing UI shows a simulated progress bar (stages: encoding, connecting, fitting, rendering, almost-there) that advances every 6 seconds regardless of actual backend progress. The real progress message from `processHuggingFaceVTO` is also shown, but the progress percentage is driven by the timer, not the actual response.
- If the backend returns quickly (e.g., Colab is fast), the animation may not reach 100% before the result appears.

---

## Module Reference

| File | Purpose |
|------|---------|
| `docker-compose.yml` | Orchestrates MongoDB + backend + frontend containers with health checks |
| `colab/drapeai_vto_backend.py` | Colab FastAPI server that runs IDM-VTON inference via Gradio client, exposed via ngrok |
| `drapeai-backend/pom.xml` | Maven project with Spring Boot 3.3, JWT 0.12.3, Lombok 1.18.46 |
| `drapeai-backend/Dockerfile` | Multi-stage Maven build → JRE 21 Alpine runtime |
| `drapeai-backend/src/main/resources/application.properties` | Config: MongoDB URI, HF token, Colab URL, multipart limits |
| `drapeai-backend/.../SecurityConfig.java` | JWT-filter-chain, stateless sessions, CORS, endpoint permissions |
| `drapeai-backend/.../JwtAuthFilter.java` | Extracts JWT from Bearer header, validates, sets SecurityContext |
| `drapeai-backend/.../JwtService.java` | HS256 JWT creation/validation with 24h expiry |
| `drapeai-backend/.../TryOnService.java` | **Core**: 3-tier AI pipeline (Colab → HF Gradio → Fallback) |
| `drapeai-backend/.../AuthService.java` | Registration + login with BCrypt + JWT generation |
| `drapeai-backend/.../OrderService.java` | Order CRUD + status management |
| `drapeai-backend/.../CustomUserDetailsService.java` | Loads user by email for Spring Security |
| `drapeai-backend/.../TryOnController.java` | POST `/api/try-on/process`, GET `/api/try-on/history` |
| `drapeai-backend/.../AuthController.java` | POST `/api/auth/register`, POST `/api/auth/login` |
| `drapeai-backend/.../ProductController.java` | CRUD `/api/products`, filterable by category |
| `drapeai-backend/.../OrderController.java` | POST/GET `/api/orders`, admin GET all, PUT status |
| `drapeai-backend/.../AccountController.java` | GET/PUT `/api/account/me` |
| `drapeai-backend/.../GlobalExceptionHandler.java` | Handles API, validation, auth, and generic exceptions → structured error responses |
| `drapeai-backend/.../DatabaseSeeder.java` | Seeds 10 curated products into MongoDB on boot (if DB empty) |
| `drapeai-backend/.../User.java` | MongoDB user document with Role enum |
| `drapeai-backend/.../Product.java` | MongoDB product document (brand, name, price, category, imageUrl, etc.) |
| `drapeai-backend/.../Order.java` | MongoDB order with nested OrderItem and ShippingAddress, status enum |
| `drapeai-backend/.../TryOnHistory.java` | MongoDB VTO history (userEmail, productId, resultImageUrl) |
| `drapeai-frontend/package.json` | React 18 + Vite + Tailwind + Framer Motion + Axios |
| `drapeai-frontend/Dockerfile` | Multi-stage: Node 20 build → Nginx Alpine serve |
| `drapeai-frontend/nginx.conf` | SPA fallback routing + `/api/` proxy to backend |
| `drapeai-frontend/vite.config.ts` | Dev server proxy `/api` → `localhost:8080` |
| `drapeai-frontend/src/App.tsx` | Router + HomePage + Layout with AuthProvider, CartProvider, ErrorBoundary |
| `drapeai-frontend/src/services/api.ts` | Axios client with JWT interceptor + retry (3×, exponential backoff) + all endpoint functions |
| `drapeai-frontend/src/services/hfVtoService.ts` | `processHuggingFaceVTO()` — converts images, calls `/try-on/process`, handles errors |
| `drapeai-frontend/src/context/AuthContext.tsx` | Global auth state with localStorage persistence |
| `drapeai-frontend/src/context/CartContext.tsx` | Global cart state with localStorage persistence |
| `drapeai-frontend/src/data/catalog.ts` | 10-product curated catalog as frontend fallback when backend is offline |
| `drapeai-frontend/src/components/TryOnModal.tsx` | 3-step VTO wizard: image selection → processing animation → result slider |
| `drapeai-frontend/src/components/WebcamCapture.tsx` | Browser `getUserMedia` selfie capture |
| `drapeai-frontend/src/components/ProductCard.tsx` | Product grid card with grayscale→color hover, Try-On + View Details overlay |
| `drapeai-frontend/src/components/Navbar.tsx` | Fixed top nav with user menu dropdown, cart badge, search |
| `drapeai-frontend/src/components/HeroSection.tsx` | Parallax hero with watermark scroll effect |
| `drapeai-frontend/src/components/ProtectedRoute.tsx` | Auth guard → redirects to `/login` if unauthenticated |
| `drapeai-frontend/src/components/ErrorBoundary.tsx` | React error boundary with reset-to-home button |
| `drapeai-frontend/src/pages/LoginPage.tsx` | Split-screen login with glassmorphism card, social buttons |
| `drapeai-frontend/src/pages/RegisterPage.tsx` | Registration form |
| `drapeai-frontend/src/pages/ProductDetailPage.tsx` | Full product detail + related products + try-on trigger |
| `drapeai-frontend/src/pages/CheckoutPage.tsx` | Shipping form + order summary + place order |
| `drapeai-frontend/src/pages/OrdersPage.tsx` | Order history with status badges and sample fallback |
| `drapeai-frontend/src/pages/AccountPage.tsx` | Profile summary + recent orders link |
| `drapeai-frontend/src/pages/SettingsPage.tsx` | Account settings (name, size, style, newsletter) |
| `drapeai-frontend/src/pages/AdminPage.tsx` | Product CRUD table + order management with status select |

---

## Suggested Reading Order

1. **`docker-compose.yml`** — Start here to understand the full system architecture (3 services, networking, health checks, env vars)
2. **`drapeai-backend/.../TryOnService.java`** — The most complex and interesting file: the 3-tier AI pipeline that makes this app unique. Understanding Colab → HF Gradio → Fallback reveals the core value proposition
3. **`drapeai-frontend/src/components/TryOnModal.tsx`** — The frontend counterpart: 3-step VTO wizard, state machine, processing UX
4. **`drapeai-backend/.../SecurityConfig.java`** + **`JwtAuthFilter.java`** — Understand the auth model: stateless JWT, which endpoints are public vs protected
5. **`drapeai-frontend/src/context/AuthContext.tsx`** + **`CartContext.tsx`** — State management patterns, localStorage persistence
6. **`drapeai-frontend/src/App.tsx`** + **`drapeai-frontend/src/services/api.ts`** — Understand routing, API client setup, retry logic, fallback data flow
7. **`colab/drapeai_vto_backend.py`** — The AI inference server design: FastAPI + Gradio Client + ngrok
8. **`drapeai-backend/pom.xml`** + **`drapeai-backend/Dockerfile`** — Build system, dependency versions, multi-stage docker
