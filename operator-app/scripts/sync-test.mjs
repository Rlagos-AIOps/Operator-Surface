import puppeteer from "puppeteer-core";

const CHROME = "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome";
const URL = process.argv[2] || "https://operator-surface-board.akhaus.workers.dev";
const wait = (ms) => new Promise((r) => setTimeout(r, ms));

const browser = await puppeteer.launch({
  executablePath: CHROME,
  headless: true,
  args: ["--no-sandbox", "--disable-setuid-sandbox"],
});

// --- Client A: load, add a distinctive shape, let it sync ---
const a = await browser.newPage();
await a.goto(URL, { waitUntil: "networkidle0" });
await wait(4500);
const aCount0 = await a.evaluate(() => window.editor?.getCurrentPageShapes().length ?? -1);
await a.evaluate(() => {
  window.editor.createShape({ type: "geo", x: 5000, y: 0, props: { geo: "rectangle", w: 240, h: 120 } });
});
await wait(500);
const aCount1 = await a.evaluate(() => window.editor?.getCurrentPageShapes().length ?? -1);
await wait(3500); // allow debounced sync to persist to the room DO

// --- Client B: separate session, should already see A's shape ---
const b = await browser.newPage();
await b.goto(URL, { waitUntil: "networkidle0" });
await wait(5000);
const bCount = await b.evaluate(() => window.editor?.getCurrentPageShapes().length ?? -1);
const bSeesAShape = await b.evaluate(() =>
  window.editor.getCurrentPageShapes().some((s) => s.type === "geo" && Math.round(s.x) === 5000)
);

// --- cleanup: B deletes the test shape; should propagate back to A ---
await b.evaluate(() => {
  const s = window.editor.getCurrentPageShapes().find((x) => x.type === "geo" && Math.round(x.x) === 5000);
  if (s) window.editor.deleteShape(s.id);
});
await wait(3000);
const aCountFinal = await a.evaluate(() => window.editor?.getCurrentPageShapes().length ?? -1);

await browser.close();
console.log(
  JSON.stringify({
    aCount0,
    aCount1_afterAdd: aCount1,
    bCount_freshSession: bCount,
    bSeesClientAShape: bSeesAShape,
    aCountFinal_afterBDeleted: aCountFinal,
    SHARED_SYNC_WORKS: bSeesAShape && bCount === aCount1,
  })
);
