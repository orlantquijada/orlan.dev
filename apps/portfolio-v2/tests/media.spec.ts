import type { Page } from "@playwright/test";
import { expect, test } from "@playwright/test";

const workImagePattern = /\/_astro\/(?:1|2|desktop)\.[^/]+\.webp$/;

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

test("reduced motion prevents autoplay but preserves intentional playback", async ({
	page,
}) => {
	await page.emulateMedia({ reducedMotion: "reduce" });
	await installMediaProbe(page, false);
	await page.goto("/");

	const project = page.locator("#daily video");
	await project.scrollIntoViewIfNeeded();
	await page.locator("#daily astro-island:not([ssr])").waitFor();
	expect(
		await project.evaluate((video: HTMLVideoElement) => ({
			autoplay: video.autoplay,
			paused: video.paused,
		}))
	).toEqual({ autoplay: false, paused: true });

	await page.emulateMedia({ reducedMotion: "no-preference" });
	await expect
		.poll(() => project.evaluate((video: HTMLVideoElement) => video.paused))
		.toBe(false);
	await page.emulateMedia({ reducedMotion: "reduce" });
	await expect
		.poll(() => project.evaluate((video: HTMLVideoElement) => video.paused))
		.toBe(true);

	const trigger = page.getByRole("button", { name: "AI assistant" });
	await trigger.hover();
	const preview = page.locator("[data-radix-popper-content-wrapper] video");
	await expect(preview).toBeVisible();
	expect(
		await preview.evaluate((video: HTMLVideoElement) => video.autoplay)
	).toBe(false);
	await trigger.click();
	const dialog = page.getByRole("dialog", {
		name: "AI assistant video preview",
	});
	await dialog.getByRole("button", { name: "Play video" }).click();
	await expect(
		dialog.getByRole("button", { name: "Pause video" })
	).toBeVisible();
	expect(await page.evaluate(() => window.mediaProbe?.playCalls)).toBe(1);
});

test("work lightbox keeps the matching preview when full images cannot load", async ({
	page,
}) => {
	await page.goto("/work");
	const previews = new Set(
		await page
			.locator(".hero-gallery img, .showcase-grid img")
			.evaluateAll((images) =>
				images.map((image) => (image as HTMLImageElement).src)
			)
	);
	await page.route(workImagePattern, async (route) => {
		if (previews.has(route.request().url())) {
			await route.continue();
		} else {
			await route.abort();
		}
	});

	await page
		.locator('astro-island[component-url*="ImageLightbox"]:not([ssr])')
		.first()
		.waitFor();
	await page
		.getByRole("button", { name: "View Spaceduck app screenshot 1" })
		.click();
	const dialog = page.getByRole("dialog", { name: "Spaceduck image gallery" });
	const first = dialog.getByRole("img", { name: "Spaceduck app screenshot 1" });
	await expect(first).toBeVisible();
	await expect
		.poll(() => first.evaluate((image: HTMLImageElement) => image.naturalWidth))
		.toBeGreaterThan(0);

	await page.keyboard.press("ArrowRight");
	const second = dialog.getByRole("img", {
		name: "Spaceduck app screenshot 2",
	});
	await expect(second).toBeVisible();
	await expect
		.poll(() =>
			second.evaluate((image: HTMLImageElement) => image.naturalWidth)
		)
		.toBeGreaterThan(0);
	await expect(first).toHaveCount(0);

	await page.keyboard.press("Escape");
	const desktop = page.getByRole("button", {
		name: "View Spaceduck desktop dashboard",
	});
	await desktop.scrollIntoViewIfNeeded();
	await page
		.locator('astro-island[component-url*="ImageLightbox"]:not([ssr])')
		.last()
		.waitFor();
	await desktop.click();
	const showcase = dialog.getByRole("img", {
		name: "Spaceduck desktop dashboard",
	});
	await expect(showcase).toBeVisible();
	await expect
		.poll(() =>
			showcase.evaluate((image: HTMLImageElement) => image.naturalWidth)
		)
		.toBeGreaterThan(0);
});
