import { DataTypes } from "sequelize";
import { sequelize } from "../config/db.js";

export const Product = sequelize.define("Product", {
  id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  tenantId: { type: DataTypes.INTEGER, allowNull: false },
  shopifyProductId: { type: DataTypes.BIGINT, allowNull: false },
  title: { type: DataTypes.STRING, allowNull: false },
  price: { type: DataTypes.FLOAT, defaultValue: 0 },
}, {
  tableName: "products",
  timestamps: true,
  indexes: [
    { unique: true, fields: ["tenantId", "shopifyProductId"] }
  ]
});
