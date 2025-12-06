import express from "express";
import { authMiddleware } from "../middleware/auth.js";
import { ShopifyStore } from "../models/index.js";
import { fetchCustomers } from "../services/shopifyservices.js";

const router = express.Router();

// GET /debug/shopify/customers
router.get("/shopify/customers", authMiddleware, async (req, res) => {
  const tenantId = req.tenantId;

  try {
    const store = await ShopifyStore.findOne({ where: { tenantId } });
    if (!store) {
      return res.status(400).json({ message: "No Shopify store configured" });
    }

    const customers = await fetchCustomers(store.storeDomain, store.accessToken);

    res.json({
      count: customers.length,
      sample: customers[0] || null,
    });
  } catch (err) {
    console.error("Error in debug /shopify/customers:", err.response?.data || err.message);
    res.status(500).json({ message: "Error fetching customers from Shopify" });
  }
});

export default router;
