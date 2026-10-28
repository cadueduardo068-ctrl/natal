import { renderToString } from "react-dom/server";
import { App } from "./App";
import { parseConfig } from "./config";
export function renderPage(raw: unknown) {
  return renderToString(<App config={parseConfig(raw)} />);
}
