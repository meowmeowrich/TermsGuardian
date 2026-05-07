-- CreateTable
CREATE TABLE "Analysis" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "title" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "summary" TEXT,
    "privacyScore" INTEGER,
    "dangerScore" INTEGER,
    "friendlinessScore" INTEGER,
    "riskAnalysis" TEXT,
    "fullResponse" TEXT,
    "sourceUrl" TEXT,
    "sourceType" TEXT NOT NULL,
    "userId" TEXT,
    CONSTRAINT "Analysis_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "email" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateIndex
CREATE INDEX "Analysis_userId_idx" ON "Analysis"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");
