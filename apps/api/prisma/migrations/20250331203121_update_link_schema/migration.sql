/*
  Warnings:

  - You are about to drop the column `isActive` on the `Link` table. All the data in the column will be lost.
  - You are about to drop the `CTA` table. If the table is not empty, all the data it contains will be lost.

*/
-- CreateEnum
CREATE TYPE "CtaPosition" AS ENUM ('TOP_LEFT', 'TOP_RIGHT', 'BOTTOM_LEFT', 'BOTTOM_RIGHT', 'CENTER');

-- DropForeignKey
ALTER TABLE "CTA" DROP CONSTRAINT "CTA_linkId_fkey";

-- DropForeignKey
ALTER TABLE "Link" DROP CONSTRAINT "Link_userId_fkey";

-- DropIndex
DROP INDEX "Click_createdAt_idx";

-- DropIndex
DROP INDEX "Click_linkId_idx";

-- DropIndex
DROP INDEX "Link_userId_idx";

-- AlterTable
ALTER TABLE "Link" DROP COLUMN "isActive";

-- DropTable
DROP TABLE "CTA";

-- CreateTable
CREATE TABLE "CtaOverlay" (
    "id" TEXT NOT NULL,
    "message" TEXT NOT NULL,
    "buttonText" TEXT NOT NULL,
    "buttonUrl" TEXT NOT NULL,
    "position" "CtaPosition" NOT NULL,
    "color" TEXT NOT NULL,
    "linkId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "CtaOverlay_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "CtaOverlay_linkId_key" ON "CtaOverlay"("linkId");

-- AddForeignKey
ALTER TABLE "Link" ADD CONSTRAINT "Link_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CtaOverlay" ADD CONSTRAINT "CtaOverlay_linkId_fkey" FOREIGN KEY ("linkId") REFERENCES "Link"("id") ON DELETE CASCADE ON UPDATE CASCADE;
