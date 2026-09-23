import type { Page } from "@playwright/test";
import { expect, test } from "@playwright/test";

const notesUrl = /\/notes\/?$/;
const lightTheme = /light/;
const effectiveTheme = (page: Page) =>
	page.locator("html").getAttribute("class");
const storedTheme = (page: Page) =>
	page.evaluate(() => localStorage.getItem("theme-preference"));

test("automatic theme follows the OS without creating an override", async ({
	page,
}) => {
	await page.emulateMedia({ colorScheme: "light" });
	await page.goto("/");
	await expect.poll(() => effectiveTheme(page)).toContain("light");
	expect(await storedTheme(page)).toBeNull();

	await page.emulateMedia({ colorScheme: "dark" });
	await expect.poll(() => effectiveTheme(page)).toContain("dark");
	expect(await storedTheme(page)).toBeNull();
});

test("explicit preference survives OS changes, resets across tabs and survives navigation", async ({
	context,
	page,
}) => {
	await page.emulateMedia({ colorScheme: "light" });
	await page.goto("/");
	const toggle = page.locator(".theme-toggle");
	await toggle.click();
	await toggle.click();
	expect(await storedTheme(page)).toBe("light");

	await page.emulateMedia({ colorScheme: "dark" });
	await expect.poll(() => effectiveTheme(page)).toContain("light");

	const otherTab = await context.newPage();
	await otherTab.goto("/");
	await otherTab.evaluate(() => localStorage.removeItem("theme-preference"));
	await expect.poll(() => effectiveTheme(page)).toContain("dark");
	expect(await storedTheme(page)).toBeNull();

	await otherTab.evaluate(() =>
		localStorage.setItem("theme-preference", "invalid")
	);
	await expect.poll(() => storedTheme(page)).toBeNull();
	await expect.poll(() => effectiveTheme(page)).toContain("dark");

	await toggle.click(); // dark system → explicit light
	expect(await storedTheme(page)).toBe("light");
	await page.evaluate(() => {
		document.addEventListener(
			"astro:after-swap",
			() => {
				document.documentElement.dataset.themeAtSwap =
					document.documentElement.className;
			},
			{ once: true }
		);
	});
	await page.locator("footer").getByRole("link", { name: "Notes" }).click();
	await expect(page).toHaveURL(notesUrl);
	await expect(page.locator("html")).toHaveAttribute(
		"data-theme-at-swap",
		lightTheme
	);
	await expect.poll(() => effectiveTheme(page)).toContain("light");
	await page.locator(".theme-toggle").click();
	expect(await storedTheme(page)).toBe("dark"); // one click, one toggle
	await page.locator("header astro-island:not([ssr])").waitFor();
	await page.locator("header button").first().click();
	await page.getByRole("button", { name: "Toggle Theme" }).click();
	expect(await storedTheme(page)).toBe("light"); // menu action also toggles once
});
