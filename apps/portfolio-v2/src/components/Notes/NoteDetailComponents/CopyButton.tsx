import { useState } from "react";

import Check from "@/icons/check.svg?react";

export default function CopyButton({ code }: { code: string }) {
	const [copied, setCopied] = useState(false);

	const copyCode = async () => {
		await navigator.clipboard.writeText(code);
		setCopied(true);
		setTimeout(() => {
			setCopied(false);
		}, 2000);
	};

	return (
		<button
			aria-label={copied ? "Copied" : "Copy code"}
			className="absolute top-3 right-3 flex h-8 w-8 cursor-copy items-center justify-center rounded-lg bg-gray-a3 text-gray11 transition-[colors,transform] hover:bg-gray-a4 hover:text-gray12 active:scale-[0.96] active:bg-gray-a5"
			onClick={copyCode}
			type="button"
		>
			{copied ? (
				<Check className="h-4 w-4" />
			) : (
				<svg
					className="h-4 w-4"
					fill="none"
					stroke="currentColor"
					strokeLinecap="round"
					strokeLinejoin="round"
					strokeWidth="2"
					viewBox="0 0 24 24"
				>
					<title>copy</title>
					<rect height="13" rx="2" ry="2" width="13" x="9" y="9" />
					<path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
				</svg>
			)}
		</button>
	);
}
