export interface ProductDataType {
    id: number;
    title: string;
    image: string;
    badge?: string;
    badgeType?: string;
    badge2?: string;
    badgeType2?: string;
    secondaryBadge?: string;
    rating?: number;
    reviews?: number;
    price: number;
    originalPrice?: number;
    priceTagLabel?: string;
    savings?: string;
    tagline?: string;
    brand?: string;
    buttonText?: string;
}

export interface BrandDataType {
    id: string;
    name: string;
    logo: string;
    href?: string;
}

export interface SustainabilityCardProps {
    id: string;
    title: string;
    href?: string;
    image: string;
}