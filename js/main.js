// ----- util -----
const $ = (q, ctx=document) => ctx.querySelector(q);

// Set current year
$("#year").textContent = new Date().getFullYear();

// Optional: allow CA & DEX to be injected via URL params after launch
// Example: https://auraween.xyz/?ca=So1AnAcA...&dex=https://raydium.io/swap/?input=...
const params = new URLSearchParams(location.search);
const CA = params.get("ca") || "";           // fill later OR via query param
const DEX = params.get("dex") || "";         // fill later OR via query param
const LAUNCH_AT = $("#countdown").dataset.launch || ""; // set yyyy-mm-ddThh:mm:ssZ once known

// Wire contract UI
const caBox = $("#caBox");
const caCode = $("#contractAddress");
const copyBtn = $("#copyCA");
if (CA) {
  caCode.textContent = CA;
  caBox.classList.remove("hidden");
  copyBtn.addEventListener("click", async () => {
    try { await navigator.clipboard.writeText(CA); copyBtn.textContent = "Copied!"; }
    catch { copyBtn.textContent = "Copy failed"; }
    setTimeout(()=>copyBtn.textContent="Copy", 1500);
  });
}

// Wire DEX link when ready
const dexLink = $("#dexLink");
if (DEX) {
  dexLink.classList.remove("disabled");
  dexLink.removeAttribute("aria-disabled");
  dexLink.textContent = "Trade on DEX";
  dexLink.href = DEX;
  dexLink.target = "_blank";
  dexLink.rel = "noopener";
}

// Countdown (shows “Soon” until LAUNCH_AT set)
const countdownEl = $("#countdown");
if (LAUNCH_AT) {
  const launchTime = new Date(LAUNCH_AT).getTime();
  const tick = () => {
    const now = Date.now();
    const diff = launchTime - now;
    if (diff <= 0) { countdownEl.textContent = "LIVE!"; clearInterval(timer); return; }
    const d = Math.floor(diff / (1000*60*60*24));
    const h = Math.floor((diff / (1000*60*60)) % 24);
    const m = Math.floor((diff / (1000*60)) % 60);
    const s = Math.floor((diff / 1000) % 60);
    countdownEl.textContent = `${d}d ${String(h).padStart(2,"0")}h ${String(m).padStart(2,"0")}m ${String(s).padStart(2,"0")}s`;
  };
  tick();
  const timer = setInterval(tick, 1000);
} else {
  countdownEl.textContent = "Launch: soon";
}
