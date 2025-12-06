import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import cron from "node-cron";

import debugShopifyRoutes from "./routes/debug.js";
import { runShopifySyncForTenant } from "./routes/sync.js";

import { connectDB } from "./config/db.js";
import { sequelize, Tenant } from "./models/index.js";

import authRoutes from "./routes/auth.js";
import tenantRoutes from "./routes/tenant.js";
import syncRoutes from "./routes/sync.js";
import metricsRoutes from "./routes/metrics.js";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

app.get("/health", (req, res) => {
  res.json({ status: "ok" });
});

app.use("/auth", authRoutes);
app.use("/tenants", tenantRoutes);
app.use("/sync", syncRoutes);
app.use("/metrics", metricsRoutes);
app.use("/debug", debugShopifyRoutes);

const start = async () => {
  await connectDB();
  await sequelize.sync(); // in dev; later use migrations

  const port = process.env.PORT || 4000;
  app.listen(port, () => console.log(`🚀 Server running on port ${port}`));

  // 🔁 Scheduler for ALL tenants — every 30 minutes
  cron.schedule("*/1 * * * *", async () => {
    try {
      console.log("⏰ Starting scheduled Shopify sync for ALL tenants");

      const tenants = await Tenant.findAll({
        attributes: ["id"],
      });

      for (const tenant of tenants) {
        console.log(`🔄 Syncing tenant ${tenant.id}`);
        await runShopifySyncForTenant(tenant.id);
      }

      console.log("✅ Scheduled sync for ALL tenants completed");
    } catch (err) {
      console.error("❌ Scheduled sync failed:", err.message);
    }
  });
};

start();
