import { deleteMemo, updateMemo } from "@/lib/memos";
import { prisma } from "@/lib/prisma";

jest.mock("@/lib/prisma", () => ({
  prisma: {
    memo: {
      update: jest.fn(),
      delete: jest.fn(),
    },
  },
}));

const mockedPrisma = prisma as unknown as {
  memo: { update: jest.Mock; delete: jest.Mock };
};

describe("updateMemo", () => {
  beforeEach(() => {
    mockedPrisma.memo.update.mockReset();
  });

  it("trims inputs and updates the memo", async () => {
    const updated = {
      id: "memo-1",
      title: "Hello",
      content: "Body",
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    mockedPrisma.memo.update.mockResolvedValue(updated);

    await updateMemo({
      id: "memo-1",
      title: "  Hello  ",
      content: "  Body  ",
    });

    expect(mockedPrisma.memo.update).toHaveBeenCalledWith({
      where: { id: "memo-1" },
      data: {
        title: "Hello",
        content: "Body",
      },
    });
  });

  it("throws when title is missing", async () => {
    await expect(
      updateMemo({
        id: "memo-1",
        title: "   ",
        content: "something",
      }),
    ).rejects.toThrow("タイトルは必須です");
  });
});

describe("deleteMemo", () => {
  beforeEach(() => {
    mockedPrisma.memo.delete.mockReset();
  });

  it("throws when id is missing", async () => {
    await expect(deleteMemo(""))
      .rejects.toThrow("メモIDが指定されていません");
  });

  it("removes memo by id", async () => {
    mockedPrisma.memo.delete.mockResolvedValue({ id: "memo-1" });

    await deleteMemo("memo-1");

    expect(mockedPrisma.memo.delete).toHaveBeenCalledWith({
      where: { id: "memo-1" },
    });
  });
});
