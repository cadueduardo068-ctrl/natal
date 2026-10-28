import fs from "node:fs/promises";
for (const family of ["playfairdisplay", "dmsans"]) {
  const url = `https://raw.githubusercontent.com/google/fonts/main/ofl/${family}/OFL.txt`;
  const r = await fetch(url);
  if (!r.ok) throw Error(r.status);
  await fs.writeFile(`public/fonts/${family}-OFL.txt`, await r.text());
}
console.log("Licenças OFL das duas fontes incluídas.");
