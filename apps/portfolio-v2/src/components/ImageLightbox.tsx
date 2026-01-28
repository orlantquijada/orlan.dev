import * as DialogPrimitive from "@radix-ui/react-dialog";
import { transitions } from "@repo/utils";
import { AnimatePresence, motion } from "motion/react";
import { useCallback, useEffect, useState } from "react";
import ArrowRight from "@/icons/arrow-right.svg?react";
import Close from "@/icons/cross.svg?react";
import { cn } from "@/lib/general";

type ImageItem = {
	src: string;
	alt: string;
};

type LightboxDialogProps = {
	images: ImageItem[];
	currentIndex: number | null;
	onIndexChange: (index: number | null) => void;
};

export function LightboxDialog({
	images,
	currentIndex,
	onIndexChange,
}: LightboxDialogProps) {
	const isOpen = currentIndex !== null;

	const handleOpenChange = (open: boolean) => {
		if (!open) {
			onIndexChange(null);
		}
	};

	const goToPrevious = useCallback(() => {
		if (currentIndex === null) {
			return;
		}
		onIndexChange(currentIndex === 0 ? images.length - 1 : currentIndex - 1);
	}, [currentIndex, images.length, onIndexChange]);

	const goToNext = useCallback(() => {
		if (currentIndex === null) {
			return;
		}
		onIndexChange(currentIndex === images.length - 1 ? 0 : currentIndex + 1);
	}, [currentIndex, images.length, onIndexChange]);

	useEffect(() => {
		if (!isOpen) {
			return;
		}

		const handleKeyDown = (e: KeyboardEvent) => {
			if (e.key === "ArrowLeft") {
				e.preventDefault();
				goToPrevious();
			} else if (e.key === "ArrowRight") {
				e.preventDefault();
				goToNext();
			}
		};

		window.addEventListener("keydown", handleKeyDown);
		return () => window.removeEventListener("keydown", handleKeyDown);
	}, [isOpen, goToPrevious, goToNext]);

	return (
		<DialogPrimitive.Root onOpenChange={handleOpenChange} open={isOpen}>
			<DialogPrimitive.Portal>
				<DialogPrimitive.Overlay className="fixed inset-0 z-40 bg-overlay data-[state=closed]:motion-safe:animate-hide data-[state=open]:motion-safe:animate-show" />
				<DialogPrimitive.Content
					className="fixed inset-0 z-50 flex items-center justify-center data-[state=closed]:motion-safe:animate-hideContent data-[state=open]:motion-safe:animate-showContent"
					onClick={() => onIndexChange(null)}
				>
					<AnimatePresence initial={false} mode="popLayout">
						{currentIndex !== null && images[currentIndex] && (
							<motion.img
								alt={images[currentIndex].alt}
								animate={{ opacity: 1, scale: 1 }}
								className="max-h-[85vh] max-w-[90vw] rounded-xl object-contain md:max-h-[90vh] md:max-w-[85vw]"
								exit={{ opacity: 0, scale: 0.95 }}
								initial={{ opacity: 0, scale: 0.95 }}
								key={currentIndex}
								onClick={(e) => e.stopPropagation()}
								src={images[currentIndex].src}
								transition={transitions.punchy}
							/>
						)}
					</AnimatePresence>

					<NavButton
						aria-label="Previous image"
						direction="prev"
						onClick={goToPrevious}
					/>
					<NavButton
						aria-label="Next image"
						direction="next"
						onClick={goToNext}
					/>

					<div
						className={cn(
							"fixed inset-x-0 top-0 z-10 flex items-center justify-end pt-4 pr-4"
						)}
						onClick={(e) => e.stopPropagation()}
					>
						<DialogPrimitive.Close
							className={cn(
								"grid size-12 cursor-pointer place-items-center rounded-xl bg-gray-a3 text-gray1 transition-all active:scale-90 active:opacity-75 md:size-16 dark:text-gray12"
							)}
						>
							<Close />
						</DialogPrimitive.Close>
					</div>

					<div
						className="-translate-x-1/2 fixed bottom-4 left-1/2 rounded-lg bg-black/50 px-3 py-1.5 text-sm text-white"
						onClick={(e) => e.stopPropagation()}
					>
						{(currentIndex ?? 0) + 1} / {images.length}
					</div>
				</DialogPrimitive.Content>
			</DialogPrimitive.Portal>
		</DialogPrimitive.Root>
	);
}

type ImageLightboxProps = {
	images: ImageItem[];
	children: React.ReactNode;
};

export default function ImageLightbox({
	images,
	children,
}: ImageLightboxProps) {
	const [currentIndex, setCurrentIndex] = useState<number | null>(null);

	const handleClick = (e: React.MouseEvent) => {
		const target = (e.target as HTMLElement).closest("[data-lightbox-index]");
		if (target) {
			const index = Number.parseInt(
				target.getAttribute("data-lightbox-index")!,
				10
			);
			setCurrentIndex(index);
		}
	};

	return (
		<div onClick={handleClick}>
			{children}
			<LightboxDialog
				currentIndex={currentIndex}
				images={images}
				onIndexChange={setCurrentIndex}
			/>
		</div>
	);
}

type NavButtonProps = {
	direction: "prev" | "next";
	onClick: () => void;
	"aria-label": string;
};

function NavButton({
	direction,
	onClick,
	"aria-label": ariaLabel,
}: NavButtonProps) {
	const isPrev = direction === "prev";

	return (
		<button
			aria-label={ariaLabel}
			className={cn(
				"bg-transparent text-gray1 dark:text-gray12",
				"-translate-y-1/2 fixed top-1/2 z-10 grid cursor-pointer",
				"h-[60vh] w-12 place-items-center transition-all md:w-16",
				"active:opacity-75",
				isPrev ? "left-0" : "right-0"
			)}
			onClick={(e) => {
				e.stopPropagation();
				onClick();
			}}
			type="button"
		>
			<ArrowRight className={cn("size-5 md:size-6", isPrev && "rotate-180")} />
		</button>
	);
}
