import type { PrismaClient } from "@prisma/client";
import { prisma } from "./prisma";

export async function checkDatabaseConnection(
  client: PrismaClient = prisma,
): Promise<boolean> {
  await client.$queryRaw`SELECT 1`;
  return true;
}
