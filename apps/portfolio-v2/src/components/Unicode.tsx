import "../styles/global.css";

import { cn } from "@/lib/general";
import { useState } from "react";

type Props = { char: string };

export default function Unicode({ char }: Props) {
	const [copied, setCopied] = useState(false);

	const copy = async () => {
		await navigator.clipboard.writeText(char);
		setCopied(true);
		setTimeout(() => {
			setCopied(false);
		}, 1500);
	};

	return (
		<button
			type="button"
			onClick={copy}
			className="flex aspect-square h-24 items-center justify-center rounded-2xl bg-[hsla(0,0%,99%,0.4)] shadow-surface-elevation-low transition duration-300 hover:bg-[hsla(0,0%,99%,0.6)] hover:shadow-surface-elevation-medium dark:border-gray-a3 dark:bg-gray-a3 dark:hover:bg-gray-a4"
		>
			<span
				className={cn(
					"text-6xl font-bold text-gray11 opacity-50",
					copied && "text-gray12 opacity-100",
				)}
			>
				{copied ? "✓" : char}
			</span>
		</button>
	);
}
