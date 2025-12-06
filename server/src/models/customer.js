import { DataTypes } from "sequelize";
import { sequelize } from "../config/db.js";

export const Customer = sequelize.define("Customer", {
  id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  tenantId: { type: DataTypes.INTEGER, allowNull: false },
  shopifyCustomerId: { type: DataTypes.BIGINT, allowNull: false },
  firstName: DataTypes.STRING,
  lastName: DataTypes.STRING,
  email: DataTypes.STRING,
  createdAtShopify: DataTypes.DATE
}, {
  tableName: "customers",
  timestamps: true,
  indexes: [
    { unique: true, fields: ["tenantId", "shopifyCustomerId"] }
  ]
});
