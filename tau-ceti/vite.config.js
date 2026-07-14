import { resolve } from "node:path";
import { defineConfig } from "vite";

export default defineConfig({
  esbuild: {
    jsx: "transform",
    jsxFactory: "customCreateElement",
    jsxFragment: "Fragment",
  },
  build: {
    rollupOptions: {
      input: {
        index: resolve(import.meta.dirname, "index.html"),
        "phase-1": resolve(
          import.meta.dirname,
          "src/phase-1-vanilla/index.html",
        ),
        "phase-2": resolve(
          import.meta.dirname,
          "src/phase-2-compiler/index.html",
        ),
        "phase-3": resolve(import.meta.dirname, "src/phase-3-vdom/index.html"),
      },
    },
  },
});
