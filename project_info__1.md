# DrapeAI — Full Codebase Review

## Summary

DrapeAI is a full-stack e-commerce web application for a fashion brand. It allows users to browse a curated catalog of apparel and footwear, select products, and manage orders via a single-page application. The stack uses Spring Boot (Java 21) + MongoDB on the backend, and React + TypeScript + Vite + Tailwind on the frontend. The application is Dockerized and orchestrated with Docker Compose, with CI/CD via GitHub Actions.

---

## Architecture

**Pattern**: Layered monolith (backend) + Single Page Application (frontend)

**Technology Stack**:
- **Backend**: Java 21, Spring Boot, Spring Security, Spring Data MongoDB, JWT, Lombok, Maven
- **Frontend**: React, TypeScript, Vite, Tailwind CSS, React Router, Framer Motion, Axios
- **Database**: MongoDB
- **Infrastructure**: Docker Compose, Nginx (frontend serving + reverse proxy), GitHub Actions CI/CD

**Entry Points**:
- Backend: `drapeai-backend/src/main/java/com/drapeai/DrapeAiApplication.java`
- Frontend: `drapeai-frontend/src/main.tsx`

---

## Directory Structure (high level)

```
DrapeAI/
├── docker-compose.yml              — service orchestration (MongoDB, backend, frontend)
├── drapeai-backend/
│   ├── pom.xml
│   └── src/main/java/com/drapeai/
│       ├── DrapeAiApplication.java
│       ├── config/ (SecurityConfig, WebConfig, DatabaseSeeder)
│       ├── controller/ (AuthController, ProductController, OrderController, AccountController, HealthController)
│       ├── model/ (User, Product, Order)
│       ├── model/dto/ (request/response DTOs)
│       ├── repository/ (Spring Data repositories)
│       └── service/ (AuthService, JwtService, OrderService, etc.)
├── drapeai-frontend/
│   ├── package.json
│   ├── Dockerfile
│   ├── nginx.conf
│   └── src/ (React app: components, pages, services, context, types)
```

---

## Key Notes

- The application previously contained an experimental AI Virtual Try-On (VTO) feature used for prototyping. That feature and its worker/Colab artifacts have been removed from the codebase as part of the cleanup.
- Core flows remaining: product catalog, authentication (JWT), cart/checkout, orders, admin product CRUD.
- The Docker Compose setup starts MongoDB, the backend, and the frontend with health checks to ensure ordering.

---

## Suggested Reading Order

1. `docker-compose.yml` — system architecture and service startup order
2. `drapeai-backend/src/main/java/com/drapeai/config/SecurityConfig.java` — JWT + CORS configuration
3. `drapeai-backend/src/main/java/com/drapeai` service and controller packages — backend API surfaces
4. `drapeai-frontend/src/services/api.ts` and `drapeai-frontend/src/App.tsx` — API client and routing

---

If you want, I can now run a build and smoke-test the backend, then bring up Docker Compose to verify runtime services. Or I can continue by cleaning remaining documentation and committing the changes.
