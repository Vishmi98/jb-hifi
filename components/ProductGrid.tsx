import { Img, Link, Section, Text } from "@react-email/components";
import * as React from "react";

interface Product {
    id: string;
    title: string;
    sku: string;
    startDate?: string;
    endDate?: string;
    imageUrl: string;
    productUrl?: string;
}

const PRODUCTS_DATA: Product[] = [
    {
        id: "1",
        title: 'Dell 15.6" FHD 120Hz Laptop (Ryzen 5) [512GB]',
        sku: "839373",
        endDate: "09/09/26",
        imageUrl: "https://email-jbhifi-com-au-061772552430-ap-southeast-2-an.s3.ap-southeast-2.amazonaws.com/4aef50ed2fdf569eae0299311d3909af.png",
    },
    {
        id: "2",
        title: "Samsung Galaxy S26 Ultra 5G 256GB",
        sku: "884046",
        endDate: "23/09/26",
        imageUrl: "https://email-jbhifi-com-au-061772552430-ap-southeast-2-an.s3.ap-southeast-2.amazonaws.com/c0cf93500f24e6318f9ee7d4fcc1869b.png",
    },
    {
        id: "3",
        title: 'Kindle 11th Gen 6" 16GB',
        sku: "749550",
        startDate: "24/08/2026",
        endDate: "06/09/26",
        imageUrl: "https://email-jbhifi-com-au-061772552430-ap-southeast-2-an.s3.ap-southeast-2.amazonaws.com/48cdd1d337757a832f61527db3b4fd27.png",
    },
    {
        id: "4",
        title: "JBL Flip 6 Portable Bluetooth Speaker",
        sku: "597793",
        endDate: "09/09/26",
        imageUrl: "https://email-jbhifi-com-au-061772552430-ap-southeast-2-an.s3.ap-southeast-2.amazonaws.com/2fb209c0cbf52ac2d0d77aee68ebcb1f.png",
    },
    {
        id: "5",
        title: 'Panasonic 300 Series 3-Blade Electric Wet/Dry Men’s Shaver',
        sku: "888685",
        endDate: "902838",
        imageUrl: "https://email-jbhifi-com-au-061772552430-ap-southeast-2-an.s3.ap-southeast-2.amazonaws.com/ff07147ae1b47a584ebe19fd69b49cbe.png",
    },
    {
        id: "6",
        title: 'Samsung 65" Micro RGB 4K Smart AI TV [2026]',
        sku: "902838",
        endDate: "902838",
        imageUrl: "https://email-jbhifi-com-au-061772552430-ap-southeast-2-an.s3.ap-southeast-2.amazonaws.com/2106cc4c379e2fa4d79173c01c308271.png",
    },
    {
        id: "7",
        title: "Garmin Instinct 2 Solar Sports Watch",
        sku: "572977",
        endDate: "572977",
        imageUrl: "https://email-jbhifi-com-au-061772552430-ap-southeast-2-an.s3.ap-southeast-2.amazonaws.com/821873be96effc63a7311c08423e49e3.png",
    },
    {
        id: "8",
        title: "Shokz Openrun Pro 2",
        sku: "788526",
        endDate: "572977",
        imageUrl: "https://email-jbhifi-com-au-061772552430-ap-southeast-2-an.s3.ap-southeast-2.amazonaws.com/d6faeb7e09bc2bf57c2d81f5c8f948ae.png",
    },
];

interface ProductGridProps {
    products?: Product[];
    siteUrl?: string;
}

export const ProductGrid = ({
    products = PRODUCTS_DATA,
    siteUrl = "https://jb-hifi.vercel.app",
}: ProductGridProps) => {
    // Split items array into pairs for a 2-column layout
    const rows = [];
    for (let i = 0; i < products.length; i += 2) {
        rows.push(products.slice(i, i + 2));
    }

    return (
        <Section className="bg-white p-4">
            {rows.map((pair, rowIndex) => (
                <React.Fragment key={rowIndex}>
                    <table className="w-full border-collapse">
                        <tr>
                            {pair.map((item) => (
                                <td key={item.id} className="w-1/2 align-top px-2 pb-4">
                                    <Link
                                        href={item.productUrl || siteUrl}
                                        target="_blank"
                                        className="no-underline text-black block"
                                        style={{ textDecoration: "none" }}
                                    >
                                        {/* Image */}
                                        <Img
                                            src={item.imageUrl}
                                            alt={item.title}
                                            width="260"
                                            className="w-full h-auto block border-0 my-0 mx-auto"
                                        />

                                        {/* Meta Title & Details */}
                                        <div className="text-center mt-3">
                                            <Text className="m-0 font-extrabold text-[13px] text-black leading-tight h-[32px] overflow-hidden">
                                                {item.title}
                                            </Text>
                                            <table className="w-full text-[10px] text-gray-500 mt-2">
                                                <tr>
                                                    <td className="text-left">SKU: {item.sku}</td>
                                                    <td className="text-right">
                                                        {item.startDate && (
                                                            <div className="block">Started: {item.startDate}</div>
                                                        )}
                                                        {item.endDate && (
                                                            <div className="block">
                                                                Ends:{" "}
                                                                <span className="underline decoration-dashed">
                                                                    {item.endDate}
                                                                </span>
                                                            </div>
                                                        )}
                                                    </td>
                                                </tr>
                                            </table>
                                        </div>
                                    </Link>
                                </td>
                            ))}
                        </tr>
                    </table>

                    {/* HR Divider (exclude after last row) */}
                    {rowIndex < rows.length - 1 && (
                        <div className="h-[1px] w-full bg-gray-200 my-2" />
                    )}
                </React.Fragment>
            ))}
        </Section>
    );
};

export default ProductGrid;