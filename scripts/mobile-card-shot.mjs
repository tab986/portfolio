import { chromium } from "playwright";
import path from "path";
import fs from "fs";

const outDir = path.resolve(".tmp-mobile-test");
fs.mkdirSync(outDir, { recursive: true });

const browser = await chromium.launch({ headless: true });
const context = await browser.newContext({
  viewport: { width: 390, height: 844 },
  deviceScaleFactor: 2,
  isMobile: true,
  hasTouch: true,
  userAgent:
    "Mozilla/5.0 (iPhone; CPU iPhone OS 16_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/16.0 Mobile/15E148 Safari/604.1",
});
const page = await context.newPage();
await page.goto("http://localhost:3000/", {
  waitUntil: "domcontentloaded",
  timeout: 60000,
});
await page.waitForTimeout(2000);
await page.evaluate(() => {
  document.getElementById("portfolio")?.scrollIntoView({ block: "start" });
});
// Wait for WebGL card to settle
await page.waitForTimeout(4500);

const meta = await page.evaluate(() => {
  const viewport =
    document.querySelector('meta[name="viewport"]')?.getAttribute("content") ||
    null;
  const stage = document.querySelector(".lanyard-card__stage");
  const canvas = stage?.querySelector("canvas");
  const cs = canvas ? getComputedStyle(canvas) : null;
  const ss = stage ? getComputedStyle(stage) : null;
  const card = document.querySelector(".lanyard-card");
  return {
    innerWidth: window.innerWidth,
    viewport,
    stage: stage
      ? {
          w: stage.clientWidth,
          h: stage.clientHeight,
          overflow: ss?.overflow,
        }
      : null,
    canvas: canvas
      ? {
          w: canvas.clientWidth,
          h: canvas.clientHeight,
          transform: cs?.transform,
          rect: canvas.getBoundingClientRect(),
        }
      : null,
    cardRect: card?.getBoundingClientRect() || null,
  };
});

fs.writeFileSync(path.join(outDir, "meta.json"), JSON.stringify(meta, null, 2));
await page.screenshot({
  path: path.join(outDir, "portfolio-mobile.png"),
  fullPage: false,
});
const stage = page.locator(".lanyard-card__stage");
if ((await stage.count()) > 0) {
  await stage.screenshot({ path: path.join(outDir, "card-stage.png") });
}
console.log(JSON.stringify(meta, null, 2));
await browser.close();
