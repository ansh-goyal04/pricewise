"use server"

import { revalidatePath } from "next/cache";
import { scrapeProduct } from "../scraper"
import { getAveragePrice, getHighestPrice, getLowestPrice } from "../utils";
import { prisma } from "../../lib/prisma";
import { cache } from "react";
import { generateEmailBody,sendEmail } from "../nodemailer";

// --- SCRAPE & STORE ---
export async function scrapeAndStoreProduct(url: string) {
  if (!url) return;
  try {
    const scrapedProduct = await scrapeProduct(url);
    if (!scrapedProduct) return;

    let existingProduct = await prisma.product.findUnique({
      where: { url: scrapedProduct.url },
      include: { priceHistory: true },
    });

    if (existingProduct) {
      // Add new price record
      const newPriceHistory = await prisma.priceHistory.create({
        data: {
          price: scrapedProduct.currPrice,
          productId: existingProduct.id,
        },
      });

      const allPrices = [...existingProduct.priceHistory, newPriceHistory];
      const allPricesNumber = allPrices.map(p => ({
        ...p,
        price: typeof p.price === "number" ? p.price : Number(p.price),
      }));

      const productUpdateData = {
        currentPrice: scrapedProduct.currPrice,
        lowestPrice: getLowestPrice(allPricesNumber),
        highestPrice: getHighestPrice(allPricesNumber),
        averagePrice: getAveragePrice(allPricesNumber),
        isOutOfStock: scrapedProduct.isOutOfStock,
        discountRate: scrapedProduct.discountRate,
      };

      const updatedProduct = await prisma.product.update({
        where: { id: existingProduct.id },
        data: productUpdateData,
      });

      revalidatePath(`/products/${updatedProduct.id}`);
    } else {
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
          isOutOfStock: scrapedProduct.isOutOfStock,
          priceHistory: {
            create: [{ price: scrapedProduct.currPrice }],
          },
        },
      });

      revalidatePath(`/products/${newProduct.id}`);
    }
  } catch (err: any) {
    throw new Error(`Failed to create/update the product: ${err.message}`);
  }
}

// --- SERVER-CACHED FETCHES ---

// Cache single product by ID
export const getProductById = cache(async (productId: string) => {
  try {
    const product = await prisma.product.findUnique({
      where: { id: productId },
      include: { priceHistory: true ,
        Users:true
      },
      
    });
    return product ?? null;
  } catch (err: any) {
    throw new Error(`Failed to retrieve the product: ${err.message}`);
  }
});

// Cache all products (used in Trending, etc.)
export const getAllProducts = cache(async () => {
  try {
    const products = await prisma.product.findMany({
      include: { priceHistory: true },
    });
    return products ?? [];
  } catch (err: any) {
    throw new Error(`Failed to retrieve products: ${err.message}`);
  }
});

export async function addUserEmailToProduct(productId:string,email:string){
  try {
    const existingProduct=await prisma.product.findUnique({
      where:{id:productId}
    })
    if(!existingProduct){
      throw new Error("Product not found")
    }
    const existingUser=await prisma.user.findUnique({
      where:{email}
    })
    if(!existingUser){
      await prisma.user.create({
        data:{email}
      })
    }
    await prisma.user.update({
      where:{email},
      data:{
        trackingProducts:{
          connect:{id:productId}
        }
      }
    })

    const emailContent=await generateEmailBody(existingProduct,"WELCOME");
    await sendEmail(emailContent,[email]);
  } catch (error) {
    
  }

}