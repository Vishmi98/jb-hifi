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
        title: 'Swann MaxRanger V2 Security Camera Kit (6 Pack)',
        sku: "799256",
        endDate: "09/09/26",
        imageUrl: "https://email-jbhifi-com-au-061772552430-ap-southeast-2-an.s3.ap-southeast-2.amazonaws.com/d391228ceac2857917b0fab1f2f6472e.png",
    },
    {
        id: "2",
        title: "MOVA P70 Pro Ultra Wet and Dry Vacuum",
        sku: "890510",
        endDate: "23/09/26",
        imageUrl: "https://email-jbhifi-com-au-061772552430-ap-southeast-2-an.s3.ap-southeast-2.amazonaws.com/a1ba6cddfee7df7b7378d00553bb435d.png",
    },
    {
        id: "3",
        title: 'HONOR 600 Pro 5G 512GB',
        sku: "900405",
        endDate: "06/09/26",
        imageUrl: "https://email-jbhifi-com-au-061772552430-ap-southeast-2-an.s3.ap-southeast-2.amazonaws.com/d6d83aacfa3d269d565daaec1619a496.png",
    },
    {
        id: "4",
        title: 'Skylight 15" Smart Family Calendar',
        sku: "779935",
        endDate: "09/09/26",
        imageUrl: "https://email-jbhifi-com-au-061772552430-ap-southeast-2-an.s3.ap-southeast-2.amazonaws.com/ff60b9f4fc8fa0435916beb14b35eef3.png",
    }
];

interface ProductGridProps {
    products?: Product[];
    siteUrl?: string;
}

export const ProductGrid2 = ({
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
                                        style={{ textDecoration: "none" }}
                                        className="no-underline text-black block"
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

export default ProductGrid2;