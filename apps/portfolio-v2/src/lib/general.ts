import { type CxOptions, cx } from "cva";
import { twMerge } from "tailwind-merge";

export function cn(...args: CxOptions) {
	return twMerge(cx(args));
}

export async function copyToClipboard(text: string): Promise<boolean> {
	try {
		await navigator.clipboard.writeText(text);
		return true;
	} catch {
		return false;
	}
}
