import { cva } from "cva";
import type { ReactNode } from "react";

import ArrowRight from "@/icons/arrow-right.svg?react";
import ArrowTopRight from "@/icons/arrow-top-right.svg?react";
import GitHub from "@/icons/github.svg?react";
import Logo from "@/icons/logo.svg?react";
import Twitter from "@/icons/twitter.svg?react";

import { isBrowser } from "@/lib/general";
import { toggleTheme } from "@/lib/theme-toggle";

import ContactDialog from "../Contact/ContactDialog";

import styles from "./styles.module.css";

export function MenuPanel() {
	return (
		<div className="mt-10 flex flex-col gap-8">
			<Nav />

			<div>
				<h4 className="mb-3 text-gray10 dark:text-gray11">Connect</h4>
				<div className="flex flex-col">
					<ConnectLink
						Icon={<Twitter className="h-5 w-5" />}
						label="Twitter"
						href="https://twitter.com/orlantquijada"
					/>
					<ConnectLink
						Icon={<GitHub className="h-5 w-5" />}
						label="GitHub"
						href="https://github.com/orlantquijada"
					/>
				</div>
			</div>

			<button
				type="button"
				className={menuItemStyles({
					className: "text-left text-sm transition-all hover:translate-x-1",
				})}
				onClick={() => {
					if (isBrowser) toggleTheme();
				}}
			>
				<div className="flex justify-center">
					<Logo className="h-4 w-4" />
				</div>
				Toggle Theme
			</button>

			<SendButton />
		</div>
	);
}

function SendButton() {
	return (
		<ContactDialog>
			<button
				type="button"
				className={menuItemStyles({
					className:
						"-mx-8 border-t border-gray7 px-8 text-left transition-colors hover:bg-grayA3",
					intent: "sendBtn",
				})}
			>
				<span className={bulletStyles({ className: "bg-accent" })} />
				Send me a message
			</button>
		</ContactDialog>
	);
}

function MenuItem(props: { Icon: ReactNode; children: ReactNode }) {
	const { Icon, children } = props;

	return (
		<div
			className={menuItemStyles({
				className: "group transition-transform hover:translate-x-1",
			})}
		>
			{children}
			<div className="-mx-2 opacity-0 transition-all group-hover:translate-x-1 group-hover:opacity-100">
				{Icon}
			</div>
		</div>
	);
}

function ConnectLink(props: { href: string; label: string; Icon: ReactNode }) {
	const { href, label, Icon } = props;

	return (
		<a href={href} target="_blank" rel="noopener noreferrer">
			<MenuItem Icon={<ArrowTopRight className={`${styles.icon} h-4 w-4`} />}>
				{Icon}
				{label}
			</MenuItem>
		</a>
	);
}

const links: Array<{
	href: string;
	label: string;
	color: `bg-accent-${"blue" | "pink" | "violet"}`;
}> = [
	// { href: '/writing', label: 'Writing', color: 'bg-accent-pink' },
	// { href: '/bookmarks', label: 'Bookmarks', color: 'bg-accent-violet' },
	{ href: "/notes", label: "Notes", color: "bg-accent-blue" },
];

function Nav() {
	return (
		<nav>
			<ul className="flex flex-col">
				{links.map((link) => (
					<li key={link.label}>
						<a href={link.href} className="font-medium">
							<MenuItem
								Icon={
									<ArrowRight
										className={`h-4 w-4 text-gray10 ${styles.icon}`}
									/>
								}
							>
								<span className={bulletStyles({ className: link.color })} />
								{link.label}
							</MenuItem>
						</a>
					</li>
				))}
			</ul>
		</nav>
	);
}

const menuItemStyles = cva(
	["grid grid-cols-[1.25rem_auto_1fr] items-center gap-2"],
	{
		variants: {
			intent: {
				default: "py-1",
				sendBtn: "py-6",
			},
		},
		defaultVariants: {
			intent: "default",
		},
	},
);
const bulletStyles = cva(["w-2 h-2 rounded-full justify-self-center"]);
