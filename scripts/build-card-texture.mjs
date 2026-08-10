import sharp from "sharp";
import path from "path";

const assets = path.join(process.cwd(), "public", "assets");
const originalPath = path.join(assets, "card-texture-original.png");
const portraitPath = path.join(assets, "portrait.png");
const outPath = path.join(assets, "card-texture.png");

// Card face regions in the 1024 UV atlas (do not change mesh UVs — only fill them)
const FRONT = { left: 26, top: 20, width: 458, height: 734 };
const BACK = { left: 538, top: 20, width: 458, height: 734 };

const backCard = await sharp(originalPath).extract(BACK).png().toBuffer();

// Cover-fit portrait across the full front UV face (edge-to-edge)
const frontCard = await sharp(portraitPath)
  .resize(FRONT.width, FRONT.height, {
    fit: "cover",
    position: "attention",
  })
  .png()
  .toBuffer();

await sharp({
  create: {
    width: 1024,
    height: 1024,
    channels: 3,
    background: { r: 255, g: 255, b: 255 },
  },
})
  .composite([
    { input: frontCard, left: FRONT.left, top: FRONT.top },
    { input: backCard, left: BACK.left, top: BACK.top },
  ])
  .png()
  .toFile(outPath);

await sharp(frontCard).toFile(path.join(assets, "_preview-front.png"));

console.log("Wrote full-bleed card-texture.png (card mesh size unchanged)");
