import "./style.css";

function initialize() {
  void import("./hydrate")
    .then(({ mount }) => mount())
    .catch(() => {
      // Preserve pre-rendered content and working checkout links if hydration fails.
      if (document.getElementById("site-config")) return;
      document.getElementById("root")!.innerHTML =
        '<main class="load-error"><h1>Vamos tentar de novo?</h1><p>A página não carregou completamente. Atualize para continuar.</p><button onclick="location.reload()">Atualizar página</button></main>';
    });
}

if (document.getElementById("site-config")) {
  // The static HTML already contains readable content, native FAQ and checkout
  // links. Let the hero paint before downloading/parsing React and animation code.
  const afterPaint = () =>
    requestAnimationFrame(() => requestAnimationFrame(initialize));
  if (document.readyState === "complete") afterPaint();
  else window.addEventListener("load", afterPaint, { once: true });
} else {
  initialize();
}
