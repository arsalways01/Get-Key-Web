 const result = document.getElementById("result");
const button = document.getElementById("btn");
const statusText = document.getElementById("status");

// cek saat halaman dibuka
window.onload = () => {
  const savedKey = localStorage.getItem("userKey");
  if (savedKey) {
    result.innerText = "Key kamu: " + savedKey;
    statusText.innerText = "Key sudah dibuat";
    button.disabled = true;
    button.innerText = "Key Tersimpan";
  }
};

function getKey() {
  if (localStorage.getItem("userKey")) return;

  const key = "KEY-" + Math.random().toString(36).substring(2, 10).toUpperCase();
  localStorage.setItem("userKey", key);

  result.innerText = "Key kamu: " + key;
  statusText.innerText = "Key berhasil dibuat";
  button.disabled = true;
  button.innerText = "Key Tersimpan";
}
