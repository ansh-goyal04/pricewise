"use server"

import { scrapeProduct } from "../scraper"

export async function scrapeAndStoreProduct(url: string) {
  if (!url) return
  try {
    const scrapedProduct = await scrapeProduct(url)
    if(!scrapedProduct) return;
    
  } catch (err: any) {
    throw new Error(`Failed to create/update the product: ${err.message}`)
  }
}
