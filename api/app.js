import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import authRoutes from "./routes/auth.js";
import ipRoutes from "./routes/ip.js";
import historyRoutes from "./routes/history.js";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api", authRoutes);
app.use("/api", ipRoutes);
app.use("/api/history", historyRoutes);

// Fetch geo info for current IP
app.get("/api/geo", async (req, res) => {
  const token = process.env.IPINFO_TOKEN;
  const url = `https://ipinfo.io/geo?token=${token}`;

  try {
    const response = await fetch(url);
    if (!response.ok) throw new Error("Failed to fetch IP info");
    const data = await response.json();
    res.json(data);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Unable to fetch IP geolocation" });
  }
});

// Fetch geo info for specific IP
app.get("/api/geo/:ip", async (req, res) => {
  const targetIp = req.params.ip;
  const token = process.env.IPINFO_TOKEN;
  const url = `https://ipinfo.io/${targetIp}/geo?token=${token}`;

  try {
    const response = await fetch(url);
    if (!response.ok) throw new Error("Failed to fetch IP info");
    const data = await response.json();
    res.json(data);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Unable to fetch IP geolocation" });
  }
});

app.get("/", (req, res) => {
  res.json({ message: "API running" });
});

const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
  console.log(`API running on http://localhost:${PORT}`);
});