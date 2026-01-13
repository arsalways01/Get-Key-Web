const verifyBtn = document.getElementById("verifyBtn");
const countdownEl = document.getElementById("countdown");
const statusEl = document.getElementById("status");
const keyBox = document.getElementById("keyBox");
const keyText = document.getElementById("keyText");
const copyBtn = document.getElementById("copyBtn");
const expireText = document.getElementById("expireText");

const DEVICE_ID = btoa(navigator.userAgent + screen.width + screen.height);

function generateKey() {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let key = "KEY-";
  for (let i = 0; i < 12; i++) {
    key += chars[Math.floor(Math.random() * chars.length)];
  }
  return key;
}

function startVerification() {
  let time = 10;
  verifyBtn.disabled = true;

  const interval = setInterval(() => {
    countdownEl.innerText = `Verifikasi: ${time}s`;
    time--;

    if (time < 0) {
      clearInterval(interval);
      countdownEl.innerText = "SUCCESS";
      statusEl.innerText = "Loading...";
      setTimeout(showKey, 1500);
    }
  }, 1000);
}

function showKey() {
  let data = JSON.parse(localStorage.getItem("keyData"));

  if (data && data.device === DEVICE_ID && Date.now() < data.expire) {
    displayKey(data.key, data.expire);
    return;
  }

  const newKey = generateKey();
  const expire = Date.now() + (24 * 60 * 60 * 1000);

  const keyData = {
    device: DEVICE_ID,
    key: newKey,
    expire: expire,
    randomAfter: Date.now() + (10 * 60 * 1000)
  };

  localStorage.setItem("keyData", JSON.stringify(keyData));
  displayKey(newKey, expire);
}

function displayKey(key, expire) {
  keyText.innerText = key;
  keyBox.classList.remove("hidden");

  updateExpire(expire);

  setInterval(() => {
    const data = JSON.parse(localStorage.getItem("keyData"));
    if (Date.now() > data.randomAfter) {
      data.key = generateKey();
      localStorage.setItem("keyData", JSON.stringify(data));
      keyText.innerText = data.key;
    }
  }, 1000);
}

function updateExpire(expire) {
  setInterval(() => {
    let diff = expire - Date.now();
    if (diff <= 0) {
      expireText.innerText = "Key Expired";
      localStorage.removeItem("keyData");
      verifyBtn.disabled = false;
      return;
    }

    let h = Math.floor(diff / 3600000);
    let m = Math.floor((diff % 3600000) / 60000);
    let s = Math.floor((diff % 60000) / 1000);

    expireText.innerText = `Key aktif: ${h}j ${m}m ${s}d`;
  }, 1000);
}

copyBtn.onclick = () => {
  navigator.clipboard.writeText(keyText.innerText);
  alert("Key disalin!");
};

verifyBtn.onclick = startVerification;
