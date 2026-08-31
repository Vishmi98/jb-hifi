import type { Metadata } from "next";
import { Bowlby_One_SC, Geist, Geist_Mono, Roboto } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const roboto = Roboto({
  variable: "--font-roboto",
  subsets: ["latin"],
  weight: ["300", "400", "500", "700", "900"],
});

const bowlby = Bowlby_One_SC({
  variable: "--font-jb-display",
  subsets: ["latin"],
  weight: "400",
});

export const metadata: Metadata = {
  title: "JB Hi-Fi | Australia's Largest Home Entertainment Retailer",
  description: "Australia's largest home entertainment retailer. Massive savings on the biggest brands of TVs, Laptops, Mobile Phones, Gaming Consoles, Headphones and Home Appliances.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} ${roboto.variable} ${bowlby.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
