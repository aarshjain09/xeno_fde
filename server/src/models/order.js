import { DataTypes } from "sequelize";
import { sequelize } from "../config/db.js";

export const Order = sequelize.define("Order", {
  id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  tenantId: { type: DataTypes.INTEGER, allowNull: false },
  shopifyOrderId: { type: DataTypes.BIGINT, allowNull: false },
  customerId: { type: DataTypes.INTEGER, allowNull: true },
  totalPrice: { type: DataTypes.FLOAT, defaultValue: 0 },
  currency: { type: DataTypes.STRING, defaultValue: "USD" },
  createdAtShopify: { type: DataTypes.DATE, allowNull: false }
}, {
  tableName: "orders",
  timestamps: true,
  indexes: [
    { unique: true, fields: ["tenantId", "shopifyOrderId"] }
  ]
});
