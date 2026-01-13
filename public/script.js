async function getKey() {
  const res = await fetch("/generate");
  const data = await res.json();
  document.getElementById("result").innerText =
    "Your Key: " + data.key;
}
