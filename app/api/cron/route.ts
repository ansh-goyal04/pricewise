import { scrapeProduct } from "@/local-lib/scraper";
import {prisma} from "../../../lib/prisma";
import {getAveragePrice, getEmailNotifType, getHighestPrice, getLowestPrice} from "@/local-lib/utils";      
import {EmailProductInfo, ProductCard} from "@/local-lib/types";
import { generateEmailBody,sendEmail } from "@/local-lib/nodemailer";
import { NextResponse } from "next/server";
export async function GET(){
    try{
        const products=await prisma.product.findMany({
            include:{
                priceHistory:true,
                Users:true
            }
        });
        if(!products){
            throw new Error("products not found");
        }
        const updatedProducts=await Promise.all(
            products.map(async(currProduct)=>{
                const scrapedProduct=await scrapeProduct(currProduct.url);
                if(!scrapedProduct){
                    throw new Error("scraped product not found");
                }

                const updatedPriceHistory=await prisma.priceHistory.create({
                    data:{
                        price:scrapedProduct.currPrice,
                        productId:currProduct.id,
                    }
                })
                const allPrices = [...currProduct.priceHistory, updatedPriceHistory];
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
                
                      const updatedProduct :ProductCard = await prisma.product.update({
                        where: { id: currProduct.id },
                        data: productUpdateData,
                        include:{
                            priceHistory:true,
                            Users:true
                        }
                      });

                      const emailNotifType= getEmailNotifType(scrapedProduct,currProduct);

                      if(emailNotifType && updatedProduct.Users.length>0){
                        const productInfo:EmailProductInfo={
                            title:updatedProduct.title,
                            url:updatedProduct.url
                        }
                        const emailContent= await generateEmailBody(productInfo,emailNotifType);
                        const userEmail=updatedProduct.Users.map((user)=> user.email)
                        await sendEmail(emailContent,userEmail)
                      }
                      return updatedProduct; 
            })
        )
        return NextResponse.json({
            msg:"OK",
            data:updatedProducts
        });
    }
    catch(err){ 
        throw new Error(`$error in get:${err}`);
    }
}