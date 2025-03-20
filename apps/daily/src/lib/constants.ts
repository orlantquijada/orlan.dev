export const BASE_URL =
	process.env.NODE_ENV === "production"
		? "https://daily.orlan.dev"
		: "http://localhost:3000";
