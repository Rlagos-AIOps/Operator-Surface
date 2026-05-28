import puppeteer from "puppeteer-core";

const CHROME = "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome";
const URL = process.argv[2] || "https://operator-surface-board.akhaus.workers.dev";
const wait = (ms) => new Promise((r) => setTimeout(r, ms));

const browser = await puppeteer.launch({
  executablePath: CHROME,
  headless: true,
  args: ["--no-sandbox", "--disable-setuid-sandbox"],
});
const page = await browser.newPage();
const logs = [];
page.on("console", (m) => logs.push(`[${m.type()}] ${m.text()}`.slice(0, 300)));
page.on("pageerror", (e) => logs.push(`[PAGEERROR] ${e.message}`.slice(0, 500)));
page.on("requestfailed", (r) =>
  logs.push(`[REQFAIL] ${r.url().slice(0, 80)} ${r.failure()?.errorText}`)
);
page.on("response", (r) => {
  if (r.status() >= 400) logs.push(`[HTTP ${r.status()}] ${r.url().slice(0, 90)}`);
});

await page.goto(URL, { waitUntil: "domcontentloaded" });

const samples = [];
const times = [2000, 4000, 6000, 9000, 12000, 15000];
let last = 0;
for (const t of times) {
  await wait(t - last);
  last = t;
  const state = await page
    .evaluate(() => ({
      root: document.getElementById("root")?.childElementCount ?? -1,
      tlShapes: document.querySelectorAll(".tl-shape").length,
      toolbar: !!document.querySelector(".tlui-toolbar, [data-testid]"),
      err: document.body.innerText.match(/error|something went wrong|cannot/i)?.[0] || "",
    }))
    .catch((e) => ({ evalErr: e.message }));
  samples.push({ t, ...state });
}
await page.screenshot({ path: "/tmp/board-debug.png" });
await browser.close();

console.log("=== DOM SAMPLES (t ms) ===");
samples.forEach((s) => console.log(JSON.stringify(s)));
console.log("\n=== CONSOLE / ERRORS (last 45) ===");
console.log(logs.slice(-45).join("\n"));
