# 🚀 Shopify Multi-Tenant Data Sync & Analytics Dashboard

A multi-tenant platform for syncing **Shopify Products, Orders, Customers, and Events** and visualizing analytics through a React dashboard.

This project demonstrates real-world engineering concepts such as multi-tenancy, scheduled data sync, Shopify API integration, clean ORM design, and production-grade deployment.

---

LINK - https://xeno-fde-p824-48o3i17s2-aarshjain09s-projects.vercel.app/

---

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

### 🔐 Multi-Tenant Architecture
- Each tenant stores Shopify store credentials
- All synced data contains a `tenantId` for isolation
- Clean relational schema using Sequelize models

---

### 🔄 Automated Shopify Data Sync
Supports syncing:
- Products
- Customers
- Orders
- Order Items
- Events (cart abandonment, checkout started)

Sync methods:
- **Manual Sync** → `/sync/shopify`
- **Automatic Sync** → via node-cron

---

### 📊 Analytics Dashboard
- Revenue metrics
- Total orders
- Customers
- Date-wise analytics
- Top customers
- Product performance

---

## 🏗 High-Level Architecture Diagram
<img width="998" height="964" alt="xeno_architecture" src="https://github.com/user-attachments/assets/c8fbdaa7-a8dd-40c7-b113-6ea115232193" />


---

## 📂 Project Structure

```
/server
  /src
    /config/db.js
    /models/*.js
    /routes/*.js
    /services/shopifySync.js
    index.js
    cron.js

/frontend
  /src
    /pages
    /services/api.js
    /styles
```

---

# 🗄 Database Schema (Accurate to Code)

## **Tenants**
| field | type |
|-------|------|
| id | INTEGER |
| name | STRING |
| email | STRING (unique) |
| password | STRING |

---

## **Shopify Stores**
| field | type |
|-------|------|
| id | INTEGER |
| tenantId | INTEGER |
| storeDomain | STRING |
| accessToken | STRING |

---

## **Customers**
| field | type |
|-------|------|
| id | INTEGER |
| tenantId | INTEGER |
| shopifyCustomerId | BIGINT |
| firstName | STRING |
| lastName | STRING |
| email | STRING |
| createdAtShopify | DATE |

---

## **Products**
| field | type |
|-------|------|
| id | INTEGER |
| tenantId | INTEGER |
| shopifyProductId | BIGINT |
| title | STRING |
| price | FLOAT |

---

## **Orders**
| field | type |
|-------|------|
| id | INTEGER |
| tenantId | INTEGER |
| shopifyOrderId | BIGINT |
| customerId | INTEGER |
| totalPrice | FLOAT |
| currency | STRING |
| createdAtShopify | DATE |

---

## **Order Items**
| field | type |
|-------|------|
| id | INTEGER |
| tenantId | INTEGER |
| orderId | INTEGER |
| productId | INTEGER |
| quantity | INTEGER |
| price | FLOAT |

---

## **Events**
| field | type |
|-------|------|
| id | INTEGER |
| tenantId | INTEGER |
| type | STRING |
| customerId | INTEGER |
| occurredAt | DATE |
| metadata | JSON |

---

# 🔗 API Endpoints

## **Auth APIs**
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/auth/register` | Register tenant |
| POST | `/auth/login` | Login tenant |

---

## **Tenant APIs**
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/tenants/store` | Add / Update Shopify Store |
| GET | `/tenants/store` | Get all stores for tenant |

---

## **Sync APIs**
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/sync/shopify` | Trigger manual sync |

---

## **Metrics APIs**
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/metrics/summary` | Total revenue, orders, customers |
| GET | `/metrics/orders-by-date` | Date-wise order analytics |
| GET | `/metrics/top-customers` | Top 5 customers |

---

## **Debug APIs**
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/debug/shopify/customers` | Test Shopify customer fetch |

---

## 🚀 Local Development

### Backend
```
cd backend
npm install
npm run dev
```

### Frontend
```
cd frontend
npm install
npm start
```

---

## 🌐 Deployment

### Render (Backend)
- Add DB credentials
- Start command: `npm start`

### Vercel (Frontend)
- Set REACT_APP_API_BASE_URL

---

## ⚠ Known Limitations
- OAuth not implemented
- No Shopify webhook ingestion
- Basic JWT auth (no roles)

---

