import { notFound } from 'next/navigation';

import { fetchSeller } from '@/lib/fetchData';
import StoreOverview from '@/modules/store/ui/StoreOverview';


export default async function SellersPage({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params;

    if (!slug) {
        console.log("Store is missing from slug params");
        return notFound();
    }

    const storeData = await fetchSeller(slug);

    if (!storeData) {
        return notFound();
    }

    return (
        <StoreOverview store={storeData} />
    );
}