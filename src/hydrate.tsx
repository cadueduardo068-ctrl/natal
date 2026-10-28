import { createRoot, hydrateRoot } from "react-dom/client";
import { App } from "./App";
import { parseConfig } from "./config";
export async function mount() {
  const embedded = document.getElementById("site-config");
  let raw;
  if (embedded) {
    raw = JSON.parse(embedded.textContent || "{}");
  } else {
    const response = await fetch("/config.json", { cache: "no-cache" });
    if (!response.ok) throw Error("Configuração indisponível");
    raw = await response.json();
  }
  const config = parseConfig(raw);
  const root = document.getElementById("root")!;
  if (embedded) hydrateRoot(root, <App config={config} />);
  else createRoot(root).render(<App config={config} />);
}
