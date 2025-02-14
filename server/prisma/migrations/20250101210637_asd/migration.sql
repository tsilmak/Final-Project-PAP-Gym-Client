/*
  Warnings:

  - You are about to drop the column `seen` on the `Message` table. All the data in the column will be lost.
  - You are about to drop the column `lastSeen` on the `User` table. All the data in the column will be lost.
  - Added the required column `userWhoCreatedConversation` to the `Conversation` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Conversation" ADD COLUMN     "userWhoCreatedConversation" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "Message" DROP COLUMN "seen",
ADD COLUMN     "cloudinaryImagePublicId" TEXT,
ADD COLUMN     "cloudinaryVideoPublicId" TEXT;

-- AlterTable
ALTER TABLE "User" DROP COLUMN "lastSeen";
