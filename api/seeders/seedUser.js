import bcrypt from "bcrypt";
import { db } from "../db/database.js";

const password = await bcrypt.hash("password123", 10);

await db.run(
  "INSERT OR IGNORE INTO users (email, password) VALUES (?, ?)",
  ["test@example.com", password]
);

console.log("User seeded successfully");
process.exit();
