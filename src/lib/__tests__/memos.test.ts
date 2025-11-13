import { describe, expect, it } from "@jest/globals";
import { validateMemoInput } from "../memos";

describe("validateMemoInput", () => {
  it("トリム済みのデータを返す", () => {
    const payload = validateMemoInput({
      title: "  新しいメモ ",
      content: "  # Hello \n",
    });

    expect(payload).toEqual({
      title: "新しいメモ",
      content: "# Hello",
    });
  });

  it("タイトルが空ならエラーになる", () => {
    expect(() =>
      validateMemoInput({
        title: "   ",
        content: "",
      }),
    ).toThrow("タイトルは必須です");
  });

  it("タイトルが160文字を超えるとエラーになる", () => {
    const longTitle = "a".repeat(161);
    expect(() =>
      validateMemoInput({
        title: longTitle,
        content: "",
      }),
    ).toThrow("タイトルは160文字以内で入力してください");
  });
});
