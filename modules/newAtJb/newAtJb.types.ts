export interface PromoCardProps {
    imageSrc: string;
    description: string;
    buttonText: string;
    buttonHref: string;
    hasPlayOverlay?: boolean;
}

export interface CardItem extends PromoCardProps {
    id: number;
}