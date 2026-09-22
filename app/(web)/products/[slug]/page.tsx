import { notFound } from 'next/navigation';

import { fetchProduct } from '@/lib/fetchData';
import ProductOverview from '@/modules/products/ui/ProductOverview';


export default async function ProductPage({
    params,
}: {
    params: Promise<{ slug: string }>;
}) {
    const { slug } = await params;

    if (!slug) {
        return notFound();
    }

    // fetchProduct returns { product, selectedVariant } from the backend API
    const responseData = await fetchProduct(slug);

    if (!responseData || !responseData.product) {
        return notFound();
    }

    return (
        <>
            <ProductOverview
                product={responseData.product}
                initialVariant={responseData.selectedVariant}
                currentSlug={slug}
            />
            <div className="w-[95%] md:w-[90%] mx-auto pt-6">
                <p className='mt-10 text-gray-500'>
                    ^Discounts apply to previous ticketed / advertised price prior to the discount offer. As we negotiate, products will likely
                    have been sold below ticketed / advertised price prior to the discount offer. Prices may differ at airport stores.
                </p>
            </div>
        </>
    );
}