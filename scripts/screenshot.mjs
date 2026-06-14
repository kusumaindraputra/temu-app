import { chromium } from "playwright";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const OUT = path.join(__dirname, "..", "screenshots");
const BASE = "http://localhost:3100";

const browser = await chromium.launch({
  executablePath: "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe",
  headless: true,
});

const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } });
const page = await ctx.newPage();

import { mkdirSync } from "fs";
mkdirSync(OUT, { recursive: true });

async function shot(name) {
  await page.screenshot({ path: path.join(OUT, `${name}.png`), fullPage: false });
  console.log(`✓ ${name}.png`);
}

// Login page
await page.goto(`${BASE}/login`);
await page.waitForLoadState("networkidle");
await shot("01-login");

// Login as admin pengelola
await page.fill('input[name="username"]', "admin");
await page.fill('input[name="password"]', "admin123");

await page.click('button[type="submit"]');
await page.waitForURL(`${BASE}/pengelola**`, { timeout: 8000 }).catch(() => {});
await page.waitForLoadState("networkidle");
await shot("02-pengelola-dashboard");

// Kalender pengelola
await page.goto(`${BASE}/pengelola/kalender`);
await page.waitForLoadState("networkidle");
await shot("03-pengelola-kalender");

// Ruangan pengelola
await page.goto(`${BASE}/pengelola/ruangan`);
await page.waitForLoadState("networkidle");
await shot("04-pengelola-ruangan");

// Akun pengelola
await page.goto(`${BASE}/pengelola/akun`);
await page.waitForLoadState("networkidle");
await shot("05-pengelola-akun");

// Logout: clear cookies and go to login
await ctx.clearCookies();
await page.goto(`${BASE}/login`);
await page.waitForLoadState("networkidle");
await page.fill('input[name="username"]', "kesmas");
await page.fill('input[name="password"]', "bidang123");
await page.click('button[type="submit"]');
await page.waitForURL(`${BASE}/bidang**`, { timeout: 8000 });

await page.waitForLoadState("networkidle");
await shot("06-bidang-dashboard");

// Kalender bidang
await page.goto(`${BASE}/bidang/kalender`);
await page.waitForLoadState("networkidle");
await shot("07-bidang-kalender");

// Buat booking
await page.goto(`${BASE}/bidang/booking/baru`);
await page.waitForLoadState("networkidle");
await shot("08-bidang-booking-baru");

await browser.close();
console.log("\nDone — screenshots saved to ./screenshots/");
