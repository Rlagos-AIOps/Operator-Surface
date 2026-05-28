import puppeteer from "puppeteer-core";

const CHROME = "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome";
const OUT = "/Users/ak/a-r-capstone/design-board/public/components";
const BASE = "http://localhost:3000";
const wait = (ms) => new Promise((r) => setTimeout(r, ms));

const browser = await puppeteer.launch({
  executablePath: CHROME,
  headless: true,
  args: ["--no-sandbox", "--disable-setuid-sandbox", "--force-color-profile=srgb"],
});
const page = await browser.newPage();
await page.setViewport({ width: 1320, height: 880, deviceScaleFactor: 2 });

// Full operator surface
await page.goto(`${BASE}/`, { waitUntil: "networkidle0" });
await wait(700);
await page.screenshot({ path: `${OUT}/operator-surface.png` });
console.log("captured operator-surface");

// Isolated components
await page.goto(`${BASE}/capture`, { waitUntil: "networkidle0" });
await wait(700);
const ids = [
  "cap-sidebar",
  "cap-topbar",
  "cap-metrics",
  "cap-queue",
  "cap-thread",
  "cap-composer",
  "cap-bubbles",
  "cap-chips",
];
for (const id of ids) {
  const el = await page.$("#" + id);
  if (!el) {
    console.log("MISSING " + id);
    continue;
  }
  await el.screenshot({ path: `${OUT}/${id.replace("cap-", "")}.png` });
  console.log("captured " + id);
}
await browser.close();
console.log("DONE");
