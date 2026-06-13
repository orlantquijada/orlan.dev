import { type CxOptions, cx } from "cva";
import { useEffect, useLayoutEffect } from "react";
import { twMerge } from "tailwind-merge";

export const isBrowser = typeof window !== "undefined";
export const useIsomorphicLayoutEffect = isBrowser
	? useLayoutEffect
	: useEffect;

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
