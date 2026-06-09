/*
  Warnings:

  - A unique constraint covering the columns `[hashedIdentifier]` on the table `OtpVerification` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "OtpVerification_hashedIdentifier_key" ON "OtpVerification"("hashedIdentifier");
