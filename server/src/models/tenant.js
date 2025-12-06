import { DataTypes } from "sequelize";
import { sequelize } from "../config/db.js";

export const Tenant = sequelize.define("Tenant", {
  id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  name: { type: DataTypes.STRING, allowNull: false },
  email: { type: DataTypes.STRING, unique: true, allowNull: false },
  password: { type: DataTypes.STRING, allowNull: false }
}, {
  tableName: "tenants",
  timestamps: true
});
