import { DataTypes } from "sequelize";
import { sequelize } from "../config/db.js";

export const Event = sequelize.define("Event", {
  id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  tenantId: { type: DataTypes.INTEGER, allowNull: false },
  type: { type: DataTypes.STRING, allowNull: false }, // cart_abandoned, checkout_started
  customerId: { type: DataTypes.INTEGER },
  occurredAt: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
  metadata: { type: DataTypes.JSON }
}, {
  tableName: "events",
  timestamps: true
});
