import express from "express";
import { authMiddleware } from "../middleware/auth.js";
import { Customer, Order, sequelize } from "../models/index.js";

const router = express.Router();

// GET /metrics/summary
router.get("/summary", authMiddleware, async (req, res) => {
  const tenantId = req.tenantId;
  try {
    const [totalCustomers, totalOrders, revenue] = await Promise.all([
      Customer.count({ where: { tenantId } }),
      Order.count({ where: { tenantId } }),
      Order.sum("totalPrice", { where: { tenantId } })
    ]);

    res.json({
      totalCustomers,
      totalOrders,
      totalRevenue: revenue || 0
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error fetching summary" });
  }
});

// GET /metrics/orders-by-date?from=YYYY-MM-DD&to=YYYY-MM-DD
router.get("/orders-by-date", authMiddleware, async (req, res) => {
  const tenantId = req.tenantId;
  const { from, to } = req.query;

  try {
    const fromDate = from ? new Date(from) : new Date("2000-01-01");
    const toDate = to ? new Date(to) : new Date();

    const [rows] = await sequelize.query(
      `
      SELECT DATE(createdAtShopify) AS date,
             COUNT(*) AS orders,
             SUM(totalPrice) AS revenue
      FROM orders
      WHERE tenantId = :tenantId
        AND createdAtShopify BETWEEN :fromDate AND :toDate
      GROUP BY DATE(createdAtShopify)
      ORDER BY DATE(createdAtShopify)
      `,
      {
        replacements: {
          tenantId,
          fromDate,
          toDate
        }
      }
    );

    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error fetching orders by date" });
  }
});

// GET /metrics/top-customers
router.get("/top-customers", authMiddleware, async (req, res) => {
  const tenantId = req.tenantId;

  try {
    const [rows] = await sequelize.query(
      `
      SELECT
        c.id,
        c.shopifyCustomerId,
        -- "name" will be email if present, otherwise Shopify customer ID as text
        COALESCE(
          c.email,
          CAST(c.shopifyCustomerId AS CHAR)
        ) AS name,
        c.email,
        SUM(o.totalPrice) AS totalSpend
      FROM customers c
      JOIN orders o ON o.customerId = c.id
      WHERE c.tenantId = :tenantId
      GROUP BY c.id, c.shopifyCustomerId, c.email
      ORDER BY totalSpend DESC
      LIMIT 5
      `,
      { replacements: { tenantId } }
    );

    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error fetching top customers" });
  }
});

export default router;
