# ThinkSwipe: The Future of Technical Interview Prep

<p align="center">
  <img src="./docs/images/hero.png" width="800" alt="ThinkSwipe Premium Hero" />
</p>

ThinkSwipe is a high-performance, mobile-first technical interview simulator designed for the modern engineer. Built with a TikTok-style infinite feed, it provides instantaneous, high-signal interview practice across DSA, System Design, and HR behavioral categories.

---

## 🏗️ High-Level Design (HLD)

The ThinkSwipe architecture is built for global low-latency and high availability, leveraging a distributed cloud edge network.

```mermaid
graph TD
    User((User)) -->|HTTPS| Frontend[Vercel Global Edge]
    User -->|API Request| LB[Cloudflare Worker Proxy]
    
    subgraph "Intelligent Edge Proxy (Cloudflare)"
        LB -->|Strip /api| P1[Prefix Stripping]
        LB -->|Allow Headers| P2[CORS Policy Engine]
        P1 & P2 --> Proxy[Forwarded Request]
    end
    
    subgraph "Global Backend Mesh (Render)"
        Proxy -->|Weighted Hash| R1[Render Instance 1]
        Proxy -->|Weighted Hash| R2[Render Instance 2]
        Proxy -->|Weighted Hash| R3[Render Instance 3]
        Proxy -->|Weighted Hash| R4[Render Instance 4]
    end
    
    subgraph "Database Infrastructure (TiDB Cloud)"
        R1 & R2 & R3 & R4 -->|Auth & Persistence| P_DB[(Primary TiDB - Asia)]
        P_DB -.->|Daily Async Sync| S_DB[(Secondary TiDB - Europe)]
    end
    
    subgraph "Security & Monitoring"
        LB -->|Admin Auth| Admin[(Admin Security Layer)]
        Health[Uptime Robot] -->|Pings| LB
        GH[GitHub Actions] -->|Keep-Alive| R1 & R2 & R3 & R4
    end
```

---

## 🛠️ Low-Level Design (LLD)

### Data Persistence & Reliability Logic
ThinkSwipe implements a robust database synchronization strategy to ensure zero data loss and multi-region disaster recovery.

<p align="center">
  <img src="./docs/images/infra.png" width="600" alt="Infrastructure Reliability" />
</p>

1. **Active/Passive DB Strategy**: 
   - Operations occur on the **Primary TiDB Cluster (AWS ap-southeast-1)**.
   - A dedicated **GitHub Action** performs a daily SQL & CSV dump of the primary cluster.
2. **Synchronization Protocol**:
   - The dump is automatically synchronized to the **Secondary TiDB Cluster (AWS eu-central-1)**.
   - The sync process uses a `REPLACE INTO` logic and `SET FOREIGN_KEY_CHECKS=0` to ensure seamless data updates even in restricted system environments.
3. **Artifact Retention**: Every backup run generates downloadable `.sql.gz` and `.zip` (CSV) artifacts for offline auditing.

---

## ✨ Key Features

### 1. Instant Practice Feed
Experience a distraction-free, swipeable interface that serves high-quality interview questions instantly.
- **Categories**: DSA (Data Structures), System Design, HR Behavioral.
- **Looping Mechanism**: Custom client-side infinite loop ensures you never run out of practice.

### 2. AI-Powered Evaluation
Get immediate feedback on your answers with a proprietary scoring algorithm.
- **Feedback Loop**: Detailed feedback and a 1-10 score are provided for every attempt.
- **Model Solutions**: Reveal industry-standard answers to compare against your approach.

<p align="center">
  <img src="./docs/images/eval.png" width="500" alt="AI Evaluation Feature" />
</p>

### 3. Progressive Web App (PWA)
Install ThinkSwipe on any device for a native-like experience with offline capabilities and instant loading.

---

## 🚀 Tech Stack

| Component | Technology |
| :--- | :--- |
| **Frontend** | React 18, Vite, TailwindCSS (optional), Axios |
| **Backend** | Spring Boot 3, Java 17, Hibernate, MySQL Driver |
| **Edge/LB** | Cloudflare Workers (JavaScript) |
| **Database** | TiDB Cloud (Primary & Secondary Clusters) |
| **Hosting** | Vercel (Frontend), Render (Backend Instances) |
| **DevOps** | GitHub Actions (Sync, Backup, Keep-Alive) |
| **Monitoring** | Uptime Robot |

---

## 📊 Infrastructure Details

### Backend Instances (Render)
ThinkSwipe uses a distributed pool of backends to handle load:
- **swipe-render1**: `https://thinkswipe.onrender.com`
- **9ahs-render2**: `https://thinkswipe-9ahs.onrender.com`
- **9mg2-render3**: `https://thinkswipe-9mg2.onrender.com`
- **i5tn-render4**: `https://thinkswipe-i5tn.onrender.com`


### Reliability & Uptime
- **Keep-Alive**: A 14-minute interval GitHub Action ensures Render backends never go into sleep mode.
- **Monitoring**: Uptime Robot tracks the Cloudflare Worker availability 24/7.

---

## 💾 Database Access

| Cluster | Region | Host |
| :--- | :--- | :--- |
| **Primary** | Asia (ap-southeast-1) | `gateway01.ap-southeast-1.prod.aws.tidbcloud.com` |
| **Secondary** | Europe (eu-central-1) | `gateway01.eu-central-1.prod.aws.tidbcloud.com` |

---

## 🛠️ Getting Started

### Backend Setup (Java/Maven)
```bash
# Navigate to backend
cd Interview_App/backend
# Build and run
mvn spring-boot:run
```

### Frontend Setup (Node/Vite)
```bash
# Navigate to frontend
cd Interview_App/frontend
# Install and dev
npm install
npm run dev
```

---

## 🚀 Latest System Enhancements (April 2026)

### 1. Robust Backend Stability & Health Check
- **VAPID Safety**: Implemented safety guards in `PushController` to prevent backend initialization crashes with placeholder keys.
- **Root Health Check**: Added a `/` root controller to provide instant health status (`{"status": "online"}`).

### 2. Intelligent Edge Proxy (Cloudflare Worker)
- **Automatic Prefix Stripping**: The worker now intelligently detects and strips the `/api` prefix before forwarding requests to the Spring Boot backends, ensuring zero 404 errors.
- **Advanced CORS Management**: Expanded header whitelist to include `X-Visitor-Id` and `X-Admin-Token`, enabling seamless cross-origin administration.

### 3. Secure Admin Infrastructure
Move beyond hardcoded tokens with our new persistent security layer:
- **Database-Backed Admin**: Admin credentials are now persisted in the TiDB cluster, making them tamper-proof and private.

<p align="center">
  <img src="./docs/images/admin_security.png" width="600" alt="Secure Admin Portal" />
</p>

- **Admin Security Flow (LLD)**:
  ```mermaid
  sequenceDiagram
      participant Admin
      participant Worker
      participant Backend
      participant TiDB
      
      Admin->>Worker: POST /api/admin/login (Credentials)
      Worker->>Backend: POST /admin/login (Stripped Prefix)
      Backend->>TiDB: Query Admin Account
      TiDB-->>Backend: Account Data
      Backend-->>Admin: Success + Dynamic Token
      Admin->>Worker: Request + X-Admin-Token
      Worker->>Backend: Forward Authorized Request
  ```

### 4. Advanced UX: Swipe Gesture System
Implement a native-like experience on mobile with our custom gesture pipeline:
- **Action**: Swipe Up on the main feed to trigger `handleSkip`.
- **LLD Event Pipeline**:
  ```mermaid
  graph LR
      TouchStart[onTouchStart] --> StoreY[Record ClientY]
      TouchEnd[onTouchEnd] --> Calc[Calculate DeltaY]
      Calc --> Threshold{DeltaY > 70px?}
      Threshold -->|Yes| Skip[Invoke handleSkip]
      Threshold -->|No| Cancel[Reset Gesture]
  ```

---

<p align="center">
  Built with ❤️ for the engineering community.
</p>
