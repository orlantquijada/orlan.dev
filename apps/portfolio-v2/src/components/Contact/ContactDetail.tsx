import type { ReactNode } from "react";

type Props = {
	title: string;
	description: string;
	children: ReactNode;
};

export default function ContactDetail(props: Props) {
	const { children, title, description } = props;

	return (
		<div class="flex flex-col justify-between gap-y-4 md:flex-row md:items-center">
			<div>
				<span>{title}</span>
				<p class="text-gray10">{description}</p>
			</div>
			{children}
		</div>
	);
}
