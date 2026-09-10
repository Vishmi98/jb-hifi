import type { Metadata } from "next";
import { Bowlby_One_SC, Geist, Geist_Mono, Roboto } from "next/font/google";
import localFont from "next/font/local";

import "../globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Socials from "@/components/Socials";

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

const openSans = localFont({
  src: "./fonts/open-sans-v18-latin-ext_latin-600.woff",
  variable: "--font-open-sans",
  weight: "600",
  style: "normal",
});

const jbCallout = localFont({
  src: "./fonts/JB-Callout.woff",
  variable: "--font-jb-callout",
  weight: "400",
  style: "normal",
});

export const metadata: Metadata = {
  title: "JB Hi-Fi | Australia's Largest Home Entertainment Retailer",
  description:
    "Australia's largest home entertainment retailer. Massive savings on the biggest brands of TVs, Laptops, Mobile Phones, Gaming Consoles, Headphones and Home Appliances.",
};

export default function RootLayout({
  children,
}: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`
        ${geistSans.variable}
        ${geistMono.variable}
        ${roboto.variable}
        ${bowlby.variable}
        ${openSans.variable}
        ${jbCallout.variable}
        h-full
        antialiased
      `}
    >
      <body>
        <div className="flex flex-col min-h-screen">
          <Navbar />
          <main className="flex-1 flex flex-col w-full pb-16 bg-white">{children}</main>
          <Footer />
          <Socials />
        </div>
      </body>
    </html>
  );
}