# AARVIK
## A Web-Based Landslide Risk Monitoring and Early Warning Management System

> *"Understanding the Terrain. Preparing for Tomorrow."*

AARVIK is a full-stack environmental disaster management and risk monitoring platform engineered for mountain communities, civil authorities, and geotechnical monitoring teams. It provides systematic landslide risk tracking, community hazard reporting, early warning advisory management, and disaster safety guidelines.

---

## 1. Project Introduction

Landslides present acute threats to life, property, and national connectivity in hilly and mountainous regions across India, notably in Uttarakhand, Himachal Pradesh, the Western Ghats (Kerala/Karnataka), and the North-Eastern states. 

**AARVIK** (meaning *Mountain Beacon & Early Warning*) is a production-grade full-stack web application developed to bridge the critical gap between field observations, rainfall records, and civil disaster communication. It offers a transparent, responsive platform where communities can report emerging hazards and emergency administrators can verify threats and publish actionable early warning advisories.

### Conceptual Relation to AABHAS Model
* **AABHAS:** A separate Artificial Intelligence / Machine Learning prediction model specialized in geotechnical slope stability calculations, training on Digital Elevation Models (DEM), soil moisture, slope angles, and satellite telemetry.
* **AARVIK:** The web platform (this application) responsible for record visualization, community reporting, administrative review workflows, and public warning dissemination.
* **Integration Strategy:** AARVIK includes a dedicated service interface (`backend/services/aabhasService.js`) enabling future REST API connection with AABHAS without requiring codebase refactoring.

---

## 2. Problem Statement

Traditional landslide management faces key operational bottlenecks:
1. **Unstructured Field Reports:** Community observations of tension cracks or sudden seepage are often lost in informal channels, delaying early response.
2. **Lack of Centralized Telemetry:** Rainfall observations and hazard histories are scattered across disparate local departments.
3. **Information Delay:** Public bulletins often reach travelers and local residents too late, after roads have already failed.
4. **False Alarm Risks:** Unverified rumors cause public panic unless filtered through a structured administrative verification pipeline.

AARVIK solves these problems by providing an authenticated, database-backed platform with rigorous validation, administrative review stages, and standardized early warning notices.

---

## 3. Project Objectives

- **Democratize Hazard Reporting:** Enable citizens and field scouts to easily submit localized geotechnical observations with coordinates and photographs.
- **Support Complete CRUD Operations:** Provide full Create, Read, Update, and Delete workflows across Hazard Reports, Monitoring Records, and Official Alerts.
- **Ensure Data Integrity & Security:** Protect privileged operations via JWT authentication, bcrypt password hashing, and role-based access control (RBAC).
- **Prevent Misinformation:** Implement a multi-stage review pipeline (`Pending Review` &rarr; `Under Review` &rarr; `Verified` &rarr; `Resolved` / `Rejected`) so reports are properly screened.
- **Provide Actionable Visualizations:** Surface telemetry through modern Recharts dashboards, including temporal rainfall trends, district incident distributions, and status pies.
- **Promote Community Safety:** Disseminate actionable pre-monsoon, during-slide, and post-slide survival guidelines alongside national disaster helplines.

---

## 4. Main Features

### 🏔️ Public Portal
- **Interactive Landing Page:** Mountain-themed aesthetic, dynamic database-backed statistics, workflow explanation, and live warning previews.
- **Analytical Dashboard:** Temporal rainfall line charts, district-wise incident bar charts, report status distribution doughnut charts, and monitored location summaries.
- **Risk Monitoring Explorer:** Real-time data table displaying locations, districts, rainfall readings, risk badges (Low, Moderate, High, Critical), search, and multi-parameter filters.
- **Public Hazard Submission Form:** Client-side & server-side validated submission form for ground cracks, rockfalls, slope displacement, road damage, and unusual water seepage.
- **Early Warning Advisory Hub:** Severity-badged alerts detailing affected road corridors, anticipated threats, and actionable recommended precautions.
- **Comprehensive Safety Guidelines:** Visual checklists for disaster warning signs, phase-wise actions (Before, During, After), grab-and-go emergency bags, and direct national helplines.

### 🛡️ Administrative Command Console (Protected)
- **Multi-Stage Report Review:** Officers inspect submitted reports (including private reporter contact information) and adjust verification status (`Pending Review` &rarr; `Verified` &rarr; `Resolved`).
- **Monitoring Records Management:** Full CRUD operations for geotechnical monitoring stations and rainfall telemetry.
- **Advisory Publishing Engine:** Draft, publish, edit, expire, and resolve public early warning advisories.
- **AABHAS AI Model Integration Hub:** Status dashboard displaying future AI/ML inference connection health and integration schemas.

---

## 5. Technology Stack

### Frontend
- **Framework:** React.js (v18) initialized with Vite (v6)
- **Routing:** React Router DOM (v7) with nested layout routing and authentication guards
- **Styling:** Custom Mountain Design System using modern CSS3, CSS custom properties, and responsive flex/grid
- **Visualizations:** Recharts (Line Charts, Bar Charts, Doughnut/Pie Charts)
- **Icons:** Lucide React
- **API Client:** Axios with JWT request and response interceptors

### Backend
- **Runtime:** Node.js (v18+)
- **Framework:** Express.js (v4)
- **Database Driver:** Mongoose (v8) with schema validation, indexes, and aggregation pipelines
- **Security & Auth:** JSON Web Tokens (JWT), bcryptjs for salted password hashing, express-rate-limit
- **CORS:** Configured for cross-origin frontend communication
- **Environment:** dotenv

### Database
- **MongoDB:** MongoDB Atlas or local MongoDB instance (`mongodb://127.0.0.1:27017/aarvik`)
- **Zero-Blocker Fallback Engine:** Features an intelligent in-memory fallback adapter, ensuring seamless evaluation even if MongoDB is not locally running.

---

## 6. System Architecture

```
                                 [ Web Browser / Client ]
                                            │
                     ┌──────────────────────┴──────────────────────┐
                     ▼                                             ▼
             Public Portal Routes                        Protected Admin Console
         (Home, Dashboard, Reports,                       (Review Reports, CRUD Risks,
          Monitoring, Alerts, Safety)                     CRUD Alerts, Model Config)
                     │                                             │
                     └──────────────────────┬──────────────────────┘
                                            │ Axios API Client
                                            ▼
                               [ Express.js REST API Server ]
                                  (Port 5000 / Reverse Proxy)
                                            │
                 ┌──────────────────────────┼──────────────────────────┐
                 ▼                          ▼                          ▼
        [ Auth Middleware ]        [ Rate Limiting & ]        [ Centralized Error ]
        (JWT & Role Guard)           (Input Validation)            (Handler)
                 │                          │                          │
                 └──────────────────────────┼──────────────────────────┘
                                            │
                                  [ Controller Layer ]
                        (Auth, Reports, Risks, Alerts, Stats)
                                            │
                   ┌────────────────────────┴────────────────────────┐
                   ▼                                                 ▼
          [ Mongoose Models ]                              [ AABHAS Service ]
       (Admin, HazardReport,                               (AI/ML Model API
        RiskRecord, Alert)                                     Interface)
                   │
                   ▼
          [ MongoDB Database ]
        (Atlas / Local MongoDB)
```

---

## 7. Folder Structure

```
c:\aabhas\aavrik/
├── backend/
│   ├── config/
│   │   ├── db.js                 # MongoDB connection & status monitor
│   │   └── fallbackStore.js      # Zero-config in-memory demonstration store
│   ├── controllers/
│   │   ├── authController.js      # Admin login and session verification
│   │   ├── reportController.js    # Hazard report submission & review
│   │   ├── riskController.js      # Risk record monitoring CRUD
│   │   ├── alertController.js     # Early warning advisory CRUD
│   │   └── dashboardController.js # Aggregated statistics & chart feeds
│   ├── middleware/
│   │   ├── authMiddleware.js      # JWT verification & role authorization
│   │   ├── errorMiddleware.js     # Centralized 404 & error handlers
│   │   └── validateRequest.js     # Input validation & rate limiters
│   ├── models/
│   │   ├── Admin.js               # Administrator schema
│   │   ├── HazardReport.js        # Hazard report schema
│   │   ├── RiskRecord.js          # Monitoring station schema
│   │   └── Alert.js               # Early warning advisory schema
│   ├── routes/
│   │   ├── authRoutes.js
│   │   ├── reportRoutes.js
│   │   ├── riskRoutes.js
│   │   ├── alertRoutes.js
│   │   └── dashboardRoutes.js
│   ├── services/
│   │   └── aabhasService.js       # Future AABHAS AI/ML prediction connector
│   ├── scripts/
│   │   ├── createAdmin.js         # Dedicated admin account generator
│   │   └── seedDemoData.js        # Demonstration dataset seed script
│   ├── .env                       # Backend environment configuration
│   ├── .env.example               # Configuration template
│   ├── package.json
│   └── server.js                  # Express entry point
│
├── frontend/
│   ├── public/
│   │   └── logo.svg               # Mountain beacon brand logo
│   ├── src/
│   │   ├── assets/
│   │   │   └── logo.svg
│   │   ├── components/
│   │   │   ├── Navbar.jsx         # Header navigation & mobile menu
│   │   │   ├── Footer.jsx         # Footer & disaster disclaimers
│   │   │   ├── StatCard.jsx       # Analytical KPI metric card
│   │   │   ├── RiskBadge.jsx      # Low/Moderate/High/Critical badge
│   │   │   ├── AlertCard.jsx      # Early warning card component
│   │   │   ├── Modal.jsx          # Reusable modal container
│   │   │   ├── ConfirmDialog.jsx  # Deletion confirmation dialog
│   │   │   └── LoadingSpinner.jsx # Geotechnical loader
│   │   ├── context/
│   │   │   └── AuthContext.jsx    # React Auth Context for JWT state
│   │   ├── layouts/
│   │   │   ├── PublicLayout.jsx   # Public pages wrapper
│   │   │   └── AdminLayout.jsx    # Protected administrative wrapper
│   │   ├── pages/
│   │   │   ├── Home.jsx           # Landing page
│   │   │   ├── Dashboard.jsx      # Analytics & Recharts visualizations
│   │   │   ├── RiskMonitoring.jsx # Geotechnical monitoring records table
│   │   │   ├── ReportHazard.jsx   # Community hazard reporting form
│   │   │   ├── Alerts.jsx         # Early warning advisory listing
│   │   │   ├── AlertDetails.jsx   # Detailed alert view & precautions
│   │   │   ├── SafetyGuidelines.jsx # Disaster preparedness protocols
│   │   │   ├── Login.jsx          # Admin authentication page
│   │   │   ├── AdminPanel.jsx     # Comprehensive management dashboard
│   │   │   └── NotFound.jsx       # Custom 404 page
│   │   ├── services/
│   │   │   ├── api.js             # Axios base instance & interceptors
│   │   │   ├── authService.js
│   │   │   ├── reportService.js
│   │   │   ├── riskService.js
│   │   │   ├── alertService.js
│   │   │   └── dashboardService.js
│   │   ├── App.jsx                # Router configuration
│   │   ├── index.css              # Custom Mountain Design System
│   │   └── main.jsx               # React DOM entry point
│   ├── .env                       # Frontend environment configuration
│   ├── .env.example
│   ├── index.html
│   ├── package.json
│   └── vite.config.js
│
├── package.json                   # Root orchestrator package.json
└── README.md                      # Comprehensive project documentation
```

---

## 8. Installation & Setup Instructions

### Prerequisites
- **Node.js:** v18.0.0 or higher ([Download Node.js](https://nodejs.org/))
- **MongoDB:** Optional local MongoDB instance (`mongod`) or free MongoDB Atlas account. *(The application functions out of the box with its built-in fallback engine if MongoDB is not installed).*

---

### Step 1: Clone or Navigate to the Workspace
```bash
cd c:\aabhas\aavrik
```

### Step 2: Install Dependencies
Install dependencies for both backend and frontend:
```bash
# Install backend dependencies
cd backend
npm install

# Install frontend dependencies
cd ../frontend
npm install

# Return to root directory
cd ..
```

---

### Step 3: Configure Environment Variables

#### Backend Configuration (`backend/.env`):
A ready-to-use `.env` file is already generated. You can customize it as needed:
```env
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb://127.0.0.1:27017/aarvik
JWT_SECRET=aarvik_dev_jwt_secret_key_terrain_monitor_2026
JWT_EXPIRES_IN=24h
CLIENT_URL=http://localhost:5173

# Optional: Connect to AABHAS AI prediction server in future
# AABHAS_API_URL=http://localhost:8000/api/v1/predict
# AABHAS_API_KEY=your_aabhas_secret_key
```

#### Frontend Configuration (`frontend/.env`):
```env
VITE_API_URL=/api
```

---

### Step 4: Seed Database & Create Administrator

#### Option A: Seed Rich Demonstration Data
Inserts realistic landslide monitoring stations, active alerts, and field reports from Uttarakhand, Himachal Pradesh, and Kerala:
```bash
npm --prefix backend run seed
```

#### Option B: Create Custom Administrator Account
```bash
# Creates default administrator: admin@aarvik.org / AarvikAdmin#2026
npm --prefix backend run create-admin

# Or supply custom credentials via arguments:
node backend/scripts/createAdmin.js customadmin@aarvik.org CustomPassword#2026 "Chief Geologist"
```

---

### Step 5: Run the Complete Application

#### Terminal 1: Start Backend Server
```bash
cd backend
npm start
```
*Backend runs on: `http://localhost:5000`*
*Health check endpoint: `http://localhost:5000/api/health`*

#### Terminal 2: Start Frontend Application
```bash
cd frontend
npm run dev
```
*Frontend runs on: `http://localhost:5173`*

#### Or run from Root Directory using npm scripts:
```bash
# Terminal 1:
npm run backend

# Terminal 2:
npm run frontend
```

---

## 9. Administrator Credentials

| Role | Email | Password | Access Level |
| :--- | :--- | :--- | :--- |
| **System Administrator** | `admin@aarvik.org` | `AarvikAdmin#2026` | Full CRUD, Status Verification, Alert Publishing |

---

## 10. REST API Documentation

### Authentication Endpoints
| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/auth/login` | Public | Authenticate administrator and receive JWT token |
| `GET` | `/api/auth/me` | Protected | Verify current session and retrieve admin profile |

### Hazard Reports Endpoints
| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/reports` | Public | Submit new hazard report (rate-limited, validated) |
| `GET` | `/api/reports` | Public / Admin | List hazard reports (emails redacted on public view) |
| `GET` | `/api/reports/:id` | Public / Admin | Retrieve single report details |
| `PUT` | `/api/reports/:id` | Protected (Admin) | Update report status (`Verified`, `Resolved`, etc.) |
| `DELETE` | `/api/reports/:id` | Protected (Admin) | Delete a report permanently |

### Risk Monitoring Records Endpoints
| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/risks` | Public | List monitoring records with search & filters |
| `GET` | `/api/risks/:id` | Public | Get single monitoring station details |
| `POST` | `/api/risks` | Protected (Admin) | Create a new monitoring observation |
| `PUT` | `/api/risks/:id` | Protected (Admin) | Update an existing monitoring record |
| `DELETE` | `/api/risks/:id` | Protected (Admin) | Delete a monitoring record |

### Early Warning Alerts Endpoints
| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/alerts` | Public / Admin | Retrieve published alerts (Admin sees drafts) |
| `GET` | `/api/alerts/:id` | Public | Get single alert details and precautions |
| `POST` | `/api/alerts` | Protected (Admin) | Create and draft/publish a new alert |
| `PUT` | `/api/alerts/:id` | Protected (Admin) | Edit an alert, update status or precautions |
| `DELETE` | `/api/alerts/:id` | Protected (Admin) | Delete an advisory with confirmation |

### Dashboard & Analytics Endpoints
| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/dashboard/stats` | Public | Consolidated metrics, charts data, and recent logs |
| `GET` | `/api/dashboard/aabhas-status` | Public | Healthcheck for future AABHAS model connection |

---

## 11. Future Scope: AABHAS Model Integration

When the **AABHAS AI/ML prediction model** is deployed as an inference microservice (e.g. FastAPI / Flask / PyTorch):

1. **Configure Environment Variables:**
   ```env
   AABHAS_API_URL=https://aabhas-model.internal.gov/api/v1
   AABHAS_API_KEY=production_secure_token_key
   ```
2. **Automated Ingestion:**
   The service in `backend/services/aabhasService.js` transmits field measurements (rainfall, slope inclination, soil moisture) to the AABHAS inference pipeline and parses the returned landslide susceptibility index into AARVIK monitoring records tagged as `dataSource: 'AABHAS model output'`.
3. **Automated Warning Triggers:**
   When the susceptibility index exceeds critical thresholds ($I_s > 0.85$), the system can auto-draft an early warning advisory for administrative confirmation.

---

## 12. Limitations & Academic Disclaimer

- **Academic Project Notice:** AARVIK was developed as a college Web Development project to demonstrate full-stack architecture, REST API design, Mongoose integration, and reactive frontend engineering.
- **Simulated Telemetry:** Data records provided in this version are labeled demonstration entries or manual field observations. They must **not** be interpreted as verified meteorological measurements or official civil emergency directives.
- **Emergency Protocols:** In actual disaster contingencies, citizens must follow directions issued by the National Disaster Management Authority (NDMA), State Disaster Management Authorities (SDMA), and local emergency police (112).
