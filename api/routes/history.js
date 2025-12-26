import express from "express";
import { db } from "../db/database.js";
import jwt from "jsonwebtoken";

const router = express.Router();

// Middleware to authenticate token
const auth = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) return res.status(401).json({ message: "Unauthorized" });

  const token = authHeader.split(" ")[1];
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || "secret");
    req.user = decoded;
    next();
  } catch {
    return res.status(401).json({ message: "Invalid token" });
  }
};

// Get user's history (latest first)
router.get("/", auth, async (req, res) => {
  const userId = req.user.id;
  const rows = await db.all(
    "SELECT id, ip FROM history WHERE user_id = ? ORDER BY id DESC",
    [userId]
  );
  res.json(rows);
});

// Add new IP to history
router.post("/", auth, async (req, res) => {
  const userId = req.user.id;
  const { ip } = req.body;

  if (!ip) return res.status(400).json({ message: "IP is required" });

  await db.run("INSERT INTO history (ip, user_id) VALUES (?, ?)", [ip, userId]);
  res.json({ message: "IP added to history" });
});

// Delete multiple IPs
router.delete("/", auth, async (req, res) => {
  const userId = req.user.id;
  const { ids } = req.body; // array of history IDs to delete

  if (!Array.isArray(ids)) return res.status(400).json({ message: "Invalid request" });

  const placeholders = ids.map(() => "?").join(",");
  await db.run(
    `DELETE FROM history WHERE id IN (${placeholders}) AND user_id = ?`,
    [...ids, userId]
  );

  res.json({ message: "Selected history deleted" });
});

export default router;