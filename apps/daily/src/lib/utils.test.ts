import { afterEach, describe, expect, it, vi } from "vitest";
import { capitalize, getDailyDateToday } from "./utils";

afterEach(() => {
  vi.useRealTimers();
});

describe("capitalize", () => {
  it("uppercases the first character", () => {
    expect(capitalize("march")).toBe("March");
  });
});

describe("getDailyDateToday", () => {
  it("returns the project month name + day for a normal month (Manila tz)", () => {
    // 2026-06-13 14:00 Manila (UTC+8) => June 13
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2026-06-13T06:00:00.000Z"));
    expect(getDailyDateToday()).toEqual({ month: "june", day: "13" });
  });

  it("uses the project's 'febuary' spelling in February (regression)", () => {
    // 2026-02-15 14:00 Manila (UTC+8) => Feb 15
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2026-02-15T06:00:00.000Z"));
    expect(getDailyDateToday()).toEqual({ month: "febuary", day: "15" });
  });

  it("returns december for a December date", () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2026-12-25T06:00:00.000Z"));
    expect(getDailyDateToday()).toEqual({ month: "december", day: "25" });
  });
});
