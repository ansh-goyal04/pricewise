"use client";

import React, { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Carousel, Card } from "@/components/ui/apple-cards-carousel";
import { getAllProducts } from "@/local-lib/actions";

interface ProductCard {
  id: string;
  title: string;
  image: string;
  currentPrice: number;
  originalPrice: number;
  discountRate?: number;
  category?: string;
  content?: React.ReactNode;
}

export default function Trending() {
  const router = useRouter();
  const [products, setProducts] = useState<ProductCard[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [cards, setCards] = useState<React.ReactElement[]>([]);

  const handleCardClick = useCallback((productId: string) => {
    router.push(`/products/${productId}`);
  }, [router]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const data = await getAllProducts();
        if (data) {
          const formattedProducts = data.slice(0, 6).map(product => ({
            id: product.id,
            title: product.title,
            image: product.image,
            currentPrice: Number(product.currentPrice),
            originalPrice: Number(product.originalPrice),
            discountRate: product.discountRate ? Number(product.discountRate) : 0,
            category: "Trending"
          }));
          setProducts(formattedProducts);

          // Generate cards here after products are set
          const productCards = formattedProducts.map((product, index) => (
            <div 
              key={product.id}
              onClick={() => handleCardClick(product.id)}
              className="cursor-pointer"
            >
              <Card 
                card={{
                  title: product.title.length > 30 ? `${product.title.substring(0, 30)}...` : product.title,
                  src: product.image,
                  category: product.category || "Product",
                  content: (
                    <div className="p-4">
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-lg font-semibold">${product.currentPrice.toFixed(2)}</span>
                        {(product.discountRate ?? 0) > 0 && (
                          <span className="bg-red-100 text-red-800 text-xs font-medium px-2.5 py-0.5 rounded">
                            {product.discountRate}% OFF
                          </span>
                        )}
                      </div>
                      {product.originalPrice > product.currentPrice && (
                        <p className="text-sm text-gray-500 line-through">${product.originalPrice.toFixed(2)}</p>
                      )}
                    </div>
                  )
                }}
                index={index}
              />
            </div>
          ));
          setCards(productCards);
        }
      } catch (err) {
        console.error("Error fetching products:", err);
        setError("Failed to load products. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [handleCardClick]);

  if (loading) {
    return (
      <div className="w-full h-full py-20 flex justify-center items-center">
        <p>Loading trending products...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full h-full py-20 flex justify-center items-center">
        <p className="text-red-500">{error}</p>
      </div>
    );
  }

  return (
    <div className="w-full h-full py-12">
      <h2 className="max-w-7xl px-4 mx-auto text-2xl md:text-4xl font-bold text-neutral-800 dark:text-neutral-200 mb-8">
        Trending Deals
      </h2>
      {products.length > 0 ? (
        <Carousel items={cards} />
      ) : (
        <div className="text-center py-12">
          <p className="text-gray-500">No trending products found.</p>
        </div>
      )}
    </div>
  );
}
