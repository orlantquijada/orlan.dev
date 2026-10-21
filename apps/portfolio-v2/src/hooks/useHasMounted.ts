import { useEffect, useState } from "react";

// False during SSR and the hydration render, true from the first client
// effect on. Use it to render something different once the client has taken
// over without causing a hydration mismatch.
export function useHasMounted() {
	const [hasMounted, setHasMounted] = useState(false);

	useEffect(() => {
		setHasMounted(true);
	}, []);

	return hasMounted;
}
