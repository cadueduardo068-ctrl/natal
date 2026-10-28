import { fileURLToPath } from "node:url";
import path from "node:path";
import { resolveConfig } from "vite";

export const projectRoot = fileURLToPath(new URL("../", import.meta.url));
const config = await resolveConfig({ root: projectRoot }, "build");
export const outputDir = path.resolve(projectRoot, config.build.outDir);
