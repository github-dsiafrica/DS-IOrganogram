// vite.config.js
// import { resolve } from 'path'
import { fileURLToPath } from "url";
import { defineConfig } from "vite";

export default defineConfig({
	build: {
		outDir: "dist",

		rollupOptions: {
			input: {
				index: fileURLToPath(new URL("index.html", import.meta.url)),
			},
		},
	},
});
