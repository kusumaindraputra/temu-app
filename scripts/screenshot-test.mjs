import { chromium } from "playwright";
import { mkdirSync } from "fs";

const BASE = "http://localhost:3100";
const OUT = "/tmp/temu-shots";
mkdirSync(OUT, { recursive: true });

const browser = await chromium.launch({ headless: true });
const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } });
const page = await ctx.newPage();

const shot = async (name) => {
  const p = `${OUT}/${name}.png`;
  await page.screenshot({ path: p });
  console.log(`✓ ${name}.png`);
  return p;
};

// Login page
await page.goto(`${BASE}/login`);
await page.waitForLoadState("networkidle");
await shot("01-login");

// Login as pengelola/admin
await page.fill('input[name="username"]', "pengelola");
await page.fill('input[name="password"]', "pengelola123");
await page.click('button[type="submit"]');
await page.waitForTimeout(3000);
await shot("02-pengelola-dashboard");

// Login as bidang
await ctx.clearCookies();
await page.goto(`${BASE}/login`);
await page.waitForLoadState("networkidle");
await page.fill('input[name="username"]', "kesmas");
await page.fill('input[name="password"]', "bidang123");
await page.click('button[type="submit"]');
await page.waitForTimeout(3000);
await shot("03-bidang-dashboard");

await browser.close();
console.log("Done");
