type Props = {
	open?: boolean;
};

export default function MenuIcon({ open }: Props) {
	return (
		<svg
			class={`h-[1em] w-[1em] stroke-gray10 ${open ? "translate-y-1" : ""}`}
			viewBox="0 0 24 24"
		>
			<title>Menu Icon</title>
			<path d="M1 8H23" strokeLinecap="round" strokeWidth="2" />
			<path d="M1 16H23" strokeLinecap="round" strokeWidth="2" />
		</svg>
	);
}
