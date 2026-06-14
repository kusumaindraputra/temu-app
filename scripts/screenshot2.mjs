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

const shot = async (name) => {
  await page.screenshot({ path: path.join(OUT, `${name}.png`) });
  console.log(`✓ ${name}.png`);
};

// Login pengelola
await page.goto(`${BASE}/login`);
await page.waitForLoadState("networkidle");
await page.fill('input[name="username"]', "pengelola");
await page.fill('input[name="password"]', "pengelola123");
await page.click('button[type="submit"]');
await page.waitForURL(`${BASE}/pengelola**`, { timeout: 8000 });
await page.waitForLoadState("networkidle");
await shot("new-01-pengelola-dashboard");

// Login bidang
await ctx.clearCookies();
await page.goto(`${BASE}/login`);
await page.waitForLoadState("networkidle");
await page.fill('input[name="username"]', "kesmas");
await page.fill('input[name="password"]', "bidang123");
await page.click('button[type="submit"]');
await page.waitForURL(`${BASE}/bidang**`, { timeout: 8000 });
await page.waitForLoadState("networkidle");
await shot("new-02-bidang-dashboard");

// Scroll down to show jadwal
await page.evaluate(() => window.scrollTo(0, 600));
await page.waitForTimeout(300);
await shot("new-03-bidang-jadwal-below");

await browser.close();
console.log("\nDone.");
