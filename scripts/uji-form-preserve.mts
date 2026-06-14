import { chromium } from "playwright-core";

const CHROME = "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe";
const BASE = "http://localhost:3100";

async function main() {
  const browser = await chromium.launch({ executablePath: CHROME, headless: true });
  const page = await browser.newPage();

  // Login sebagai bidang kesmas
  await page.goto(`${BASE}/login`);
  await page.fill("#username", "kesmas");
  await page.fill("#password", "bidang123");
  await page.click('button[type=submit]');
  await page.waitForURL("**/bidang");

  // Buka form booking baru
  await page.goto(`${BASE}/bidang/booking/baru`);
  await page.selectOption("#ruanganId", { index: 1 }); // opsi pertama setelah placeholder
  await page.fill("#tujuan", "Tes preserve input");
  await page.fill("#jumlahPeserta", "7");
  // Sengaja salah: selesai sebelum mulai -> memicu error
  await page.fill("#waktuMulai", "2099-01-15T10:00");
  await page.fill("#waktuSelesai", "2099-01-15T09:00");

  console.log("SEBELUM submit:");
  console.log("  mulai =", await page.inputValue("#waktuMulai"));
  console.log("  selesai =", await page.inputValue("#waktuSelesai"));

  await page.click('button[type=submit]:has-text("Ajukan")');
  await page.waitForTimeout(2000);

  console.log("URL setelah submit:", page.url());
  const adaTujuan = await page.locator("#tujuan").count();
  console.log("#tujuan masih ada:", adaTujuan);
  const err = await page.locator("p.bg-red-50").first().textContent().catch(() => null);
  console.log("PESAN ERROR:", JSON.stringify(err));
  const body = (await page.locator("body").textContent().catch(() => "")) ?? "";
  console.log("CUPLIKAN BODY:", body.replace(/\s+/g, " ").slice(0, 300));
  await page.screenshot({ path: "scripts/setelah-submit.png" });
  if (adaTujuan === 0) {
    await browser.close();
    process.exit(3);
  }

  // Periksa nilai field SETELAH error (tidak boleh kosong)
  const tujuan = await page.inputValue("#tujuan");
  const peserta = await page.inputValue("#jumlahPeserta");
  const mulai = await page.inputValue("#waktuMulai");
  const selesai = await page.inputValue("#waktuSelesai");
  const ruangan = await page.inputValue("#ruanganId");

  const hasil = [
    ["tujuan", tujuan, "Tes preserve input"],
    ["jumlahPeserta", peserta, "7"],
    ["waktuMulai", mulai, "2099-01-15T10:00"],
    ["waktuSelesai", selesai, "2099-01-15T09:00"],
    ["ruangan terpilih", ruangan ? "ada" : "", "ada"],
  ] as const;

  let gagal = 0;
  for (const [nama, aktual, harap] of hasil) {
    const ok = aktual === harap;
    if (!ok) gagal++;
    console.log(`${ok ? "✓" : "✗"} ${nama}: "${aktual}" (harap "${harap}")`);
  }

  await browser.close();
  console.log(gagal === 0 ? "\nSEMUA TERJAGA ✔" : `\n${gagal} FIELD TER-RESET �’`);
  process.exit(gagal === 0 ? 0 : 1);
}
main().catch((e) => {
  console.error(e);
  process.exit(2);
});
