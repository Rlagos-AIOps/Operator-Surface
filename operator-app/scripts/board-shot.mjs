import puppeteer from "puppeteer-core";

const CHROME = "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome";
const URL = process.argv[2] || "http://localhost:5173";
const OUT = process.argv[3] || "/tmp/board-local.png";
const wait = (ms) => new Promise((r) => setTimeout(r, ms));

const browser = await puppeteer.launch({
  executablePath: CHROME,
  headless: true,
  args: ["--no-sandbox", "--disable-setuid-sandbox"],
});
const page = await browser.newPage();
await page.setViewport({ width: 1600, height: 1000, deviceScaleFactor: 1 });
await page.goto(URL, { waitUntil: "networkidle0" });
await wait(1800);
const info = await page.evaluate(() => {
  const ed = window.editor;
  if (!ed) return { ok: false };
  ed.zoomToFit();
  const s = ed.getCurrentPageShapes();
  return { ok: true, total: s.length, images: s.filter((x) => x.type === "image").length };
});
await wait(1500);
await page.screenshot({ path: OUT });
await browser.close();
console.log(JSON.stringify(info), "->", OUT);
