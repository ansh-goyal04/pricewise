"use server"

import { revalidatePath } from "next/cache";
import { scrapeProduct } from "../scraper"
import { getAveragePrice, getHighestPrice, getLowestPrice } from "../utils";
import { prisma } from "../../lib/prisma";
export async function scrapeAndStoreProduct(url: string) {
  if (!url) return;
  try {
    const scrapedProduct = await scrapeProduct(url)
    if(!scrapedProduct) return;

     let existingProduct = await prisma.product.findUnique({
      where: { url: scrapedProduct.url },
      include: {
        priceHistory: true,
      }
    });
    if (existingProduct) {
      // 2. If the product exists, update its price history.
      
      // Create a new price history record with the latest price.
      // This is how you "add" to the priceHistory array in a relational DB.
      const newPriceHistory = await prisma.priceHistory.create({
        data: {
          price: scrapedProduct.currPrice,
          productId: existingProduct.id,
        },
      });

      // Combine the old and new price history for calculations.
      const allPrices = [...existingProduct.priceHistory, newPriceHistory];

      // Convert Decimal price values to numbers for calculations.
      const allPricesNumber: { id: string; price: number; date: Date; productId: string }[] = allPrices.map(p => ({
        ...p,
        price: typeof p.price === "number" ? p.price : Number(p.price)
      }));

      // Prepare the data to update the product document.
      const productUpdateData = {
        currentPrice: scrapedProduct.currPrice,
        lowestPrice: getLowestPrice(allPricesNumber),
        highestPrice: getHighestPrice(allPricesNumber),
        averagePrice: getAveragePrice(allPricesNumber),
        // Update other fields that might change
        isOutOfStock: scrapedProduct.isOutOfStock,
        discountRate: scrapedProduct.discountRate,
      };

      // Update the product in the database.
      const updatedProduct = await prisma.product.update({
        where: { id: existingProduct.id },
        data: productUpdateData,
      })
     revalidatePath(`/products/${updatedProduct.id}`);
    }
else{
     const newProduct = await prisma.product.create({
        data: {
          url: scrapedProduct.url,
          currency: scrapedProduct.currency,
          image: scrapedProduct.image,
          title: scrapedProduct.title,
          currentPrice: scrapedProduct.currPrice,
          originalPrice: scrapedProduct.origPrice,
          lowestPrice: scrapedProduct.currPrice,
          highestPrice: scrapedProduct.currPrice,
          averagePrice: scrapedProduct.currPrice,
          discountRate: scrapedProduct.discountRate,
          // description: scrapedProduct.description,
          isOutOfStock: scrapedProduct.isOutOfStock,
          // Use a nested write to create the product and its first
          // price history record in a single transaction.
          priceHistory: {
            create: [{ price: scrapedProduct.currPrice }],
          },
        },
      });
      revalidatePath(`/products/${newProduct.id}`);
    }
} catch (err: any) {
    throw new Error(`Failed to create/update the product: ${err.message}`)
  }
}

