import puppeteer from "puppeteer-core";

const CHROME = "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome";
const URL = process.argv[2] || "https://operator-surface-board.akhaus.workers.dev";
const wait = (ms) => new Promise((r) => setTimeout(r, ms));

const browser = await puppeteer.launch({
  executablePath: CHROME,
  headless: true,
  args: ["--no-sandbox", "--disable-setuid-sandbox"],
});
const p = await browser.newPage();
await p.goto(URL, { waitUntil: "networkidle0" });
await wait(5000);
const before = await p.evaluate(() => window.editor.getCurrentPageShapes().length);
// The seed has no geo shapes — any geo is a leftover test artifact.
const deleted = await p.evaluate(() => {
  const geos = window.editor.getCurrentPageShapes().filter((s) => s.type === "geo");
  window.editor.deleteShapes(geos.map((s) => s.id));
  return geos.length;
});
await wait(3500); // let the deletion sync to the room DO
const after = await p.evaluate(() => window.editor.getCurrentPageShapes().length);
await browser.close();
console.log(JSON.stringify({ before, deleted, after }));
