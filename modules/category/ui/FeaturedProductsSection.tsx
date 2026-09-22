"use client";

import React, { useEffect, useState } from "react";

import { ProductDataType } from "@/modules/products/products.types";
import { getProductsByCategory } from "@/modules/products/products.service";
import ProductCard from "@/modules/products/ui/ProductCard";
import ProductCardSkeleton from "@/modules/products/ui/ProductCardSkeleton";


interface FeaturedProductsSectionProps {
    categoryId: number;
}

const FeaturedProductsSection = ({ categoryId }: FeaturedProductsSectionProps) => {
    const [products, setProducts] = useState<ProductDataType[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchFeaturedProducts = async () => {
            try {
                setLoading(true);
                setError(null);

                // Fetch top 4 items for the category grid
                const response = await getProductsByCategory(1, 4, categoryId);

                if (response.success) {
                    setProducts(response.products);
                } else {
                    setError(response.message || "Failed to fetch products.");
                }
            } catch (err) {
                setError("An error occurred while fetching products.");
                console.error("Error fetching category products:", err);
            } finally {
                setLoading(false);
            }
        };

        if (categoryId) {
            fetchFeaturedProducts();
        }
    }, [categoryId]);

    // Loading State using ProductCardSkeleton
    if (loading) {
        return (
            <section className="my-12">
                <h2 className="jb-callout-logo text-xl md:text-2xl font-bold mb-3">
                    Featured
                </h2>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-2 md:gap-4 justify-items-center">
                    {Array.from({ length: 4 }).map((_, index) => (
                        <ProductCardSkeleton key={index} />
                    ))}
                </div>
            </section>
        );
    }

    // Return nothing if there's an error or no products available
    if (error || !products || products.length === 0) {
        return null;
    }

    return (
        <section className="my-12">
            <h2 className="jb-callout-logo text-xl md:text-2xl font-bold mb-3">
                Featured
            </h2>

            <div
                className="grid grid-cols-2 md:grid-cols-4 gap-2 md:gap-4 justify-items-center"
                style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
            >
                {products.flatMap((prod) =>
                    prod.variants && prod.variants.length > 0
                        ? prod.variants.map((variant) => (
                            <ProductCard
                                key={`${prod.id}-${variant.id}`}
                                prod={prod}
                                variant={variant}
                            />
                        ))
                        : [
                            <ProductCard
                                key={prod.id}
                                prod={prod}
                            />
                        ]
                )}
            </div>
        </section>
    );
};

export default FeaturedProductsSection;