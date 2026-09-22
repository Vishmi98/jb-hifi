export default function ProductCardSkeleton() {
    return (
        <div className="group shrink-0 w-full border border-gray-200 bg-white flex flex-col justify-between p-2 md:p-3 relative shadow animate-pulse">
            {/* Top Badges & Favorite Heart Skeleton */}
            <div className="flex justify-between items-start mb-2 relative z-10 min-h-[40px]">
                {/* Badges Stack */}
                <div className="flex flex-col gap-1 items-start">
                    <div className="h-5 w-24 bg-gray-200 rounded-sm" />
                    <div className="h-4 w-16 bg-gray-200 rounded-sm" />
                </div>

                {/* Heart Icon Skeleton */}
                <div className="w-5 h-5 bg-gray-200 rounded-full" />
            </div>

            {/* Main Clickable Area Skeleton */}
            <div className="flex-1 flex flex-col justify-between">
                {/* Product Image Skeleton */}
                <div className="w-full h-[130px] md:h-[180px] flex items-center justify-center p-4">
                    <div className="w-full h-full bg-gray-200 rounded" />
                </div>

                {/* Product Info Skeleton */}
                <div className="flex-1 flex flex-col justify-end mt-2">
                    {/* Brand Name */}
                    <div className="h-3 w-16 bg-gray-200 rounded mb-1" />

                    {/* Product Title (2 Lines) */}
                    <div className="space-y-1.5">
                        <div className="h-4 w-full bg-gray-200 rounded" />
                        <div className="h-4 w-2/3 bg-gray-200 rounded" />
                    </div>

                    {/* Ratings Skeleton */}
                    <div className="flex items-center gap-1 my-2">
                        <div className="flex gap-0.5">
                            {[...Array(5)].map((_, i) => (
                                <div key={i} className="w-3.5 h-3.5 bg-gray-200 rounded-full" />
                            ))}
                        </div>
                        <div className="h-3 w-12 bg-gray-200 rounded" />
                    </div>

                    {/* Price Tag Widget Skeleton */}
                    <div className="md:mx-8 my-2 md:my-4 flex flex-col items-center">
                        <div className="border border-gray-200 w-full h-[54px] bg-gray-200 rounded-sm" />
                    </div>
                </div>
            </div>

            {/* Add to Cart Button Skeleton */}
            <div className="w-full h-[42px] bg-gray-200 rounded-none mt-1" />
        </div>
    );
}