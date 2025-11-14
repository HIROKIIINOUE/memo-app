import { Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { TITLE_MAX_LENGTH } from "@/lib/memoRules";

export type MemoInput = {
  title: string;
  content?: string | null;
};

export type MemoUpdateInput = MemoInput & {
  id: string;
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

export async function updateMemo(input: MemoUpdateInput) {
  const payload = validateMemoInput(input);

  return prisma.memo.update({
    where: { id: input.id },
    data: {
      title: payload.title,
      content: payload.content || null,
    },
  });
}

export type GetMemosParams = {
  searchQuery?: string;
};

export function buildMemoSearchFilter(
  searchQuery?: string,
): Prisma.MemoWhereInput | undefined {
  if (!searchQuery) return undefined;

  const keywords = searchQuery
    .split(/\s+/)
    .map((keyword) => keyword.trim())
    .filter((keyword) => keyword.length > 0);

  if (keywords.length === 0) return undefined;

  return {
    AND: keywords.map((keyword) => ({
      OR: [
        { title: { contains: keyword, mode: "insensitive" } },
        { content: { contains: keyword, mode: "insensitive" } },
      ],
    })),
  } satisfies Prisma.MemoWhereInput;
}

export async function getMemos(params: GetMemosParams = {}) {
  const where = buildMemoSearchFilter(params.searchQuery);

  return prisma.memo.findMany({
    where,
    orderBy: { updatedAt: "desc" },
    select: {
      id: true,
      title: true,
      content: true,
      createdAt: true,
      updatedAt: true,
    },
  });
}

export async function getMemoById(id: string) {
  return prisma.memo.findUnique({
    where: { id },
    select: {
      id: true,
      title: true,
      content: true,
      createdAt: true,
      updatedAt: true,
    },
  });
}

export async function deleteMemo(id: string) {
  if (!id?.trim()) {
    throw new Error("メモIDが指定されていません");
  }

  return prisma.memo.delete({
    where: { id },
  });
}
