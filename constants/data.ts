import { NavItem, Category, Product, HeroSlide, PromoTile } from './types';

export const NAV_ITEMS: NavItem[] = [
  { name: 'Deals', href: '#', badge: 'HOT' },
  { name: 'Catalogues', href: '#' },
  { name: 'Brands', href: '#' },
  { name: 'Services', href: '#' },
  { name: 'JB Perks', href: '#', badge: 'JOIN' },
  { name: 'Gift Cards', href: '#' },
  { name: 'Help & Support', href: '#' },
];

export const CATEGORIES: Category[] = [
  {
    id: 'computers',
    name: 'Computers & Tablets',
    icon: 'Laptop',
    subcategories: ['Laptops', 'Desktops', 'Tablets', 'Monitors', 'Printers', 'Computer Accessories']
  },
  {
    id: 'tvs',
    name: 'TVs & Projectors',
    icon: 'Tv',
    subcategories: ['OLED TVs', 'QLED TVs', '8K & 4K TVs', 'Projectors', 'Soundbars', 'TV Mounts']
  },
  {
    id: 'phones',
    name: 'Mobile Phones',
    icon: 'Smartphone',
    subcategories: ['iPhone', 'Samsung Galaxy', 'Google Pixel', 'Prepaid Phones', 'Smartwatches', 'Phone Cases']
  },
  {
    id: 'audio',
    name: 'Headphones & Speakers',
    icon: 'Headphones',
    subcategories: ['Wireless Headphones', 'Noise Cancelling', 'Bluetooth Speakers', 'Turntables', 'Home Audio']
  },
  {
    id: 'gaming',
    name: 'Gaming & Consoles',
    icon: 'Gamepad2',
    subcategories: ['PlayStation 5', 'Nintendo Switch', 'Xbox Series X', 'Gaming Laptops', 'VR Gaming', 'Games']
  },
  {
    id: 'appliances',
    name: 'Home Appliances',
    icon: 'Refrigerator',
    subcategories: ['Vacuum Cleaners', 'Airfryers', 'Coffee Machines', 'Fridges & Freezers', 'Washing Machines']
  },
  {
    id: 'smarthome',
    name: 'Smart Home & Security',
    icon: 'Home',
    subcategories: ['Security Cameras', 'Smart Speakers', 'Smart Lighting', 'Mesh Wi-Fi', 'Smart Plugs']
  },
  {
    id: 'car',
    name: 'Car Tech & GPS',
    icon: 'Car',
    subcategories: ['Dash Cams', 'Car Audio', 'GPS Navigation', 'UHF Radios', 'Car Chargers']
  }
];

export const HERO_SLIDES: HeroSlide[] = [
  {
    id: 'slide-1',
    title: 'TAX TIME MADNESS',
    subtitle: 'MASSIVE SAVINGS ON THE BIGGEST TECH BRANDS! LAPTOPS, TVS, PHONES & MORE.',
    ctaText: 'SHOP THE SALE',
    ctaLink: '#',
    image: '/h1.webp',
    bgColor: 'bg-red-600',
    textColor: 'text-white',
    badge: 'MEGA DEAL'
  },
  {
    id: 'slide-2',
    title: 'UP TO $500 OFF OLED TVS',
    subtitle: 'Experience breathtaking picture quality with selected LG, Samsung and Sony OLED TVs.',
    ctaText: 'VIEW OLED DEALS',
    ctaLink: '#',
    image: '/h2.webp',
    bgColor: 'bg-zinc-900',
    textColor: 'text-white',
    badge: 'TICKET PRICE'
  },
  {
    id: 'slide-3',
    title: 'BACK TO WORK SPECIALS',
    subtitle: 'Upgrade your home office with blazing fast laptops, monitors and printers from $299.',
    ctaText: 'COMPUTERS & MORE',
    ctaLink: '#',
    image: '/h3.webp',
    bgColor: 'bg-yellow-400',
    textColor: 'text-black',
    badge: 'PERKS EXCLUSIVE'
  }
];

export const PROMO_TILES: PromoTile[] = [
  {
    id: 'promo-1',
    title: 'Samsung Galaxy S24 Series',
    subtitle: 'Get a bonus JB Hi-Fi Gift Card worth up to $250 with selected models.',
    ctaText: 'Shop S24',
    ctaLink: '#',
    image: 'https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?auto=format&fit=crop&w=600&q=80',
    bgColor: 'bg-blue-900',
    textColor: 'text-white'
  },
  {
    id: 'promo-2',
    title: 'Gaming Gear Frenzy',
    subtitle: 'Save on PS5 Consoles, Switch OLED and hot game titles. Online & In-Store.',
    ctaText: 'Browse Gaming',
    ctaLink: '#',
    image: 'https://images.unsplash.com/photo-1606144042614-b2417e99c4e3?auto=format&fit=crop&w=600&q=80',
    bgColor: 'bg-purple-950',
    textColor: 'text-white'
  },
  {
    id: 'promo-3',
    title: 'Dyson Airwrap Specials',
    subtitle: 'Ticket price drop on hair styling, cordless vacuums and air purifiers.',
    ctaText: 'Shop Dyson',
    ctaLink: '#',
    image: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=600&q=80',
    bgColor: 'bg-pink-900',
    textColor: 'text-white'
  },
  {
    id: 'promo-4',
    title: 'Smart Home Security',
    subtitle: 'Keep your home safe. Up to 30% off Ring, Eufy, and Google Nest cameras.',
    ctaText: 'Get Secured',
    ctaLink: '#',
    image: 'https://images.unsplash.com/photo-1558002038-1055907df827?auto=format&fit=crop&w=600&q=80',
    bgColor: 'bg-zinc-800',
    textColor: 'text-white'
  }
];

export const PRODUCTS: Product[] = [
  // TVs
  {
    id: 'tv-lg-oled-55',
    name: 'LG C3 55" Self Lit OLED EVO 4K Smart TV [2023]',
    brand: 'LG',
    price: 1995,
    originalPrice: 2595,
    savings: 600,
    rating: 4.8,
    reviewCount: 342,
    image: 'https://images.unsplash.com/photo-1593305841991-05c297ba4575?auto=format&fit=crop&w=300&h=200&q=80',
    isPromo: true,
    tag: 'HOT DEAL'
  },
  {
    id: 'tv-samsung-qled-75',
    name: 'Samsung Q60C 75" QLED 4K Smart TV [2023]',
    brand: 'SAMSUNG',
    price: 1495,
    originalPrice: 1895,
    savings: 400,
    rating: 4.5,
    reviewCount: 189,
    image: 'https://images.unsplash.com/photo-1461151304267-38535e780c79?auto=format&fit=crop&w=300&h=200&q=80',
    isPromo: false,
    tag: 'TICKET PRICE'
  },
  {
    id: 'tv-sony-oled-65',
    name: 'Sony BRAVIA XR A80L 65" 4K OLED Smart TV [2023]',
    brand: 'SONY',
    price: 2995,
    originalPrice: 3495,
    savings: 500,
    rating: 4.7,
    reviewCount: 112,
    image: 'https://images.unsplash.com/photo-1552975084-6e027cd345c2?auto=format&fit=crop&w=300&h=200&q=80',
    isPromo: true,
    tag: 'HOT DEAL'
  },

  // Computers
  {
    id: 'comp-macbook-air-m2',
    name: 'Apple MacBook Air 13-inch with M2 Chip (256GB) [Space Grey]',
    brand: 'APPLE',
    price: 1599,
    originalPrice: 1799,
    savings: 200,
    rating: 4.9,
    reviewCount: 521,
    image: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=300&h=200&q=80',
    isPromo: true,
    tag: 'TOP SELLER'
  },
  {
    id: 'comp-hp-pavilion-15',
    name: 'HP Pavilion 15.6" Full HD Laptop (Intel i5) [256GB SSD]',
    brand: 'HP',
    price: 898,
    originalPrice: 1198,
    savings: 300,
    rating: 4.2,
    reviewCount: 94,
    image: 'https://images.unsplash.com/photo-1496181130204-7552cc14ac1a?auto=format&fit=crop&w=300&h=200&q=80',
    isOnlineOnly: true,
    tag: 'ONLINE ONLY'
  },
  {
    id: 'comp-lenovo-ideapad',
    name: 'Lenovo IdeaPad Slim 3i 14" Full HD Laptop (Intel i3) [128GB]',
    brand: 'LENOVO',
    price: 499,
    originalPrice: 699,
    savings: 200,
    rating: 4.0,
    reviewCount: 45,
    image: 'https://images.unsplash.com/photo-1588508065123-287b28e013da?auto=format&fit=crop&w=300&h=200&q=80',
    isPromo: true,
    tag: 'GREAT VALUE'
  },

  // Phones
  {
    id: 'phone-iphone15-128',
    name: 'Apple iPhone 15 Pro 128GB [Black Titanium]',
    brand: 'APPLE',
    price: 1849,
    rating: 4.8,
    reviewCount: 652,
    image: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=300&h=200&q=80',
    tag: 'NEW'
  },
  {
    id: 'phone-s24-256',
    name: 'Samsung Galaxy S24 Ultra 256GB [Titanium Grey]',
    brand: 'SAMSUNG',
    price: 2199,
    originalPrice: 2399,
    savings: 200,
    rating: 4.7,
    reviewCount: 198,
    image: 'https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?auto=format&fit=crop&w=300&h=200&q=80',
    isPromo: true,
    tag: 'BONUS GIFT CARD'
  },

  // Audio
  {
    id: 'audio-sony-xm5',
    name: 'Sony WH-1000XM5 Wireless Noise Cancelling Over-Ear Headphones',
    brand: 'SONY',
    price: 495,
    originalPrice: 549,
    savings: 54,
    rating: 4.6,
    reviewCount: 412,
    image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=300&h=200&q=80',
    isPromo: true,
    tag: 'TICKET PRICE'
  },
  {
    id: 'audio-bose-qc',
    name: 'Bose QuietComfort Wireless Noise Cancelling Headphones [Black]',
    brand: 'BOSE',
    price: 395,
    originalPrice: 499,
    savings: 104,
    rating: 4.7,
    reviewCount: 228,
    image: 'https://images.unsplash.com/photo-1546435770-a3e426bf472b?auto=format&fit=crop&w=300&h=200&q=80',
    tag: 'HOT DEAL'
  },

  // Gaming
  {
    id: 'game-ps5-slim',
    name: 'PlayStation 5 Console Slim Edition',
    brand: 'PLAYSTATION',
    price: 699,
    originalPrice: 799,
    savings: 100,
    rating: 4.8,
    reviewCount: 887,
    image: 'https://images.unsplash.com/photo-1606144042614-b2417e99c4e3?auto=format&fit=crop&w=300&h=200&q=80',
    isPromo: true,
    tag: 'HOT DEAL'
  },
  {
    id: 'game-switch-oled',
    name: 'Nintendo Switch Console OLED Model [Neon]',
    brand: 'NINTENDO',
    price: 499,
    originalPrice: 539,
    savings: 40,
    rating: 4.9,
    reviewCount: 1205,
    image: 'https://images.unsplash.com/photo-1578632767115-351597cf2477?auto=format&fit=crop&w=300&h=200&q=80',
    tag: 'TOP SELLER'
  }
];

export const BRANDS = [
  { name: 'Apple', logo: 'https://upload.wikimedia.org/wikipedia/commons/f/fa/Apple_logo_black.svg' },
  { name: 'Samsung', logo: 'https://upload.wikimedia.org/wikipedia/commons/2/24/Samsung_Logo.svg' },
  { name: 'LG', logo: 'https://upload.wikimedia.org/wikipedia/commons/b/bf/LG_logo_%282015%29.svg' },
  { name: 'Sony', logo: 'https://upload.wikimedia.org/wikipedia/commons/c/ca/Sony_logo.svg' },
  { name: 'Dyson', logo: 'https://upload.wikimedia.org/wikipedia/commons/e/ea/Dyson_logo.svg' },
  { name: 'HP', logo: 'https://upload.wikimedia.org/wikipedia/commons/a/ad/HP_logo_2012.svg' },
  { name: 'Bose', logo: 'https://upload.wikimedia.org/wikipedia/commons/e/e0/Bose_Logo.svg' },
  { name: 'Nintendo', logo: 'https://upload.wikimedia.org/wikipedia/commons/0/0d/Nintendo.svg' },
  { name: 'PlayStation', logo: 'https://upload.wikimedia.org/wikipedia/commons/0/00/PlayStation_logo.svg' },
  { name: 'Lenovo', logo: 'https://upload.wikimedia.org/wikipedia/commons/b/b8/Lenovo_logo_2015.svg' }
];
