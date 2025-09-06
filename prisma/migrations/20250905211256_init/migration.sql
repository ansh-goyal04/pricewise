-- CreateTable
CREATE TABLE "public"."Product" (
    "id" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "currency" TEXT NOT NULL,
    "image" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "currentPrice" DECIMAL(65,30) NOT NULL,
    "originalPrice" DECIMAL(65,30) NOT NULL,
    "lowestPrice" DECIMAL(65,30),
    "highestPrice" DECIMAL(65,30),
    "averagePrice" DECIMAL(65,30),
    "discountRate" DECIMAL(65,30),
    "description" TEXT,
    "isOutOfStock" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Product_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."PriceHistory" (
    "id" TEXT NOT NULL,
    "price" DECIMAL(65,30) NOT NULL,
    "date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "productId" TEXT NOT NULL,

    CONSTRAINT "PriceHistory_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Product_url_key" ON "public"."Product"("url");

-- CreateIndex
CREATE INDEX "PriceHistory_productId_idx" ON "public"."PriceHistory"("productId");

-- AddForeignKey
ALTER TABLE "public"."PriceHistory" ADD CONSTRAINT "PriceHistory_productId_fkey" FOREIGN KEY ("productId") REFERENCES "public"."Product"("id") ON DELETE CASCADE ON UPDATE CASCADE;
