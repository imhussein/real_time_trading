## How to Run the Project (Backend + Frontend)

## Project Ports - BAckend and Frontend

- **Backend (NestJS):** runs on port **4001**  
  → http://localhost:4001

- **Frontend (React + Vite):** runs on port **5173**  
  → http://localhost:5173

Make sure both ports are free before running the project.

Follow these exact steps to run both backend and frontend together.  
Make sure you are using **Node.js v20.19.0** and **Yarn** as package manager.

---

### 1. Clone the Repository

```bash
git clone git@github.com:imhussein/real_time_trading.git
cd real_time_trading
cd backend && yarn install
cd ../frontend && yarn install
cd ../backend
yarn build
yarn start:prod
yarn start:dev
```

## Project Overview

This project is a complete real-time market dashboard built with **NestJS**, **React**, and **WebSockets**.  
The backend handles continuous live price updates for multiple tickers — stocks, crypto, commodities, and more — and streams them to all connected clients through a WebSocket gateway.

The frontend is fully reactive and uses **Redux**, **React Query**, and **Recharts** to display live prices and interactive charts.  
It supports real-time updates, responsive design, and a clean code structure that follows modern best practices.

The backend includes a **data simulator** that produces dynamic market prices, a **modular architecture**, and a clear separation between **gateway**, **services**, and **repositories**.  
Together, they demonstrate how to handle live data pipelines and WebSocket subscriptions efficiently — similar to how production trading systems broadcast real-time data.

## Assumptions & Trade-offs

In this project I made some assumptions and few trade-offs just to focus more on logic and structure rather than long setup.  
But below I want to explain what I would usually do in real production system and why I made each decision like this.

---

### Authentication

Here I used a simple JWT login with user `root / 123456` only for protecting the dashboard from public access.  
If this was a real production system I would have used **NextJS** for Server Side Rendering and Page Load Time Authentication  
with full **JWT + Refresh Token + HttpOnly Cookie mechanism**.

The backend would send cookie with `Secure` and `SameSite=None` and only allow frontend domain with `credentials:true`.  
This way no tokens are stored in localStorage and refresh token can be invalidated directly from **Redis** or **Postgres**.  
Frontend would use axios interceptors with queue system to hold pending API calls until new token is received.  
This is the correct way in production where tokens refresh automatically without the user even knowing.

---

### Data Storage

Right now all data (prices and history) is in-memory which is fine for testing but not for real systems.  
In real environment I would use **PostgreSQL** as main database since it is full **ACID** and extremely reliable for financial data.  
I always rely on **stored procedures** and **transaction blocks** to reduce round trips between app and DB,  
and when following microservice architecture I also use **Optimistic Concurrency Control (OCC)** to prevent data conflicts.  
This is very important when you have many instances writing and reading the same data.

---

### Real-Time Price Feed

Here I used a mock price generator that updates randomly every second to simulate market movement.  
In a real sysstem this modulee would be replaced by **Kafka** or **NATS** streaming which gives low latency and durability.  
Kafka is great for durable event storage and replays, while NATS is better for internal service communication and high throughput.  
Also I would use **Redis Adapter** or **MongoDB Adapter** for the WebSocket Gateway so multiple pods can share client sessions  
and survive restarts or scaling events without disconnecting users.  
This is how it’s usually done in real trading or analytics platforms where uptime and speed matter most.

---

### Communication Layer

I used REST API in this challenge because schema is simple and easy to test.  
But for real product where data shape becomes large or connected in cycles I would go with **GraphQL**.  
GraphQL helps manage schema changes, auto validate fields and makes it easy to support different clients like React, Flutter or mobile apps.  
For strict type validation I can also use **Zod** or **OpenAPI** to make sure both frontend and backend stay in sync.

---

### Frontend Layer

Frontend is built with **React**, **Redux**, and **React Query** to handle caching and state updates in real-time.  
In production I would focus a lot on optimization because frontend dashboards are usually heavy on rendering and memory.  
I would add API debouncing, better validation handling, and most importantly **Virtualization**.

From my real experience building complex dashboards (similar to what DEXScreener uses for crypto monitoring),  
I learned that **Virtualization** is one of the most important parts of high-performance frontend systems.  
It controls rendering of big tables or charts by rendering only visible items instead of full data at once.  
Without it the app will easily drop FPS and lag.  
I also learned to move big calculations to **Web Workers** and to flatten cyclic data before rendering to avoid blocking the main thread.

---

### Alerts System

Right now alerts are printed to console when price crosses threshold.  
In production I would make this a full feature that can notify internal dashboards via WebSocket  
and external users via **SendGrid emails** or **SMS**.  
This module can also be a separate microservice which handles queueing and cost control by grouping alerts into batches.  
For internal dashboards it can show real-time alerts instantly coming from backend gateway stream.

---

### System Complexity & Infra

Systems like this can grow huge very fast especially when data updates in real-time.  
In production I would use **Kubernetes** with **Helm charts** to deploy backend, frontend, and WebSocket services separately.  
Then use **Redis** as shared cache and connection adapter, and **Traefik** or **Nginx Ingress** for routing and SSL.  
Monitoring can be done with **Prometheus** and **Grafana**, and all logs sent to **ELK Stack** for analytics.  
All components would be containerized and connected through private network.

---

This architecture can scale to handle very high data updates and many concurrent users.  
What I built here already follows similar idea, and with few replacements (Kafka, Redis, PostgreSQL)  
it can become a real market data system that runs in distributed infrastructure just like production trading dashboards.

## Notes on Bonus Features

For this project, I focused mainly on getting the main market dashboard, real-time feed, and structure right.  
But there are few extra things I either implemented in a simple way or left space for improvement if time allowed.

---

### Authentication

I already added a small mock authentication to the system just for demo purpose with `root / 123456`.  
In real application I would make a full authentication system using **JWT with Refresh Token**,  
and use **HttpOnly Cookies** with `SameSite=None` and `Secure` enabled for better security.  
Also, I would handle token refresh and invalidation using **Redis** or **PostgreSQL** depending on system scale.  
On frontend, I usually manage requests using **axios interceptors** with queues, so when the JWT expires,  
all pending requests wait for the new token before re-firing automatically without the user noticing anything.

---

### Caching & Data

I used in-memory caching here inside the repository layer which is enough for small systems or tests.  
In large-scale production I would use **Redis** for distributed cache and for very fast read/write operations.  
Redis can also help to store temporary WebSocket session data and keep users connected across multiple pods.

---

### Alerting

Alerts system works now only inside console for quick view when a price crosses threshold.  
In full system this can be a separate service that sends **WebSocket messages** to internal dashboards,  
and also supports **email or SMS notifications** for external alerts using services like SendGrid or Twilio.  
There could also be throttling logic or alert windows to avoid too many triggers in high frequency feeds.

---

### Infrastructure Setup

I also included base Kubernetes configuration under `infra/` for both backend and frontend.  
In bigger system I usually go much deeper into Infra work like building **Helm charts** for microservices,  
and setting up **CI/CD pipelines** for auto-deployment to DigitalOcean or Cloud providers.  
Normally I use **Traefik Ingress** for routing with HTTPS certificates (via Let’s Encrypt or Cloudflare DNS),  
and **Redis adapter** for WebSocket load balancing between pods so connections don’t break during restarts.  
I also prefer using **GitHub Actions** or **custom bash pipelines** to build Docker images,  
push them to registry, and deploy to Kubernetes cluster automatically after each merge.

---

### Frontend & Performance

On frontend I use **React Query** and **Redux** for caching and state management,  
but there is more that can be done like adding **API debouncing**, **error boundaries**,  
and **Virtualization** for large datasets (especially for dashboards).  
From my own experience building high intensive data dashboards before,  
I learned that **Virtualization** is one of the most critical parts for performance in frontend heavy apps.  
Without it, the UI will drop frames when there are too many components or list items rendered at once.  
I also move large data flattening and processing logic to **Web Workers** to avoid blocking the main thread.

---

### Scaling

If this project grows, it can easily be turned into full distributed architecture using:

- **PostgreSQL** for transactions and data consistency.
- **Kafka or NATS** for low-latency data streaming between services.
- **Redis** for shared cache and event publishing.
- **Kubernetes with auto-scaling** for both backend and frontend pods.
- **Prometheus and Grafana** for metrics and performance dashboards.

---

These are the kind of things I normally setup in similar real-world systems,  
and with few more steps this codebase can already be extended into a real production-grade platform.
