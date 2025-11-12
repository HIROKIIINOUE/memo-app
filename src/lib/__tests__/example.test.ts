import { describe, expect, it } from "@jest/globals";
import { formatMemoCount } from "../example";

describe("formatMemoCount", () => {
  it("handles zero or negative counts", () => {
    expect(formatMemoCount(0)).toBe("No memos yet");
    expect(formatMemoCount(-3)).toBe("No memos yet");
  });

  it("handles singular count", () => {
    expect(formatMemoCount(1)).toBe("1 memo");
  });

  it("handles plural counts", () => {
    expect(formatMemoCount(5)).toBe("5 memos");
  });
});
