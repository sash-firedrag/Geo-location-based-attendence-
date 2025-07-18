// server.js (Updated with Punch Out support)
const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cors = require("cors");

const app = express();
const PORT = 3000;

mongoose.connect("mongodb://127.0.0.1:27017/location-attendance", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const PunchSchema = new mongoose.Schema({
  username: String,
  punchInTime: Date,
  punchOutTime: Date,
  location: {
    lat: Number,
    lon: Number,
  },
});

const Punch = mongoose.model("Punch", PunchSchema);

app.use(cors());
app.use(bodyParser.json());

const OFFICE_LAT = 11.3413282;
const OFFICE_LON = 77.6869517;
const GEOFENCE_RADIUS_METERS = 100;

function getDistance(lat1, lon1, lat2, lon2) {
  const R = 6371e3;
  const toRad = (deg) => (deg * Math.PI) / 180;
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) *
      Math.cos(toRad(lat2)) *
      Math.sin(dLon / 2) ** 2;
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

// Punch In API
app.post("/api/punch-in", async (req, res) => {
  const { username, lat, lon } = req.body;
  const distance = getDistance(lat, lon, OFFICE_LAT, OFFICE_LON);
  if (distance > GEOFENCE_RADIUS_METERS) {
    return res.status(403).json({ message: "Outside geofence area" });
  }

  const punch = new Punch({
    username,
    punchInTime: new Date(),
    location: { lat, lon },
  });

  await punch.save();
  res.json({ message: "Punch In successful" });
});

// Punch Out API
app.post("/api/punch-out", async (req, res) => {
  const { username, lat, lon } = req.body;
  const distance = getDistance(lat, lon, OFFICE_LAT, OFFICE_LON);
  if (distance > GEOFENCE_RADIUS_METERS) {
    return res.status(403).json({ message: "Outside geofence area" });
  }

  const latest = await Punch.findOne({ username, punchOutTime: null }).sort({ punchInTime: -1 });
  if (!latest) {
    return res.status(400).json({ message: "No active punch-in found" });
  }

  latest.punchOutTime = new Date();
  await latest.save();

  res.json({ message: "Punch Out successful" });
});

// Get all punches
app.get("/api/punches", async (req, res) => {
  const data = await Punch.find().sort({ punchInTime: -1 });
  res.json(data);
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
