import { describe, expect, it } from "vitest";
import { shouldSuggestHomeScreen } from "./device";

const iPhone = "Mozilla/5.0 (iPhone; CPU iPhone OS 18_0 like Mac OS X) AppleWebKit/605.1.15 Version/18.0 Mobile/15E148 Safari/604.1";
const iPadAsMac = "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 Version/18.0 Safari/605.1.15";
const android = "Mozilla/5.0 (Linux; Android 15; Pixel 9) AppleWebKit/537.36 Chrome/140.0 Mobile Safari/537.36";
const windows = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/140.0 Safari/537.36";

describe("shouldSuggestHomeScreen", () => {
  it("suggests it on an iPhone browser", () => {
    expect(shouldSuggestHomeScreen({ userAgent: iPhone, maxTouchPoints: 5, standalone: false })).toBe(true);
  });

  it("suggests it on an iPad, which reports itself as a Mac with a touch screen", () => {
    expect(shouldSuggestHomeScreen({ userAgent: iPadAsMac, maxTouchPoints: 5, standalone: false })).toBe(true);
  });

  it("does not suggest it once opened from the Home Screen", () => {
    expect(shouldSuggestHomeScreen({ userAgent: iPhone, maxTouchPoints: 5, standalone: true })).toBe(false);
  });

  it.each([
    ["a real Mac", iPadAsMac, 0],
    ["Android", android, 5],
    ["Windows", windows, 0],
  ])("does not suggest it on %s", (_name, userAgent, maxTouchPoints) => {
    expect(shouldSuggestHomeScreen({ userAgent, maxTouchPoints, standalone: false })).toBe(false);
  });
});
