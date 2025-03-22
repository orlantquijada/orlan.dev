import type { oliveP3 } from "@radix-ui/colors";

export function mapRadixColorsToPandaTheme(colors: typeof oliveP3) {
	return Object.fromEntries(
		Object.values(colors).map((value, idx) => [idx + 1, { value }]),
	);
}
