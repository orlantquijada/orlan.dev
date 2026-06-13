import { afterEach, describe, expect, it, vi } from "vitest";
import {
  getAllLikedDates,
  isValidMonth,
  monthSchema,
  parseKey,
  toKey,
} from "./like";

describe("month schema", () => {
  it("has 12 months with the project's 'febuary' spelling at index 1", () => {
    expect(monthSchema.options).toHaveLength(12);
    expect(monthSchema.options[0]).toBe("january");
    expect(monthSchema.options[1]).toBe("febuary"); // intentional project spelling
    expect(monthSchema.options[11]).toBe("december");
  });

  it("validates membership", () => {
    expect(isValidMonth("febuary")).toBe(true);
    expect(isValidMonth("february")).toBe(false); // the misspelling is canonical here
    expect(isValidMonth("nope")).toBe(false);
  });
});

describe("toKey / parseKey", () => {
  it("round-trips a date through the storage key", () => {
    const key = toKey({ month: "march", day: "5" });
    expect(key).toBe("__daily_/march/5");
    expect(parseKey(key)).toEqual({ month: "march", day: "5" });
  });
});

// getAllLikedDates enumerates via Object.keys(localStorage) + getItem, so the
// seeded keys must be enumerable own-properties (a Map-backed mock is invisible
// to Object.keys). getItem also enumerates, but the `__daily_/` prefix filter
// drops it before the value check runs.
function makeLocalStorage(seed: Record<string, string>): Storage {
  return {
    ...seed,
    getItem: (key: string) => seed[key] ?? null,
  } as unknown as Storage;
}

describe("getAllLikedDates", () => {
  afterEach(() => vi.unstubAllGlobals());

  it("includes liked keys and excludes unliked, malformed, and foreign keys", () => {
    vi.stubGlobal(
      "localStorage",
      makeLocalStorage({
        "__daily_/march/5": "true", // liked  -> included
        "__daily_/march/6": "false", // unliked -> excluded (the bug)
        "__daily_/april/1": "notjson", // malformed -> excluded
        unrelated_key: "true", // foreign -> excluded
      })
    );

    const dates = getAllLikedDates();
    expect(dates).toEqual([{ month: "march", day: "5" }]);
  });

  it("honors the month filter", () => {
    vi.stubGlobal(
      "localStorage",
      makeLocalStorage({
        "__daily_/march/5": "true",
        "__daily_/april/1": "true",
      })
    );
    expect(getAllLikedDates("april")).toEqual([{ month: "april", day: "1" }]);
  });
});
