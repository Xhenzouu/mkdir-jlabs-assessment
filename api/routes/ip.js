import express from "express";

const router = express.Router();

// Logged-in user's IP
router.get("/ip", async (req, res) => {
  try {
    const response = await fetch("https://ipinfo.io/geo");
    if (!response.ok) {
      return res.status(400).json({ message: "Unable to fetch IP geolocation" });
    }

    const data = await response.json();
    res.json(data);
  } catch {
    res.status(500).json({ message: "Failed to fetch geolocation" });
  }
});

// Specific IP
router.get("/ip/:ip", async (req, res) => {
  try {
    const { ip } = req.params;
    const response = await fetch(`https://ipinfo.io/${ip}/geo`);
    if (!response.ok) {
      return res.status(400).json({ message: "Unable to fetch IP geolocation" });
    }

    const data = await response.json();
    res.json(data);
  } catch {
    res.status(500).json({ message: "Failed to fetch geolocation" });
  }
});

export default router;