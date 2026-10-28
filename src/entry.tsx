import { createRoot, hydrateRoot } from "react-dom/client";
import { App } from "./App";
import { parseConfig } from "./config";
import "./style.css";
async function start() {
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
start().catch(() => {
  document.getElementById("root")!.innerHTML =
    '<main class="load-error"><h1>Vamos tentar de novo?</h1><p>A página não carregou completamente. Atualize para continuar.</p><button onclick="location.reload()">Atualizar página</button></main>';
});
