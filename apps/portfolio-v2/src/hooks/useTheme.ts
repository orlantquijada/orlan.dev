import { useState } from "react";

import { useIsomorphicLayoutEffect } from "@/lib/general";
import {
	type ThemeKeys,
	setTheme as _setTheme,
	toggleTheme as _toggleTheme,
	getTheme,
} from "@/lib/theme-toggle";

// NOTE: dead code
export function useTheme() {
	const [loading, setLoading] = useState(true);
	const [theme, setTheme] = useState<ThemeKeys>();

	useIsomorphicLayoutEffect(() => {
		setTheme(getTheme());

		setLoading(false);
	}, []);

	function handletoggleTheme() {
		_toggleTheme();
		setTheme(theme === "dark" ? "light" : "dark");
	}

	function handleSetTheme(theme: ThemeKeys) {
		_setTheme(theme);
		setTheme(theme);
	}

	const fns = {
		setTheme: handleSetTheme,
		toggleTheme: handletoggleTheme,
	};

	if (loading) return { loading: true, theme: undefined, ...fns } as const;
	return { loading: false, theme: theme as ThemeKeys, ...fns } as const;
}
