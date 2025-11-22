export function choice<T>(items: T[]): T {
  if (items.length === 0) {
    throw new Error("Cannot choose from empty list without fallback");
  }
  // biome-ignore lint/style/noNonNullAssertion: length is known
  return items[Math.floor(Math.random() * items.length)]!;
}
