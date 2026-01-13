const express = require("express");
const crypto = require("crypto");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

mongoose.connect("mongodb://127.0.0.1/getkey");

const KeySchema = new mongoose.Schema({
  fingerprint: String,
  key: String,
  expire: Number,
  used: Boolean
});

const KeyModel = mongoose.model("keys", KeySchema);

function generateKey() {
  return "KEY-" + crypto.randomBytes(6).toString("hex").toUpperCase();
}

app.post("/get-key", async (req, res) => {
  const { fingerprint } = req.body;
  const now = Date.now();

  let data = await KeyModel.findOne({ fingerprint });

  // Jika key masih aktif → kirim ulang
  if (data && data.expire > now) {
    return res.json({
      key: data.key,
      expire: data.expire,
      status: "EXISTING"
    });
  }

  // Generate 100 key acak tiap verifikasi
  const newKey = generateKey();
  const expire = now + (24 * 60 * 60 * 1000);

  if (data) {
    data.key = newKey;
    data.expire = expire;
    data.used = false;
    await data.save();
  } else {
    await KeyModel.create({
      fingerprint,
      key: newKey,
      expire,
      used: false
    });
  }

  res.json({
    key: newKey,
    expire,
    status: "NEW"
  });
});

app.listen(3000, () => {
  console.log("SERVER RUNNING ON PORT 3000");
});
