import { sequelize } from "../config/db.js";
import { Tenant } from "./tenant.js";
import { ShopifyStore } from "./shopifystore.js";
import { Customer } from "./customer.js";
import { Product } from "./product.js";
import { Order } from "./order.js";
import { OrderItem } from "./orderitem.js";
import { Event } from "./events.js";

// Associations
Tenant.hasMany(ShopifyStore, { foreignKey: "tenantId" });
ShopifyStore.belongsTo(Tenant, { foreignKey: "tenantId" });

Tenant.hasMany(Customer, { foreignKey: "tenantId" });
Customer.belongsTo(Tenant, { foreignKey: "tenantId" });

Tenant.hasMany(Product, { foreignKey: "tenantId" });
Product.belongsTo(Tenant, { foreignKey: "tenantId" });

Tenant.hasMany(Order, { foreignKey: "tenantId" });
Order.belongsTo(Tenant, { foreignKey: "tenantId" });

Customer.hasMany(Order, { foreignKey: "customerId" });
Order.belongsTo(Customer, { foreignKey: "customerId" });

Tenant.hasMany(OrderItem, { foreignKey: "tenantId" });
OrderItem.belongsTo(Tenant, { foreignKey: "tenantId" });

Order.hasMany(OrderItem, { foreignKey: "orderId" });
OrderItem.belongsTo(Order, { foreignKey: "orderId" });

Product.hasMany(OrderItem, { foreignKey: "productId" });
OrderItem.belongsTo(Product, { foreignKey: "productId" });

Tenant.hasMany(Event, { foreignKey: "tenantId" });
Event.belongsTo(Tenant, { foreignKey: "tenantId" });

Customer.hasMany(Event, { foreignKey: "customerId" });
Event.belongsTo(Customer, { foreignKey: "customerId" });

export {
  sequelize,
  Tenant,
  ShopifyStore,
  Customer,
  Product,
  Order,
  OrderItem,
  Event
};
