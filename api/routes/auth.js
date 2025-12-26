import express from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { db } from "../db/database.js";

const router = express.Router();

router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  const user = await db.get("SELECT * FROM users WHERE email = ?", [email]);
  if (!user) return res.status(401).json({ message: "Invalid credentials" });

  const valid = await bcrypt.compare(password, user.password);
  if (!valid) return res.status(401).json({ message: "Invalid credentials" });

  const token = jwt.sign(
    { id: user.id, email: user.email },
    process.env.JWT_SECRET || "secret",
    { expiresIn: "1d" }
  );

  res.json({ token });
});

export default router;
