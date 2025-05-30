import { cva } from "cva";

export const browserIconButtonStyles = cva(
	"grid aspect-square h-10 place-items-center rounded-full bg-grayA2 text-gray11 opacity-0 transition-all duration-300 hover:bg-grayA3 hover:duration-150 dark:bg-gray12 dark:text-gray9",
);
