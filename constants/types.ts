export interface NavItem {
  name: string;
  href: string;
  badge?: string;
}

export interface Category {
  id: string;
  name: string;
  icon: string; // Icon name from lucide-react
  subcategories?: string[];
}

export interface Product {
  id: string;
  name: string;
  brand: string;
  price: number;
  originalPrice?: number;
  savings?: number;
  rating: number;
  reviewCount: number;
  image: string;
  isOnlineOnly?: boolean;
  isPromo?: boolean;
  tag?: string; // e.g. "HOT DEAL", "NEW", "TICKET PRICE"
}

export interface HeroSlide {
  id: string;
  title: string;
  subtitle: string;
  ctaText: string;
  ctaLink: string;
  image: string;
  bgColor: string; // Tailwind class or custom hex color
  textColor: string;
  badge?: string;
}

export interface PromoTile {
  id: string;
  title: string;
  subtitle: string;
  ctaText: string;
  ctaLink: string;
  image: string;
  bgColor: string;
  textColor: string;
}

export interface FooterLink {
  label: string;
  href: string;
}

export interface FooterColumn {
  title: string;
  links: FooterLink[];
}

export type DesktopNavbarProps = {
  openNav: () => void
}

export type MobileNavbarProps = {
  showNav: boolean;
  closeNav: () => void;
}

export interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  cartItems?: Array<{ id: string; name: string; price: number; quantity: number }>;
}