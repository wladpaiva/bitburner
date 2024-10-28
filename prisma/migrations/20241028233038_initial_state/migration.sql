-- CreateTable
CREATE TABLE "Invoice" (
    "id" TEXT NOT NULL,
    "paymentHash" TEXT NOT NULL,
    "paymentRequest" TEXT NOT NULL,
    "refundLnAddress" TEXT,
    "pixKey" TEXT NOT NULL,
    "pixType" TEXT NOT NULL,
    "amountFiat" INTEGER NOT NULL,
    "amountSats" INTEGER NOT NULL,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "pixTransactionId" TEXT,
    "lightningSettledAt" TIMESTAMP(3),
    "pixPaidAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Invoice_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "BurnerWallet" (
    "id" TEXT NOT NULL,
    "username" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "adminKey" TEXT NOT NULL,
    "invoiceKey" TEXT NOT NULL,
    "balanceMsat" INTEGER NOT NULL,
    "userId" TEXT NOT NULL,
    "currency" TEXT,
    "deleted" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "BurnerWallet_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Invoice_paymentHash_key" ON "Invoice"("paymentHash");

-- CreateIndex
CREATE UNIQUE INDEX "Invoice_pixTransactionId_key" ON "Invoice"("pixTransactionId");

-- CreateIndex
CREATE UNIQUE INDEX "BurnerWallet_username_key" ON "BurnerWallet"("username");
