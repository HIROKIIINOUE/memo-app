import { describe, expect, it, jest } from "@jest/globals";
import type { PrismaClient } from "@prisma/client";
import { checkDatabaseConnection } from "../health";

describe("checkDatabaseConnection", () => {
  it("returns true when the database query succeeds", async () => {
    const queryMock: jest.MockedFunction<() => Promise<void>> = jest.fn(
      async () => undefined,
    );
    const prismaMock = {
      $queryRaw: queryMock,
    } as unknown as PrismaClient;

    await expect(checkDatabaseConnection(prismaMock)).resolves.toBe(true);
    expect(queryMock).toHaveBeenCalledTimes(1);
  });

  it("throws when the database query fails", async () => {
    const queryMock: jest.MockedFunction<() => Promise<void>> = jest.fn(
      async () => {
        throw new Error("boom");
      },
    );
    const prismaMock = {
      $queryRaw: queryMock,
    } as unknown as PrismaClient;

    await expect(checkDatabaseConnection(prismaMock)).rejects.toThrow("boom");
  });
});
