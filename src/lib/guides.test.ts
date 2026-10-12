import { describe, expect, it } from "vitest";
import { extensionGuide, reentryGuide, reportGuide } from "./guides";

// The guides are advice, so every one must say where its information comes from.
describe.each([reportGuide, extensionGuide, reentryGuide])("$title", (guide) => {
  it("has at least one section with content", () => {
    expect(guide.sections.length).toBeGreaterThan(0);
    guide.sections.forEach((section) => expect(section.items.length).toBeGreaterThan(0));
  });

  it("cites at least one source, all over https", () => {
    expect(guide.sources.length).toBeGreaterThan(0);
    guide.sources.forEach((source) => expect(source.href).toMatch(/^https:\/\//));
  });
});
