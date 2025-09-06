// ===== Auraween main =====
document.addEventListener("DOMContentLoaded", () => {
  // helper
  const $  = (q, ctx = document) => ctx.querySelector(q);
  const $$ = (q, ctx = document) => Array.from(ctx.querySelectorAll(q));
  const pad = (n) => String(n).padStart(2, "0");

  // 1) Footer year
  const yearEl = $("#year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  // 2) CONFIG: set this once and both Buy buttons will use it
  // DexScreener example: https://dexscreener.com/solana/<PAIR_OR_TOKEN>
  // Raydium swap example: https://raydium.io/swap/?input=SOL&output=<CA>
  const DEX_URL = "https://dexscreener.com/solana/CUUfEvBGxErM9fUYVQn2GnrHPhzK3yJC4MyYTXjwE9JP"; // <-- paste your live DexScreener (or Raydium) URL here when ready

  // Wire all Buy buttons
  const buyLinks = $$(".js-buy");
  if (buyLinks.length) {
    if (DEX_URL) {
      buyLinks.forEach(a => {
        a.href = DEX_URL;
        a.target = "_blank";
        a.rel = "noopener";
        a.classList.remove("disabled");
        a.removeAttribute("aria-disabled");
        a.title = "Buy $AURAWEEN";
      });
    } else {
      // Keep buttons active-looking but harmless until you paste DEX_URL
      buyLinks.forEach(a => {
        a.href = "#buy";
        a.removeAttribute("target");
        a.removeAttribute("rel");
        a.addEventListener("click", (e) => {
          // Prevent accidental scroll jump; no "coming soon" text per your preference
          e.preventDefault();
        }, { once: true });
      });
    }
  }

  // 3) Halloween countdown (local timezone) → #halloweenCountdown
  const countdownEl = $("#halloweenCountdown");
  if (countdownEl) {
    function nextHalloweenLocal() {
      const now = new Date();
      const year = now.getFullYear();
      const halloween = new Date(year, 9, 31, 0, 0, 0, 0); // Oct=9
      return now < halloween ? halloween : new Date(year + 1, 9, 31, 0, 0, 0, 0);
    }
    const target = nextHalloweenLocal();

    function tzAbbrevFor(date) {
      try {
        const parts = Intl.DateTimeFormat(undefined, { timeZoneName: "short" }).formatToParts(date);
        return parts.find(p => p.type === "timeZoneName")?.value || "";
      } catch { return ""; }
    }

    function tick() {
      const diff = target.getTime() - Date.now();
      if (diff <= 0) {
        countdownEl.textContent = "🎃 It’s Halloween!";
        clearInterval(timer);
        return;
      }
      const d = Math.floor(diff / (1000*60*60*24));
      const h = Math.floor((diff / (1000*60*60)) % 24);
      const m = Math.floor((diff / (1000*60)) % 60);
      const s = Math.floor((diff / 1000) % 60);
      const tz = tzAbbrevFor(target);
      countdownEl.textContent = `${d}d ${pad(h)}h ${pad(m)}m ${pad(s)}s  →  Oct 31, 12:00 AM ${tz}`;
    }
    tick();
    const timer = setInterval(tick, 1000);
  }
});
