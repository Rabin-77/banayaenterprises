export interface Product {
  id: string;
  name: string;
  tamilName?: string;
  tagline: string;
  category: string;
  categorySlug: string;
  price: number;
  originalPrice: number;
  rating: number;
  reviewsCount: number;
  inStock: boolean;
  weightOptions: string[];
  defaultWeight: string;
  badges: string[];
  image: string;
  gallery: string[];
  description: string;
  ingredients: string[];
  keyBenefits: string[];
  howToUse: string;
  storageInfo?: string;
  origin: string;
  isBestSeller?: boolean;
  isNew?: boolean;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string;
  image: string;
  itemCount: number;
  highlight: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
  selectedWeight: string;
}

export interface Review {
  id: string;
  author: string;
  rating: number;
  title: string;
  comment: string;
  date: string;
  verified: boolean;
  avatar: string;
  location: string;
  productName: string;
}

export interface Ingredient {
  id: string;
  name: string;
  tamilName?: string;
  description: string;
  benefits: string[];
  image: string;
  featuredIn: string[];
}

export interface Order {
  id: string;
  date: string;
  items: CartItem[];
  subtotal: number;
  discount: number;
  shipping: number;
  totalAmount: number;
  status: 'Processing' | 'Confirmed' | 'Shipped' | 'Out for Delivery' | 'Delivered';
  customerName: string;
  phone: string;
  email: string;
  shippingAddress: string;
  city: string;
  postalCode: string;
  paymentMethod: string;
  trackingNumber: string;
  transactionId?: string;
  bankRef?: string;
}

export type ActiveModal = 
  | null 
  | 'cart' 
  | 'wishlist' 
  | 'search' 
  | 'account' 
  | 'checkout' 
  | 'trackOrder'
  | 'quickView'
  | 'admin';
