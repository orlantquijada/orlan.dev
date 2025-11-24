import { cva } from "cva";
import type { ReactNode } from "react";
import { twMerge } from "tailwind-merge";
import ArrowRight from "@/icons/arrow-right.svg?react";
import ArrowTopRight from "@/icons/arrow-top-right.svg?react";
import FileDownload from "@/icons/file-download.svg?react";
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
				<div className="group/item flex flex-col">
					<ConnectLink
						href="https://twitter.com/orlantquijada"
						Icon={<Twitter className="h-5 w-5" />}
						label="Twitter"
					/>
					<ConnectLink
						href="https://github.com/orlantquijada"
						Icon={<GitHub className="h-5 w-5" />}
						label="GitHub"
					/>
					<ConnectLink
						href="/resume"
						Icon={<FileDownload className="h-5 w-5 text-[#858585]" />}
						label="Download Resume"
					/>
				</div>
			</div>

			<button
				className={menuItemStyles({
					className:
						"cursor-pointer text-left text-sm transition-all hover:translate-x-1",
				})}
				onClick={() => {
					if (isBrowser) {
						toggleTheme();
					}
				}}
				type="button"
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
				className={twMerge(
					menuItemStyles({
						className:
							"-mx-8 cursor-pointer border-gray7 border-t px-8 text-left transition-colors hover:bg-gray-a3",
						intent: "sendBtn",
					})
				)}
				type="button"
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
				className: "group/menu transition-transform hover:translate-x-1",
			})}
		>
			{children}
			<div className="-mx-2 opacity-0 transition-all group-hover/menu:translate-x-1 group-hover/menu:opacity-100">
				{Icon}
			</div>
		</div>
	);
}

function ConnectLink(props: {
	href: string;
	label: string;
	Icon: ReactNode;
	className?: string;
}) {
	const { href, label, Icon } = props;

	return (
		<a
			className="group/item opacity-100 transition-all duration-250 ease-out hover:opacity-100 group-hover/item:opacity-50"
			href={href}
			rel="noopener noreferrer"
			target="_blank"
		>
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
						<a className="font-medium" href={link.href}>
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
	}
);
const bulletStyles = cva(["h-2 w-2 justify-self-center rounded-full"]);
