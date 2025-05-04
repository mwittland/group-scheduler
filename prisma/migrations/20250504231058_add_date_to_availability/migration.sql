/*
  Warnings:

  - A unique constraint covering the columns `[calendarId,userId,date]` on the table `Availability` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `date` to the `Availability` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Availability" ADD COLUMN     "date" TIMESTAMP(3) NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Availability_calendarId_userId_date_key" ON "Availability"("calendarId", "userId", "date");
