import express from "express";
import { ShopifyStore } from "../models/index.js";
import { authMiddleware } from "../middleware/auth.js";

const router = express.Router();

// POST /tenants/store
router.post("/store", authMiddleware, async (req, res) => {
  try {
    const tenantId = req.tenantId;
    const { storeDomain, accessToken } = req.body;

    if (!storeDomain || !accessToken) {
      return res.status(400).json({ message: "Missing storeDomain or accessToken" });
    }

    const [store, created] = await ShopifyStore.findOrCreate({
      where: { tenantId, storeDomain },
      defaults: { tenantId, storeDomain, accessToken }
    });

    if (!created) {
      store.accessToken = accessToken;
      await store.save();
    }

    res.json({ store });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

// GET /tenants/store
router.get("/store", authMiddleware, async (req, res) => {
  try {
    const tenantId = req.tenantId;
    const stores = await ShopifyStore.findAll({ where: { tenantId } });
    res.json({ stores });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

export default router;
