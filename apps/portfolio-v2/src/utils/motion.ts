export const transitions = {
	bounce: {
		type: "spring",
		stiffness: 260,
		damping: 10,
	},
	soft: {
		type: "spring",
		stiffness: 100,
		damping: 30,
	},
	snappy: {
		type: "spring",
		stiffness: 200,
		damping: 30,
	},
	tactile: { type: "spring", duration: 0.4, bounce: 0.1 },
	punchy: { type: "spring", duration: 0.3, bounce: 0.1 },
};
