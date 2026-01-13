const express = require("express");
const fs = require("fs");
const { v4: uuidv4 } = require("uuid");
const app = express();

app.use(express.json());
app.use(express.static("public"));

const DB = "./keys.json";

// Load keys
function loadKeys() {
  if (!fs.existsSync(DB)) fs.writeFileSync(DB, "[]");
  return JSON.parse(fs.readFileSync(DB));
}

// Save keys
function saveKeys(keys) {
  fs.writeFileSync(DB, JSON.stringify(keys, null, 2));
}

// Generate key
app.get("/generate", (req, res) => {
  const keys = loadKeys();
  const newKey = uuidv4();

  keys.push({
    key: newKey,
    created_at: new Date(),
    active: true
  });

  saveKeys(keys);
  res.json({ key: newKey });
});

// Validate key
app.get("/validate", (req, res) => {
  const { key } = req.query;
  const keys = loadKeys();

  const valid = keys.find(k => k.key === key && k.active);
  res.json({ valid: !!valid });
});

app.listen(3000, () => {
  console.log("Server running at http://localhost:3000");
});
