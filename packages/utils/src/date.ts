const formatter = new Intl.DateTimeFormat("en-US", {
	year: "numeric",
	month: "short",
	day: "numeric",
});
// Jan 1, 2025
export function formatDate(date: Date) {
	return formatter.format(date);
}
