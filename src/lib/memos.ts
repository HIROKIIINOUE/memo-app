import { prisma } from "@/lib/prisma";
import { TITLE_MAX_LENGTH } from "@/lib/memoRules";

export type MemoInput = {
  title: string;
  content?: string | null;
};

export function validateMemoInput(input: MemoInput) {
  const title = input.title?.trim();
  if (!title) {
    throw new Error("タイトルは必須です");
  }

  if (title.length > TITLE_MAX_LENGTH) {
    throw new Error("タイトルは160文字以内で入力してください");
  }

  const content =
    typeof input.content === "string" ? input.content.trim() : null;

  return {
    title,
    content: content ?? "",
  };
}

export async function createMemo(input: MemoInput) {
  const payload = validateMemoInput(input);

  return prisma.memo.create({
    data: {
      title: payload.title,
      content: payload.content || null,
    },
  });
}
