import { Img, Link, Section } from "@react-email/components";
import * as React from "react";

interface Product {
    id: string;
    title: string;
    link: string;
    imageUrl: string;
}

const GIFT_CARDS: Product[] = [
    {
        id: "1",
        title: 'Under 30',
        link: "799256",
        imageUrl: "https://email-jbhifi-com-au-061772552430-ap-southeast-2-an.s3.ap-southeast-2.amazonaws.com/6d5ab0857bec59d817b339a7f57f7ac6.png",
    },
    {
        id: "2",
        title: "Under 50",
        link: "890510",
        imageUrl: "https://email-jbhifi-com-au-061772552430-ap-southeast-2-an.s3.ap-southeast-2.amazonaws.com/f3c83a02ee7b6f1fedd51c20ad515823.png",
    },
    {
        id: "3",
        title: 'Under 100',
        link: "900405",
        imageUrl: "https://email-jbhifi-com-au-061772552430-ap-southeast-2-an.s3.ap-southeast-2.amazonaws.com/5843a54c83eca35d1d3d970855708023.png",
    },
    {
        id: "4",
        title: 'Under 250',
        link: "779935",
        imageUrl: "https://email-jbhifi-com-au-061772552430-ap-southeast-2-an.s3.ap-southeast-2.amazonaws.com/fa490662d3812875fec56b11e1510266.png",
    }
];

interface GiftCardsProps {
    products?: Product[];
    siteUrl?: string;
}

export const GiftCards = ({
    products = GIFT_CARDS,
    siteUrl = "https://jb-hifi.vercel.app",
}: GiftCardsProps) => {
    // Split items array into pairs for a 2-column layout
    const rows = [];
    for (let i = 0; i < products.length; i += 2) {
        rows.push(products.slice(i, i + 2));
    }

    return (
        <Section className="bg-white px-2">
            {rows.map((pair, rowIndex) => (
                <React.Fragment key={rowIndex}>
                    <table className="w-full border-collapse">
                        <tr>
                            {pair.map((item) => (
                                <td key={item.id} className="w-1/2 align-top px-2 py-2">
                                    <Link
                                        href={item.link || siteUrl}
                                        target="_blank"
                                        className="no-underline text-black block"
                                    >
                                        {/* Image */}
                                        <Img
                                            src={item.imageUrl}
                                            alt={item.title}
                                            width="265"
                                            className="w-full h-auto block border-0 my-0 mx-auto"
                                        />
                                    </Link>
                                </td>
                            ))}
                        </tr>
                    </table>
                </React.Fragment>
            ))}
        </Section>
    );
};

export default GiftCards;