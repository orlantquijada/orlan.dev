import { asMilliseconds, choice, range } from "@repo/utils";
import { useEffect, useState } from "react";

export default function SpriteSheet({
	img,
	imgWidth,
	imgHeight,
	index,
	spriteSize = 16,
}: {
	img: string; // the sprite sheet source
	index: number; // the index of the sprite to display
	imgWidth: number; // the width of the entire sprite sheet in pixels
	imgHeight: number; // the height of the entire sprite sheet in pixels
	spriteSize: number; // the size of each sprite in pixels
	className?: string;
}) {
	const rows = Math.floor(imgHeight / spriteSize);
	const cols = Math.floor(imgWidth / spriteSize);
	const totalSprites = rows * cols;

	const safeIdx = Math.abs(index < totalSprites ? index : index % totalSprites);

	const col = safeIdx % cols;
	const row = Math.floor(safeIdx / cols);

	return (
		<div
			style={{
				backgroundImage: `url(${img})`,
				backgroundRepeat: "no-repeat",
				backgroundPosition: `${shiftBy(col, cols)}% ${shiftBy(row, rows)}%`,
				backgroundSize: `auto ${100 * rows}%`,
				width: "100%",
				height: "100%",
			}}
		/>
	);
}

const shiftBy = (amount: number, totalAmount: number) => {
	// N - 1 because you don't want to shift the last one beyond the edge
	// of the sprite sheet

	// We are counting how many times we can shift before we run out of columns
	return totalAmount > 1 ? (amount / (totalAmount - 1)) * 100 : 0;
};

const DUCK_INDECES = range(7);
const DUCK_SIZE = 40;
const SPRITE_INTERVAL = asMilliseconds({ seconds: 0.5 });

export function DuckSprite() {
	const [index, setIndex] = useState(choice(DUCK_INDECES));

	useEffect(() => {
		const id = setInterval(() => {
			setIndex((prevIndex) =>
				choice(DUCK_INDECES.filter((i) => i !== prevIndex))
			);
		}, SPRITE_INTERVAL);

		return () => {
			clearInterval(id);
		};
	}, []);

	return (
		<div
			className="overflow-clip rounded-full"
			style={{ width: DUCK_SIZE, height: DUCK_SIZE }}
		>
			<SpriteSheet
				img="/no-bg-duck-sprite.png"
				imgHeight={DUCK_SIZE}
				imgWidth={DUCK_INDECES.length * DUCK_SIZE}
				index={index}
				spriteSize={DUCK_SIZE}
			/>
		</div>
	);
}
