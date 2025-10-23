import {
	type MotionStyle,
	motion,
	useScroll,
	useTransform,
} from "motion/react";
import {
	type CSSProperties,
	type ElementRef,
	type ReactNode,
	useEffect,
	useRef,
	useState,
} from "react";

import { cn } from "@/lib/general";

type Props = {
	children?: ReactNode;
	numOfItems: number;
};

const gapSize = 16;
const breakpoint = 768;
// 24 = padding
const containerSize = 704 - 24 * 2;

export default function ProjectsCarousel({ children, numOfItems }: Props) {
	const scrollableRef = useRef<ElementRef<"div">>(null);
	const { scrollYProgress } = useScroll({
		target: scrollableRef,
	});

	const [width, setWidth] = useState(0);
	const [isOnMobileWidth, setIsOnMobileWidth] = useState<boolean>();

	const isClient = typeof window === "object";

	useEffect(() => {
		if (isClient) {
			setWidth(
				window.innerWidth > breakpoint
					? containerSize
					: window.innerWidth - 24 * 2
			);
			setIsOnMobileWidth(window.innerWidth < breakpoint);
		}
	}, [isClient]);

	const fullWidth = width * numOfItems + gapSize * (numOfItems - 1);
	// translate x to full width - one item size
	const xPercent = ((fullWidth - width) / fullWidth) * 100;

	const x = useTransform(scrollYProgress, [0, 1], ["0%", `-${xPercent}%`]);

	return (
		<section
			className="relative mt-8 h-(--fullWidth) w-full md:h-auto"
			ref={scrollableRef}
			style={
				{
					// `--fullWidth` variable used for height
					"--fullWidth": `${fullWidth + width * 1.5}px`,
				} as CSSProperties
			}
		>
			<div
				className={cn(
					"-mx-6 sticky top-[96px] flex flex-col items-start overflow-x-clip px-6",
					"md:relative md:inset-[initial] md:h-208 md:min-w-full md:overflow-visible"
				)}
			>
				<h3 className="mb-6 text-gray11 text-sm">Projects</h3>

				<motion.div
					className={cn("flex will-change-transform", "md:h-full md:w-full")}
					style={
						{
							"--itemWidth": `${width}px`,
							gap: `${gapSize}px`,

							// animate only if window is on mobile
							x: isOnMobileWidth ? x : 0,
						} as MotionStyle
					}
				>
					{children}
				</motion.div>
			</div>
		</section>
	);
}
