-- CreateTable
CREATE TABLE "Memo" (
    "id" TEXT NOT NULL,
    "title" VARCHAR(160) NOT NULL,
    "content" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Memo_pkey" PRIMARY KEY ("id")
);
