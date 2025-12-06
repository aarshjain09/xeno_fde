import { DataTypes } from "sequelize";
import { sequelize } from "../config/db.js";

export const ShopifyStore = sequelize.define("ShopifyStore", {
  id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  tenantId: { type: DataTypes.INTEGER, allowNull: false },
  storeDomain: { type: DataTypes.STRING, allowNull: false },
  accessToken: { type: DataTypes.STRING, allowNull: false }
}, {
  tableName: "shopify_stores",
  timestamps: true,
  indexes: [
    { unique: true, fields: ["tenantId", "storeDomain"] }
  ]
});
