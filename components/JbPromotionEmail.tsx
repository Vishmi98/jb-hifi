import {
    Body,
    Container,
    Head,
    Html,
    Img,
    Link,
    Preview,
    Section,
    Text,
    Tailwind,
    Row,
    Column,
} from "@react-email/components";
import * as React from "react";

import ProductGrid from "./ProductGrid";
import { ProductGrid2 } from "./ProductGrid2";
import GiftCards from "./GiftCards";
import EmailFooterSection from "./EmailFooterSection";


interface JbPromotionEmailProps {
    siteUrl?: string;
}

export const JbPromotionEmail = ({
    siteUrl = "https://jb-hifi.vercel.app",
}: JbPromotionEmailProps) => {
    return (
        <Html>
            <Head />
            <Preview>DEALS FOR DAD! 🎁 Huge Savings on Tech, TVs & More</Preview>
            {/* 1. Define custom Tailwind config directly in the provider */}
            <Tailwind
                config={{
                    theme: {
                        extend: {
                            colors: {
                                "jb-yellow": "#ffec0f",
                                "jb-red": "#e02020",
                            },
                        },
                    },
                }}
            >
                <Body className="bg-jb-yellow my-auto mx-auto font-sans">
                    <Container className="border-0 my-0 mx-auto p-0 w-full max-w-[600px] bg-white">

                        {/* TOP BRAND HEADER */}
                        <Section className="py-[10px] px-3 sm:px-5 w-full bg-jb-yellow">
                            <Row className="w-full">
                                <Column align="left" className="w-1/2 align-middle pr-1 sm:pr-2">
                                    <Link href={siteUrl} target="_blank" style={{ textDecoration: "none" }}>
                                        <Img
                                            src={`${siteUrl}/logo1.png`}
                                            alt="JB Hi-Fi"
                                            width="150"
                                            className="block border-0 w-full max-w-[150px] h-auto"
                                        />
                                    </Link>
                                </Column>
                                <Column align="right" className="w-1/2 align-middle pl-1 sm:pl-2">
                                    <Link href={siteUrl} target="_blank" style={{ textDecoration: "none" }}>
                                        <Img
                                            src="https://email-jbhifi-com-au-061772552430-ap-southeast-2-an.s3.ap-southeast-2.amazonaws.com/4e34b6703fd19d2e388a19dd3ab64bcd.png"
                                            alt="ALWAYS CHEAP PRICES!"
                                            width="150"
                                            className="block border-0 w-full max-w-[150px] h-auto ml-auto"
                                        />
                                    </Link>
                                </Column>
                            </Row>
                        </Section>

                        {/* BLACK SUB-NAV */}
                        <Section className="bg-black py-[12px] px-2 sm:px-5 w-full">
                            <Row className="w-full text-center">
                                <Column align="left" className="w-1/3 align-middle">
                                    <Link
                                        href={siteUrl}
                                        style={{ textDecoration: "none" }}
                                        className="text-white font-bold text-[11px] sm:text-[13px] block leading-none"
                                    >
                                        Hottest Deals
                                    </Link>
                                </Column>
                                <Column align="center" className="w-1/3 align-middle">
                                    <Link
                                        href={siteUrl}
                                        style={{ textDecoration: "none" }}
                                        className="text-white font-bold text-[11px] sm:text-[13px] block leading-none"
                                    >
                                        JB Perks
                                    </Link>
                                </Column>
                                <Column align="right" className="w-1/3 align-middle">
                                    <Link
                                        href={siteUrl}
                                        style={{ textDecoration: "none" }}
                                        className="text-white font-bold text-[11px] sm:text-[13px] block leading-none"
                                    >
                                        New
                                    </Link>
                                </Column>
                            </Row>
                        </Section>

                        {/* HERO BANNER IMAGE */}
                        <Section className="w-full bg-jb-red text-center">
                            <Link href={siteUrl} target="_blank" className="block w-full">
                                {/* 3. Ensure this file exists in your Vercel public directory */}
                                <Img
                                    src={`https://email-jbhifi-com-au-061772552430-ap-southeast-2-an.s3.ap-southeast-2.amazonaws.com/e4a43942b9d8c5bcbd6acf36b2f007d8.png`}
                                    alt="DEALS FOR DAD! Shop now"
                                    width="600"
                                    className="w-full h-auto block border-0 mx-auto"
                                />
                            </Link>
                        </Section>

                        {/* PRODUCTS */}
                        <ProductGrid />

                        <Section className="w-full text-center">
                            <Link href={siteUrl} target="_blank" className="block w-full">
                                {/* 3. Ensure this file exists in your Vercel public directory */}
                                <Img
                                    src={`https://email-jbhifi-com-au-061772552430-ap-southeast-2-an.s3.ap-southeast-2.amazonaws.com/08c7c8cb369dfbbe2a74a0de346c5ff1.jpg`}
                                    alt="DEALS FOR DAD! Shop now"
                                    width="600"
                                    className="w-full h-auto block border-0 mx-auto"
                                />
                            </Link>
                        </Section>
                        <Section className="w-full text-center">
                            <Link href={siteUrl} target="_blank" className="block w-full">
                                {/* 3. Ensure this file exists in your Vercel public directory */}
                                <Img
                                    src={`https://email-jbhifi-com-au-061772552430-ap-southeast-2-an.s3.ap-southeast-2.amazonaws.com/29a0f2c8c79b3812269f51cb655b4cf5.png`}
                                    alt="DEALS FOR DAD! Shop now"
                                    width="600"
                                    className="w-full h-auto block border-0 mx-auto"
                                />
                            </Link>
                        </Section>
                        <Section className="w-full text-center">
                            <Link href={siteUrl} target="_blank" className="block w-full">
                                {/* 3. Ensure this file exists in your Vercel public directory */}
                                <Img
                                    src={`https://email-jbhifi-com-au-061772552430-ap-southeast-2-an.s3.ap-southeast-2.amazonaws.com/4eca03c14f08a3779438c7aa994b6fa7.jpg`}
                                    alt="DEALS FOR DAD! Shop now"
                                    width="600"
                                    className="w-full h-auto block border-0 mx-auto"
                                />
                            </Link>
                        </Section>
                        <Section className="w-full text-center">
                            <Link href={siteUrl} target="_blank" className="block w-full">
                                {/* 3. Ensure this file exists in your Vercel public directory */}
                                <Img
                                    src={`https://email-jbhifi-com-au-061772552430-ap-southeast-2-an.s3.ap-southeast-2.amazonaws.com/21876b2f975b3eb010d7a67a52135ad2.jpg`}
                                    alt="DEALS FOR DAD! Shop now"
                                    width="600"
                                    className="w-full h-auto block border-0 mx-auto"
                                />
                            </Link>
                        </Section>

                        <ProductGrid2 />

                        <Section className="w-full text-center">
                            <Link href={siteUrl} target="_blank" className="block w-full">
                                {/* 3. Ensure this file exists in your Vercel public directory */}
                                <Img
                                    src={`https://email-jbhifi-com-au-061772552430-ap-southeast-2-an.s3.ap-southeast-2.amazonaws.com/4a29749b32d3865b1dfdd2bbc2f3343c.jpg`}
                                    alt="DEALS FOR DAD! Shop now"
                                    width="600"
                                    className="w-full h-auto block border-0 mx-auto"
                                />
                            </Link>
                        </Section>

                        <GiftCards />

                        <Section className="w-full text-center">
                            <Link href={siteUrl} target="_blank" className="block w-full">
                                {/* 3. Ensure this file exists in your Vercel public directory */}
                                <Img
                                    src={`https://email-jbhifi-com-au-061772552430-ap-southeast-2-an.s3.ap-southeast-2.amazonaws.com/6279746703904be6ddb55264074b45aa.jpg`}
                                    alt="DEALS FOR DAD! Shop now"
                                    width="600"
                                    className="w-full h-auto block border-0 mx-auto"
                                />
                            </Link>
                        </Section>
                        <Section className="w-full text-center">
                            <Link href={siteUrl} target="_blank" className="block w-full">
                                {/* 3. Ensure this file exists in your Vercel public directory */}
                                <Img
                                    src={`https://email-jbhifi-com-au-061772552430-ap-southeast-2-an.s3.ap-southeast-2.amazonaws.com/f6444bc745499d49960af360277286e7.jpg`}
                                    alt="DEALS FOR DAD! Shop now"
                                    width="600"
                                    className="w-full h-auto block border-0 mx-auto"
                                />
                            </Link>
                        </Section>
                        <Section className="w-full text-center">
                            <Link href={siteUrl} target="_blank" className="block w-full">
                                {/* 3. Ensure this file exists in your Vercel public directory */}
                                <Img
                                    src={`https://email-jbhifi-com-au-061772552430-ap-southeast-2-an.s3.ap-southeast-2.amazonaws.com/8604fb394b04ebe5b8c52dbdda7d816a.png`}
                                    alt="DEALS FOR DAD! Shop now"
                                    width="600"
                                    className="w-full h-auto block border-0 mx-auto"
                                />
                            </Link>
                        </Section>

                        <EmailFooterSection />
                    </Container>
                </Body>
            </Tailwind>
        </Html>
    );
};

export default JbPromotionEmail;