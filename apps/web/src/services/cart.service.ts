import api from '@/lib/api';
import { CartResponse } from '@/types';

export async function getCart(sessionId: string): Promise<CartResponse> {
  const res = await api.get<CartResponse>('/cart', { headers: { 'X-Session-Id': sessionId } });
  return res.data;
}

export async function addToCart(sessionId: string, variantId: string, quantity: number): Promise<CartResponse> {
  const res = await api.post<CartResponse>('/cart/items', { variantId, quantity }, { headers: { 'X-Session-Id': sessionId } });
  return res.data;
}

export async function updateCartItem(sessionId: string, itemId: string, quantity: number): Promise<CartResponse> {
  const res = await api.put<CartResponse>(`/cart/items/${itemId}`, null, {
    params: { quantity },
    headers: { 'X-Session-Id': sessionId },
  });
  return res.data;
}

export async function removeCartItem(sessionId: string, itemId: string): Promise<CartResponse> {
  const res = await api.delete<CartResponse>(`/cart/items/${itemId}`, { headers: { 'X-Session-Id': sessionId } });
  return res.data;
}
