import { expect, test } from "@playwright/test";

const DEDUPED_URL = /\/notes\?tags=css$/;
const CSS_SELECTED_URL = /tags=css/;
const WORK_URL = /\/work/;
const NOTES_URL = /\/notes$/;

test("draft notes have no public route while published notes remain reachable", async ({
	page,
	request,
}) => {
	expect((await request.get("/notes/command-line/")).status()).toBe(404);
	await page.goto("/notes/choice/");
	await expect(
		page.getByRole("heading", { level: 1, name: "Choice" })
	).toBeVisible();
});

test("copy code returns exactly the rendered text, not HTML entities", async ({
	context,
	page,
}) => {
	await context.grantPermissions(["clipboard-read", "clipboard-write"]);
	await page.goto("/notes/choice/");
	const copy = page.getByRole("button", { name: "Copy code" }).first();
	await page.locator(".root astro-island:not([ssr])").first().waitFor();
	const expected =
		'const value = "<tag> & \'single\'";\nif (value < "z") console.log(value);\n';
	const pre = page.locator(".root pre").first();
	await pre.evaluate((element) => {
		element.innerHTML =
			"<code><span>const value = &quot;&lt;tag&gt; &amp; 'single'&quot;;</span>\n<span>if (value &lt; &quot;z&quot;) console.log(value);</span>\n</code>";
	});
	await expect(pre).toHaveText(expected);
	await copy.click();
	expect(await page.evaluate(() => navigator.clipboard.readText())).toBe(
		expected
	);
});

test("tag deep links dedupe repeated tags", async ({ page }) => {
	await page.goto("/notes?tags=css,css");
	await expect(page).toHaveURL(DEDUPED_URL);
	await expect(
		page.getByRole("button", { exact: true, name: "css", pressed: true })
	).toHaveCount(1);
});

test("returning to notes via client navigation hydrates without errors", async ({
	page,
}) => {
	const errors: string[] = [];
	page.on("pageerror", (error) => errors.push(error.message));
	page.on("console", (message) => {
		if (message.type() === "error") {
			errors.push(message.text());
		}
	});
	await page.goto("/notes");
	await page.getByRole("button", { exact: true, name: "css" }).click();
	await expect(page).toHaveURL(CSS_SELECTED_URL);
	await page.locator("footer a[href^='/work']").first().click();
	await expect(page).toHaveURL(WORK_URL);
	await page.locator("footer a[href='/notes']").first().click();
	await expect(page).toHaveURL(NOTES_URL);
	await expect(
		page.getByRole("button", { exact: true, name: "css" })
	).toHaveAttribute("aria-pressed", "false");
	expect(errors).toEqual([]);
});

for (const width of [375, 640, 768, 1280]) {
	test(`notes masonry fits its cards at ${width}px`, async ({ page }) => {
		await page.setViewportSize({ height: 900, width });
		await page.goto("/notes");
		await page.locator("astro-island:not([ssr])").first().waitFor();
		const list = page.locator("a[href^='/notes/']").first().locator("..");
		await expect
			.poll(() =>
				list.evaluate((element) => {
					const box = element.getBoundingClientRect();
					const cards = [...element.children].map((child) =>
						child.getBoundingClientRect()
					);
					return {
						gap: Math.round(
							box.bottom - Math.max(...cards.map((card) => card.bottom))
						),
						overflow: Math.max(
							0,
							Math.round(
								Math.max(...cards.map((card) => card.right)) - box.right
							)
						),
					};
				})
			)
			.toEqual({ gap: 12, overflow: 0 });
	});
}
