import { chromium } from "playwright";
import path from "path";
import { fileURLToPath } from "url";
import { mkdirSync } from "fs";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const OUT = path.join(__dirname, "..", "screenshots");
const BASE = "http://localhost:3100";
mkdirSync(OUT, { recursive: true });

const browser = await chromium.launch({
  executablePath: "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe",
  headless: true,
});
const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } });
const page = await ctx.newPage();

// Login bidang
await page.goto(`${BASE}/login`);
await page.waitForLoadState("networkidle");
await page.fill('input[name="username"]', "kesmas");
await page.fill('input[name="password"]', "bidang123");
await page.click('button[type="submit"]');
await page.waitForURL(`${BASE}/bidang**`, { timeout: 8000 });
await page.waitForLoadState("networkidle");

// Full page screenshot
await page.screenshot({
  path: path.join(OUT, "full-bidang-dashboard.png"),
  fullPage: true,
});
console.log("✓ full-bidang-dashboard.png");

// Scroll ke bagian "Semua Booking"
const heading = page.getByRole("heading", { name: /Semua Booking/i });
await heading.scrollIntoViewIfNeeded();
await page.waitForTimeout(300);
await page.screenshot({ path: path.join(OUT, "jadwal-section.png") });
console.log("✓ jadwal-section.png");

await browser.close();
