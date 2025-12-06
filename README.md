# 🚀 Shopify Multi-Tenant Data Sync & Analytics Dashboard

A multi-tenant platform for syncing **Shopify Products, Orders, and Customers** and visualizing analytics through a React dashboard.

This project demonstrates real-world engineering concepts such as multi-tenancy, scheduled data sync, Shopify API integration, clean ORM design, and production-grade deployment.

---
LINK - https://xeno-fde-p824-48o3i17s2-aarshjain09s-projects.vercel.app/

## 📌 Tech Stack

### **Backend**
- Node.js + Express.js  
- Sequelize ORM  
- MySQL (Multi-tenant schema)  
- node-cron (automated sync jobs)

### **Frontend**
- React (Vercel deployment)  
- Recharts (analytics visualization)  
- Axios (API communication)

### **Integration**
- Shopify Admin REST API  

### **Deployment**
- Backend → Render  
- Frontend → Vercel  

---

## 🌐 Features

### 🔐 **Multi-Tenant Architecture**
- Each tenant stores Shopify credentials (store URL + access token)
- All synced data contains a `tenantId` for isolation  
- Clean relational schema using Sequelize models  

---

### 🔄 **Automated Shopify Data Sync**
Supports syncing:

- Products  
- Orders  
- Customers  

Sync methods:

- **Manual Sync** → `/api/sync/run/:tenantId`  
- **Automatic Sync** → via `node-cron`  

---

### 📊 **Analytics Dashboard**

Frontend dashboard includes:

- Total Revenue  
- Total Orders  
- Orders per Day Chart  
- Top Selling Products  
- Customer Growth Metrics  

---

## 🏗 High-Level Architecture Diagram (PlantUML)

<img width="998" height="964" alt="xeno_architecture" src="https://github.com/user-attachments/assets/c3acd6c7-a0cf-470d-9b4b-45ae1d63ff55" />


## 📂 Project Structure

```
/backend
  /src
    /config/db.js
    /models/*.js
    /routes/tenants.js
    /routes/sync.js
    /routes/analytics.js
    /services/shopifySync.js
    index.js
    cron.js

/frontend
  /src
    /components
    /pages
    /services/api.js
    /styles
```

---

## 🗄 Database Schema

### **tenants**
| field | type |
|-------|------|
| id | UUID |
| storeUrl | string |
| accessToken | string |

---

### **products**
| field | type |
|-------|------|
| id | int |
| tenantId | FK |
| shopifyProductId | varchar |
| title | varchar |
| price | decimal |
| inventory | int |

---

### **orders**
| field | type |
|-------|------|
| id | int |
| tenantId | FK |
| shopifyOrderId | varchar |
| totalPrice | decimal |
| currency | varchar |
| createdAt | datetime |

---

### **customers**
| field | type |
|-------|------|
| id | int |
| tenantId | FK |
| shopifyCustomerId | varchar |
| name | varchar |
| email | varchar |

---

## 🔗 API Endpoints

### **Tenant APIs**
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/tenants/register` | Register a tenant |
| GET  | `/api/tenants` | List tenants (debug) |

---

### **Sync APIs**
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/sync/run/:tenantId` | Manually trigger sync |
| GET  | `/api/sync/status/:tenantId` | Get last sync timestamp |

---

### **Analytics APIs**
| Method | Endpoint |
|--------|----------|
| GET | `/api/analytics/orders/:tenantId` |
| GET | `/api/analytics/revenue/:tenantId` |
| GET | `/api/analytics/products/:tenantId` |
| GET | `/api/analytics/customers/:tenantId` |

---

## 🚀 Local Development

### **Backend Setup**
```bash
cd backend
npm install
npm run dev
```

---

### **Frontend Setup**
```bash
cd frontend
npm install
npm start
```

---

## 🌐 Deployment

### **Backend (Render)**
- Add environment variables:
  - `DB_HOST`
  - `DB_USER`
  - `DB_PASSWORD`
  - `DB_NAME`
  - `PORT`
- Build: `npm install`
- Start: `npm start`

---

### **Frontend (Vercel)**
- Deploy via GitHub integration  

---

## ⚠️ Known Limitations

- Shopify OAuth app installation not implemented  
- No real-time webhooks (using cron instead)  
- Basic token auth (not full session management)  

---

