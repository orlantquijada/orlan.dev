import { defineConfig, devices } from "@playwright/test";

const baseURL = "http://127.0.0.1:4332";

export default defineConfig({
	fullyParallel: true,
	testDir: "./tests",
	use: {
		...devices["Desktop Chrome"],
		baseURL,
	},
	webServer: {
		command: "pnpm preview --host 127.0.0.1 --port 4332 --ignore-lock",
		reuseExistingServer: !process.env.CI,
		timeout: 30_000,
		url: baseURL,
	},
	workers: 2,
});
