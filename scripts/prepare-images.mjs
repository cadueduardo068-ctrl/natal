import sharp from "sharp";
import fs from "node:fs/promises";
import path from "node:path";
const dir = path.resolve("public/images");
const source = path.resolve("assets-source/product-original.png");
const meta = await sharp(source).metadata();
console.log({ width: meta.width, height: meta.height });
await sharp(source)
  .resize({ width: 960, withoutEnlargement: true })
  .webp({ quality: 83 })
  .toFile(path.join(dir, "product.webp"));
await sharp(source)
  .resize({ width: 480, withoutEnlargement: true })
  .webp({ quality: 78 })
  .toFile(path.join(dir, "product-small.webp"));
await sharp(source)
  .extract({ left: 0, top: 975, width: 1145, height: 399 })
  .resize(1000)
  .webp({ quality: 84 })
  .toFile(path.join(dir, "hero-food.webp"));
await sharp(source)
  .extract({ left: 710, top: 140, width: 435, height: 300 })
  .resize(650)
  .webp({ quality: 82 })
  .toFile(path.join(dir, "pratos.webp"));
await sharp(source)
  .extract({ left: 860, top: 450, width: 285, height: 255 })
  .resize(570)
  .webp({ quality: 82 })
  .toFile(path.join(dir, "acompanhamentos.webp"));
await sharp(source)
  .extract({ left: 700, top: 1110, width: 445, height: 264 })
  .resize(650)
  .webp({ quality: 82 })
  .toFile(path.join(dir, "sobremesas.webp"));
await sharp(path.resolve("assets-source/table-editorial-original.png"))
  .resize(1200)
  .webp({ quality: 82 })
  .toFile(path.join(dir, "table-editorial.webp"));
console.log("Imagens locais WebP preparadas.");
