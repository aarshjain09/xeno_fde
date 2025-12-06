import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import { Tenant } from "../models/index.js";

dotenv.config();
const router = express.Router();

// POST /auth/register
router.post("/register", async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password)
      return res.status(400).json({ message: "Missing fields" });

    const existing = await Tenant.findOne({ where: { email } });
    if (existing)
      return res.status(400).json({ message: "Email already in use" });

    const hashed = await bcrypt.hash(password, 10);

    const tenant = await Tenant.create({ name, email, password: hashed });

    const token = jwt.sign({ tenantId: tenant.id }, process.env.JWT_SECRET, {
      expiresIn: "7d"
    });

    res.json({
      token,
      tenant: { id: tenant.id, name: tenant.name, email: tenant.email }
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

// POST /auth/login
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const tenant = await Tenant.findOne({ where: { email } });
    if (!tenant)
      return res.status(401).json({ message: "Invalid credentials" });

    const valid = await bcrypt.compare(password, tenant.password);
    if (!valid)
      return res.status(401).json({ message: "Invalid credentials" });

    const token = jwt.sign({ tenantId: tenant.id }, process.env.JWT_SECRET, {
      expiresIn: "7d"
    });

    res.json({
      token,
      tenant: { id: tenant.id, name: tenant.name, email: tenant.email }
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

export default router;
