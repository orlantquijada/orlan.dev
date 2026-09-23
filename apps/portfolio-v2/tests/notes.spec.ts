import { expect, test } from "@playwright/test";

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
