import { cva } from "cva";
import { type ComponentProps, type ReactNode, useState } from "react";
import { twMerge } from "tailwind-merge";

import Check from "@/icons/check.svg?react";
import Copy from "@/icons/copy-filled.svg?react";
import GitHub from "@/icons/github.svg?react";
import Send from "@/icons/send-filled.svg?react";
import Twitter from "@/icons/twitter.svg?react";
import { EMAIL } from "@/utils/constants";
import { Button, buttonStyles } from "../Button";
import * as Dialog from "../Dialog";
import ContactDetail from "./ContactDetail";
import styles from "./ContactDialog.module.css";

export default function ContactDialog({ children }: { children: ReactNode }) {
	const [copied, setCopied] = useState(false);

	// NOTE: does not work on mobile & localhost (permission problem)
	const copyEmail = async () => {
		await navigator.clipboard.writeText(EMAIL);
		setCopied(true);
		setTimeout(() => {
			setCopied(false);
		}, 2000);
	};

	return (
		<Dialog.Root trigger={children}>
			<div class="flex flex-col gap-6 md:gap-8">
				<Dialog.Title class="font-medium text-xl md:text-2xl">
					Contact
				</Dialog.Title>

				<div class="flex flex-col gap-8 text-sm md:text-base">
					<ContactDetail description={EMAIL} title="Email">
						<div class="flex gap-2">
							<a
								class={twMerge(
									buttonStyles({
										className: "flex items-center gap-2 active:scale-95",
										translucent: true,
									}),
								)}
								href={`mailto:${EMAIL}`}
								rel="noopener noreferrer"
								target="_blank"
							>
								<Send class={iconStyles()} />
								Compose
							</a>
							<Button
								class="flex items-center gap-2 active:scale-95"
								onClick={copyEmail}
								translucent
							>
								{copied ? (
									<Check class={iconStyles()} />
								) : (
									<Copy class={iconStyles()} />
								)}
								Copy
							</Button>
						</div>
					</ContactDetail>

					<div class="h-auto w-full border border-gray6" />

					<ContactDetail
						description="I'm more active on twitter"
						title="Stay in touch"
					>
						<div class="flex gap-4">
							<Social href="https://github.com/orlantquijada">
								<GitHub class={iconStyles({ size: "md" })} />
								GitHub
							</Social>
							<Social href="https://twitter.com/orlantquijada">
								<Twitter class={iconStyles({ size: "md" })} />
								Twitter
							</Social>
						</div>
					</ContactDetail>
				</div>
			</div>
		</Dialog.Root>
	);
}

function Social(props: ComponentProps<"a">) {
	return (
		<a
			{...props}
			class="flex items-center gap-1 rounded-full p-1 pr-2 outline-offset-2 transition-colors hover:bg-gray-a3 focus-visible:outline-gray7"
			rel="noopener noreferrer"
			target="_blank"
		/>
	);
}

const iconStyles = cva([styles.icon], {
	variants: {
		size: {
			sm: "h-4 w-4",
			md: "h-6 w-6",
		},
	},
	defaultVariants: {
		size: "sm",
	},
});
