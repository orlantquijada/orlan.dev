import type { Page } from "@playwright/test";
import { expect, test } from "@playwright/test";

type MediaProbe = {
	playCalls: number;
	pauseCalls: number;
	reject: boolean;
	video?: HTMLMediaElement;
};

declare global {
	// biome-ignore lint/style/useConsistentTypeDefinitions: Window augmentation must merge with the DOM interface.
	interface Window {
		mediaProbe?: MediaProbe;
	}
}

async function installMediaProbe(page: Page, reject: boolean) {
	await page.addInitScript((shouldReject) => {
		const states = new WeakMap<HTMLMediaElement, boolean>();
		window.mediaProbe = { pauseCalls: 0, playCalls: 0, reject: shouldReject };
		Object.defineProperty(HTMLMediaElement.prototype, "paused", {
			configurable: true,
			get(this: HTMLMediaElement) {
				return states.get(this) ?? true;
			},
		});
		HTMLMediaElement.prototype.play = function () {
			const probe = window.mediaProbe;
			if (this.closest('[role="dialog"]') && probe) {
				probe.video = this;
				probe.playCalls += 1;
			}
			if (probe?.reject) {
				return Promise.reject(
					new DOMException("Playback blocked", "NotAllowedError")
				);
			}
			states.set(this, false);
			this.dispatchEvent(new Event("play"));
			return Promise.resolve();
		};
		HTMLMediaElement.prototype.pause = function () {
			const probe = window.mediaProbe;
			if (this === probe?.video) {
				probe.pauseCalls += 1;
			}
			states.set(this, true);
			this.dispatchEvent(new Event("pause"));
		};
	}, reject);
}

async function openDialog(page: Page) {
	await page.goto("/");
	await page
		.locator('astro-island[component-url*="VideoPreviewDialog"]:not([ssr])')
		.first()
		.waitFor();
	await page.getByRole("button", { name: "AI assistant" }).click();
	return page.getByRole("dialog", { name: "AI assistant video preview" });
}

test("rejected playback stays paused without an unhandled rejection", async ({
	page,
}) => {
	const errors: string[] = [];
	page.on("pageerror", (error) => errors.push(error.message));
	await installMediaProbe(page, true);
	const dialog = await openDialog(page);
	await dialog.getByRole("button", { name: "Play video" }).click();
	await expect(
		dialog.getByRole("button", { name: "Play video" })
	).toBeVisible();
	expect(await page.evaluate(() => window.mediaProbe?.playCalls)).toBe(1);
	expect(
		await dialog
			.locator("video")
			.evaluate((video) => (video as HTMLVideoElement).paused)
	).toBe(true);
	expect(errors).toEqual([]);
});

test("mouse and keyboard toggle once, and closing stops playback", async ({
	page,
}) => {
	await installMediaProbe(page, false);
	const dialog = await openDialog(page);
	await dialog.getByRole("button", { name: "Play video" }).click();
	await expect(
		dialog.getByRole("button", { name: "Pause video" })
	).toBeVisible();
	expect(await page.evaluate(() => window.mediaProbe?.playCalls)).toBe(1);

	await dialog.getByRole("button", { name: "Pause video" }).press("Space");
	await expect(
		dialog.getByRole("button", { name: "Play video" })
	).toBeVisible();
	expect(await page.evaluate(() => window.mediaProbe?.pauseCalls)).toBe(1);

	await dialog.getByRole("button", { name: "Play video" }).press("Enter");
	await expect(
		dialog.getByRole("button", { name: "Pause video" })
	).toBeVisible();
	await page.keyboard.press("Escape");
	await expect(dialog).toBeHidden();
	await expect
		.poll(() => page.evaluate(() => window.mediaProbe?.pauseCalls))
		.toBe(2);
	expect(await page.evaluate(() => window.mediaProbe?.video?.paused)).toBe(
		true
	);
});
