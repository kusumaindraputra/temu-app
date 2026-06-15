import { chromium } from "playwright";
import { mkdirSync } from "fs";

const BASE = "http://localhost:3000";
const OUT = "/tmp/temu-verify";
mkdirSync(OUT, { recursive: true });

const errors = [];
const browser = await chromium.launch({ headless: true });

async function buatPage() {
  const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const page = await ctx.newPage();
  page.on("console", (msg) => {
    if (msg.type() === "error") errors.push(`[console error] ${msg.text()}`);
  });
  page.on("pageerror", (err) => errors.push(`[page error] ${err.message}`));
  return { page, ctx };
}

async function shot(page, name) {
  await page.screenshot({ path: `${OUT}/${name}.png`, fullPage: false });
  console.log(`  📸 ${name}.png`);
}

async function cekError(page, label) {
  // Cek Next.js error overlay
  const overlay = await page.$("nextjs-portal");
  if (overlay) {
    const teks = await overlay.textContent().catch(() => "");
    if (teks && teks.includes("Error")) {
      errors.push(`[${label}] Next.js error overlay muncul: ${teks.slice(0, 200)}`);
      return true;
    }
  }
  // Cek teks error generik di body
  const body = await page.textContent("body").catch(() => "");
  if (body.includes("Application error") || body.includes("Runtime Error")) {
    errors.push(`[${label}] Runtime error terdeteksi di halaman`);
    return true;
  }
  return false;
}

async function goto(page, url, label) {
  await page.goto(`${BASE}${url}`, { waitUntil: "networkidle", timeout: 15000 });
  const adaError = await cekError(page, label);
  console.log(`  ${adaError ? "❌" : "✅"} ${label} → ${page.url().replace(BASE, "")}`);
  return !adaError;
}

// ── 1. Halaman Login ──────────────────────────────────────────
console.log("\n=== LOGIN PAGE ===");
const { page: p1, ctx: ctx1 } = await buatPage();
await goto(p1, "/login", "Halaman login");
await shot(p1, "01-login");
await ctx1.close();

// ── 2. Sesi Bidang (kesmas) ───────────────────────────────────
console.log("\n=== BIDANG (kesmas) ===");
const { page: p2, ctx: ctx2 } = await buatPage();
await p2.goto(`${BASE}/login`, { waitUntil: "networkidle" });
await p2.fill('input[name="username"]', "kesmas");
await p2.fill('input[name="password"]', "bidang123");
await p2.click('button[type="submit"]');
await p2.waitForURL(/\/bidang/, { timeout: 10000 }).catch(() => {});

await goto(p2, "/bidang", "Dashboard bidang");
await shot(p2, "02-bidang-dashboard");

await goto(p2, "/bidang/notifikasi", "Notifikasi bidang");
await shot(p2, "03-bidang-notifikasi");

await goto(p2, "/bidang/booking/baru", "Booking baru");
await shot(p2, "04-bidang-booking-baru");

await ctx2.close();

// ── 3. Sesi Pengelola ─────────────────────────────────────────
console.log("\n=== PENGELOLA ===");
const { page: p3, ctx: ctx3 } = await buatPage();
await p3.goto(`${BASE}/login`, { waitUntil: "networkidle" });
// pengelola (role PENGELOLA) — akses dashboard & riwayat
await p3.fill('input[name="username"]', "pengelola");
await p3.fill('input[name="password"]', "pengelola123");
await p3.click('button[type="submit"]');
await p3.waitForURL(/\/pengelola/, { timeout: 10000 }).catch(() => {});

await goto(p3, "/pengelola", "Dashboard pengelola");
await shot(p3, "06-pengelola-dashboard");

await goto(p3, "/pengelola/riwayat", "Riwayat pengelola");
await shot(p3, "07-pengelola-riwayat");
await ctx3.close();

// admin (role ADMIN) — akses ruangan & akun
console.log("\n=== ADMIN ===");
const { page: p4, ctx: ctx4 } = await buatPage();
await p4.goto(`${BASE}/login`, { waitUntil: "networkidle" });
await p4.fill('input[name="username"]', "admin");
await p4.fill('input[name="password"]', "admin123");
await p4.click('button[type="submit"]');
await p4.waitForURL(/\/pengelola/, { timeout: 10000 }).catch(() => {});

await goto(p4, "/pengelola/ruangan", "Halaman ruangan (admin)");
await shot(p4, "08-pengelola-ruangan");

await goto(p4, "/pengelola/akun", "Halaman akun (admin)");
await shot(p4, "09-pengelola-akun");
await ctx4.close();

// ── Ringkasan ─────────────────────────────────────────────────
await browser.close();

console.log("\n=== HASIL ===");
if (errors.length === 0) {
  console.log("✅ Semua halaman OK — tidak ada error");
} else {
  console.log(`❌ ${errors.length} error ditemukan:`);
  errors.forEach((e) => console.log(" •", e));
}
console.log(`\nScreenshots: ${OUT}/`);
