import fs from "node:fs/promises";
await fs.mkdir("public/fonts", { recursive: true });
const families = [
  ["Playfair+Display:wght@500", "editorial"],
  ["Playfair+Display:ital,wght@1,500", "editorial-italic"],
  ["DM+Sans:wght@400;500;600;700", "text"],
];
let out = "";
for (const [family, name] of families) {
  const response = await fetch(
    `https://fonts.googleapis.com/css2?family=${family}&display=swap`,
    {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0.0.0 Safari/537.36",
      },
    },
  );
  if (!response.ok) throw Error(response.status);
  const css = await response.text();
  const blocks = (css.match(/@font-face\s*\{[^}]+}/g) || []).filter(
    (b) => !b.includes("unicode-range") || b.includes("U+0000-00FF"),
  );
  if (!blocks.length) throw Error("Font CSS vazio para " + family);
  let i = 0;
  const files = new Map();
  for (const block of blocks) {
    const url = block.match(/url\((https:[^)]+)\)/)?.[1];
    if (!url) continue;
    let file = files.get(url);
    if (!file) {
      const r = await fetch(url);
      if (!r.ok) throw Error(r.status);
      file = `${name}-${i++}.woff2`;
      await fs.writeFile(
        `public/fonts/${file}`,
        Buffer.from(await r.arrayBuffer()),
      );
      files.set(url, file);
    }
    out += block.replace(url, `/fonts/${file}`) + "\n";
  }
}
await fs.writeFile("src/fonts.css", out);
console.log("Fontes hospedadas localmente.");
