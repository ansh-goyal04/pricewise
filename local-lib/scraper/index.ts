"use server"

import * as cheerio from 'cheerio';
import { extractCurrency, extractPrice } from '../utils';

export async function scrapeProduct(url: string) {
  if (!url) return null

  const Bright_data_url = String(process.env.BRIGHT_DATA_URL)
  const Bright_data_auth = String(process.env.BRIGHT_DATA_AUTH)

  try {
    const response = await fetch(Bright_data_url, {
      method: "POST",
      headers: {
        Authorization: Bright_data_auth,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        zone: "pricewise",
        url,
        format: "json",
      }),
    })

    if (!response.ok) throw new Error(`BrightData failed: ${response.status}`)

    const data = await response.json()
    const $=cheerio.load(data.body);
    
    const title=$('#productTitle').text().trim()
    const currPrice=extractPrice(
        $('.a-price-whole'),
        $('span.aok-offscreen')
    )
    const origPrice=extractPrice(
        $('#priceblock_ourprice'),
        $('#priceblock_dealprice'),
        $('#priceblock_saleprice'),
        $('.a-text-price .a-offscreen')
    )

    const outOfStock=$('#availability span').text().trim().toLowerCase()==='currently unavailale'

    const images= $('#imgBlkFront').attr('data-a-dynamic-image') || $('#landingImage').attr('data-a-dynamic-image') || '{}'
    const imageUrls=Object.keys(JSON.parse(images))

    const currencyText=extractCurrency($('.a-price-symbol'))
    const discountRate=$('.savingsPercentage').text().replace(/[-%]/g,"")

    const Productdata={
        url,
        currency:currencyText || '₹',
        image:imageUrls[0],
        title,
        currPrice:Number(currPrice),
        origPrice:Number(origPrice),
        priceHistory:[],
        discountRate:Number(discountRate),
        isOutOfStock:outOfStock
    }

    return Productdata;
    
  } catch (error: any) {
    console.error("❌ Error:", error.message)
    throw error
  }
}
