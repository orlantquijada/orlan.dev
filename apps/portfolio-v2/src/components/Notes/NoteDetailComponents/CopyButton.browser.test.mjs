import assert from "node:assert/strict";

// Run with a BrowserTab opened on /notes/choice while the portfolio app is serving.
export async function verifyCodeCopy(tab) {
	const expected =
		'const value = "<tag> & \'single\'";\nif (value < "z") console.log(value);\n';
	const result = await tab.run(async ({ page }) => {
		await page.waitForFunction(() => {
			const island = document.querySelector(".root astro-island");
			return island && !island.hasAttribute("ssr");
		});
		return page.evaluate(() => {
			const pre = document.querySelector(".root pre");
			pre.innerHTML =
				"<code><span>const value = &quot;&lt;tag&gt; &amp; 'single'&quot;;</span>\n<span>if (value &lt; &quot;z&quot;) console.log(value);</span>\n</code>";
			let copied;
			Object.defineProperty(navigator, "clipboard", {
				configurable: true,
				value: {
					writeText: (text) => {
						copied = text;
						return Promise.resolve();
					},
				},
			});
			const displayed = pre.textContent;
			document.querySelector('.root button[aria-label="Copy code"]').click();
			return { copied, displayed };
		});
	});
	assert.equal(
		result.displayed,
		expected,
		"fixture renders literal symbols and newlines"
	);
	assert.equal(
		result.copied,
		expected,
		"clipboard receives exactly the displayed code"
	);
}
