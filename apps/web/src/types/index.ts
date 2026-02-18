export interface Product {
  id: string;
  name: string;
  slug: string;
  description: string;
  categoryId: string;
  categoryName: string;
  published: boolean;
  images: ProductImage[];
  variants: ProductVariant[];
  createdAt: string;
}

export interface ProductImage {
  id: string;
  cloudinaryId: string;
  secureUrl: string;
  displayOrder: number;
}

export interface ProductVariant {
  id: string;
  sku: string;
  price: number;
  stock: number;
  attributes: Record<string, string>;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string;
}

export interface Order {
  id: string;
  status: OrderStatus;
  totalAmount: number;
  items: OrderItem[];
  shippingName: string;
  shippingEmail: string;
  shippingAddress: string;
  createdAt: string;
}

export interface OrderItem {
  id: string;
  variantId: string;
  quantity: number;
  unitPrice: number;
  productName: string;
  sku: string;
}

export type OrderStatus =
  | "PENDING"
  | "PROCESSING"
  | "SHIPPED"
  | "DELIVERED"
  | "CANCELLED"
  | "REFUNDED";

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: "CUSTOMER" | "ADMIN";
}

export interface PageResponse<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  number: number;
  size: number;
}

export interface CartItemResponse {
  id: string;
  variantId: string;
  sku: string;
  productName: string;
  productSlug: string;
  price: number;
  quantity: number;
  subtotal: number;
  imageUrl?: string;
  attributes: Record<string, string>;
}

export interface CartResponse {
  items: CartItemResponse[];
  totalItems: number;
  totalPrice: number;
}

export interface AuthResponse {
  token: string;
  userId: string;
  email: string;
  firstName: string;
  lastName: string;
  role: string;
}

export interface PaymentIntentResponse {
  clientSecret: string;
  paymentIntentId: string;
  amount: number;
}
