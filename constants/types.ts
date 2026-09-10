import { Method } from "axios";
import { ReactNode } from "react";

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

export type UserStoreUserType = {
    id: number;
    firstName: string;
    lastName: string;
    email: string;
    userType: string;
    phoneNumber: string;
}

export type ApiCallOptions = {
    url: string;
    method?: Method; // GET, POST, PUT, etc.
    body?: Record<string, unknown>;
    params?: Record<string, unknown>;
    isAuth?: boolean;
}

export type ProfileLink = {
    id: string;
    label: string;
    icon: ReactNode;
    href: string;
}

export type SidebarProps = {
    isOpen: boolean;
    setIsOpen: (isOpen: boolean) => void;
}

export type TableProps = {
    reload?: boolean;
    handleReload?: () => void;
}

export type LoaderProps = {
    h?: number;
};

export type ConfirmModalProps = {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    message: string;
};

export type AddModalProps = {
    isOpen: boolean;
    onClose: () => void;
    handleReload: () => void;
}

export interface CropModalProps {
    imageFile: File;
    onCropComplete: (file: File) => void;
    onClose: () => void;
    cropWidth?: number;
    cropHeight?: number;
}