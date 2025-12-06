// server/src/routes/sync.js
import express from "express";
import { authMiddleware } from "../middleware/auth.js";
import {
  ShopifyStore,
  Customer,
  Product,
  Order,
  OrderItem
} from "../models/index.js";
import {
  fetchCustomers,
  fetchProducts,
  fetchOrders
} from "../services/shopifyservices.js";

const router = express.Router();

/**
 * Core sync function that can be used
 * both by the API route and by the scheduler.
 */
export const runShopifySyncForTenant = async (tenantId) => {
  const stores = await ShopifyStore.findAll({ where: { tenantId } });
  if (!stores.length) {
    console.log(`No Shopify store configured for tenant ${tenantId}`);
    return;
  }

  for (const store of stores) {
    const { storeDomain, accessToken } = store;

    // ======================
    // 1) CUSTOMERS
    // ======================
    const customers = await fetchCustomers(storeDomain, accessToken);

    for (const c of customers) {
      // derive name from first/last name OR default_address.name
      let firstName = c.first_name || null;
      let lastName = c.last_name || null;

      if ((!firstName && !lastName) && c.default_address?.name) {
        const parts = c.default_address.name.split(" ");
        firstName = parts[0] || null;
        lastName = parts.slice(1).join(" ") || null;
      }

      const email = c.email || null;

      const [cust] = await Customer.findOrCreate({
        where: { tenantId, shopifyCustomerId: c.id },
        defaults: {
          tenantId,
          shopifyCustomerId: c.id,
          firstName,
          lastName,
          email,
          createdAtShopify: c.created_at ? new Date(c.created_at) : new Date()
        }
      });

      // update existing record if new info available
      cust.firstName = firstName || cust.firstName;
      cust.lastName = lastName || cust.lastName;
      cust.email = email || cust.email;
      await cust.save();
    }

    // ======================
    // 2) PRODUCTS
    // ======================
    const products = await fetchProducts(storeDomain, accessToken);
    for (const p of products) {
      const price =
        p.variants && p.variants.length > 0
          ? parseFloat(p.variants[0].price)
          : 0;

      const [prod] = await Product.findOrCreate({
        where: { tenantId, shopifyProductId: p.id },
        defaults: {
          tenantId,
          shopifyProductId: p.id,
          title: p.title,
          price
        }
      });

      prod.title = p.title;
      prod.price = price;
      await prod.save();
    }

    // ======================
    // 3) ORDERS
    // ======================
    const orders = await fetchOrders(storeDomain, accessToken);
    for (const o of orders) {
      const total = parseFloat(o.total_price || "0");
      const currency = o.currency || "USD";
      const createdAtShopify = o.created_at
        ? new Date(o.created_at)
        : new Date();

      // Map to customer and ensure customer row exists
      let customerId = null;
      if (o.customer?.id) {
        const oc = o.customer;

        const [cust] = await Customer.findOrCreate({
          where: { tenantId, shopifyCustomerId: oc.id },
          defaults: {
            tenantId,
            shopifyCustomerId: oc.id,
            firstName: oc.first_name || null,
            lastName: oc.last_name || null,
            email: oc.email || null,
            createdAtShopify: oc.created_at
              ? new Date(oc.created_at)
              : createdAtShopify
          }
        });

        cust.firstName = oc.first_name || cust.firstName;
        cust.lastName = oc.last_name || cust.lastName;
        cust.email = oc.email || cust.email;
        await cust.save();

        customerId = cust.id;
      }

      const [order] = await Order.findOrCreate({
        where: { tenantId, shopifyOrderId: o.id },
        defaults: {
          tenantId,
          shopifyOrderId: o.id,
          customerId,
          totalPrice: total,
          currency,
          createdAtShopify
        }
      });

      order.customerId = customerId;
      order.totalPrice = total;
      order.currency = currency;
      order.createdAtShopify = createdAtShopify;
      await order.save();

      // Clear previous items (idempotent)
      await OrderItem.destroy({ where: { tenantId, orderId: order.id } });

      const lineItems = o.line_items || [];
      for (const li of lineItems) {
        let productId = null;
        if (li.product_id) {
          const prod = await Product.findOne({
            where: { tenantId, shopifyProductId: li.product_id }
          });
          if (prod) productId = prod.id;
        }

        await OrderItem.create({
          tenantId,
          orderId: order.id,
          productId,
          quantity: li.quantity || 1,
          price: parseFloat(li.price || "0")
        });
      }
    }
  }
};

// POST /sync/shopify  (manual trigger from UI)
router.post("/shopify", authMiddleware, async (req, res) => {
  const tenantId = req.tenantId;

  try {
    await runShopifySyncForTenant(tenantId);
    res.json({ message: "Sync completed" });
  } catch (err) {
    console.error("❌ Sync failed:", err.response?.data || err.message);
    res.status(500).json({ message: "Sync failed" });
  }
});

export default router;
