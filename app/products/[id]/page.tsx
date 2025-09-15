"use client";

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { AspectRatio } from "@/components/ui/aspect-ratio"
import { Star, ShoppingCart, ExternalLink, TrendingUp } from "lucide-react"
import { Card as AppleCard } from "@/components/ui/apple-cards-carousel"
import { useEffect, useState } from "react"
import { useParams } from 'next/navigation';
import { getProductById } from "@/local-lib/actions";
import Modal from "@/local-comp/Modal";

interface ProductCard {
  id: string;
  url: string;
  currency: string;
  image: string;
  title: string;
  currentPrice: number;
  originalPrice: number;
  discountRate: number | null;
  description?: string | null;
  rating?: number | null;
  reviewCount?: number | null;
  averagePrice?: number | null;
  category?: string | null;
  isOutOfStock?: boolean;
  priceHistory: Array<{
    id: string;
    price: number;
    date: Date;
    productId: string;
  }>;
  createdAt: Date;
  updatedAt: Date;
}

export default function ProductDisplay() {
  const params = useParams();
  const [product, setProduct] = useState<ProductCard | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        if (!params.id) {
          throw new Error('Product ID is missing');
        }
        const data = await getProductById(params.id.toString());
        setProduct(data);
      } catch (err) {
        setError("Failed to load product. Please try again later.");
        console.error("Error fetching product:", err);
      } finally {
        setLoading(false);
      }
    };

    if (params.id) {
      fetchProduct();
    }
  }, [params.id]);

  if (loading) {
    return <div className="flex justify-center items-center min-h-[50vh]">Loading product details...</div>;
  }

  if (error) {
    return <div className="text-red-500 text-center p-4">{error}</div>;
  }

  if (!product) {
    return <div className="text-center p-4">Product not found</div>;
  }

  const savings = product.originalPrice - product.currentPrice;

  return (
    <div className="max-w-6xl mx-auto">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
        {/* Product Image Section */}
        <div className="space-y-4">
          <Card className="overflow-hidden border-0 shadow-lg">
            <AspectRatio ratio={1}>
              <img
                src={product.image || "/placeholder.svg"}
                alt={product.title}
                className="object-cover w-full h-full rounded-lg"
              />
            </AspectRatio>
          </Card>

          {/* Additional product images could go here */}
          {/* <div className="grid grid-cols-4 gap-2">
            {[1, 2, 3, 4].map((i) => (
              <AspectRatio key={i} ratio={1}>
                <img
                  src={`/headphones-angle.png?height=100&width=100&query=headphones angle ${i}`}
                  alt={`Product view ${i}`}
                  className="object-cover w-full h-full rounded-md border-2 border-transparent hover:border-primary cursor-pointer transition-colors"
                />
              </AspectRatio>
            ))}
          </div> */}
        </div>

        {/* Product Information Section */}
        <div className="space-y-6">
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Badge variant="secondary" className="bg-primary/10 text-primary hover:bg-primary/20">
                Best Seller
              </Badge>
              {/* <Badge variant="outline" className="border-accent text-accent">
                Free Shipping
              </Badge> */}
            </div>

            <h1 className="text-3xl lg:text-4xl font-bold text-foreground text-balance">{product.title}</h1>

            {/* Rating */}
            <div className="flex items-center gap-2">
              <div className="flex items-center">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`w-5 h-5 ${
                      i < Math.floor(product.rating || 0) ? "fill-yellow-400 text-yellow-400" : "text-muted-foreground"
                    }`}
                  />
                ))}
              </div>
              <span className="text-sm text-muted-foreground">
                {product.rating ? `${product.rating}` : 'No rating'} ({product.reviewCount ? product.reviewCount.toLocaleString() : '0'} reviews)
              </span>
            </div>
          </div>

          <Separator />

          {/* Pricing Section */}
          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <span className="text-3xl font-bold text-primary">${product.currentPrice}</span>
                <Badge variant="destructive" className="text-sm font-semibold">
                  -{product.discountRate}%
                </Badge>
              </div>
            </div>

            <div className="flex items-center gap-4 text-sm">
              <span className="text-muted-foreground line-through">Was ${product.originalPrice}</span>
              <span className="text-green-600 font-medium">You save ${savings.toFixed(2)}</span>
            </div>

            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <TrendingUp className="w-4 h-4" />
              <span>Average market price: ${product.averagePrice}</span>
            </div>
          </div>

          <Separator />

          {/* Product Description */}
          {/* <div className="space-y-3">
            <h3 className="text-lg font-semibold text-foreground">Description</h3>
            <p className="text-muted-foreground leading-relaxed text-pretty">{product.description}</p>
          </div> */}

          {/* Key Features */}
          {/* <div className="space-y-3">
            <h3 className="text-lg font-semibold text-foreground">Key Features</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 bg-primary rounded-full" />
                Active Noise Cancellation Technology
              </li>
              <li className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 bg-primary rounded-full" />
                30-Hour Battery Life with Quick Charge
              </li>
              <li className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 bg-primary rounded-full" />
                Premium Comfort Padding
              </li>
              <li className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 bg-primary rounded-full" />
                Universal Compatibility
              </li>
            </ul>
          </div> */}

          <Separator />

          {/* Action Buttons */}
          {/* <div className="space-y-4"> */}
              <div className="flex flex-col sm:flex-row gap-3 mb-10">
              {/* <Button size="lg" className="flex-1 text-lg font-semibold"> */}
                <Modal/>
              {/* </Button>  */}
              {/* <Button size="lg" variant="outline" className="flex-1 bg-transparent">
                Buy Now
              </Button>
            </div> */} 

            <Button variant="link" className="w-full text-primary hover:underline" asChild>
              <a href={product.url} target="_blank" rel="noopener noreferrer">
                <ExternalLink className="w-4 h-4 mr-2" />
                View on Original Store
              </a>
            </Button>
          </div>

          {/* Trust Indicators */}
          {/* <Card className="bg-muted/30 border-muted">
            <CardContent className="pt-6">
              <div className="grid grid-cols-3 gap-4">
                <div className="flex items-center gap-1">
                  <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                  <span className="font-medium">{product.rating}</span>
                  <span className="text-muted-foreground">
                    ({product.reviewCount ? `${product.reviewCount} reviews` : 'No reviews'})
                  </span>
                </div>
                <div className="space-y-1 text-center">
                  <div className="text-2xl">🔒</div>
                  <p className="text-xs text-muted-foreground">Secure Payment</p>
                </div>
                <div className="space-y-1 text-center">
                  <div className="text-2xl">↩️</div>
                  <p className="text-xs text-muted-foreground">30-Day Returns</p>
                </div>
              </div>
            </CardContent>
          </Card> */}
        </div>
      </div>
    </div>
  )
}
