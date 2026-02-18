import api from '@/lib/api';
import { Order, PageResponse, PaymentIntentResponse } from '@/types';

export async function getMyOrders(): Promise<PageResponse<Order>> {
  const res = await api.get<PageResponse<Order>>('/orders/my');
  return res.data;
}

export async function createPaymentIntent(
  sessionId: string,
  shippingDetails: {
    shippingName: string;
    shippingEmail: string;
    shippingAddress: string;
    shippingCity: string;
    shippingCountry: string;
    shippingPostcode: string;
  }
): Promise<PaymentIntentResponse> {
  const res = await api.post<PaymentIntentResponse>('/checkout/payment-intent', shippingDetails, {
    headers: { 'X-Session-Id': sessionId },
  });
  return res.data;
}

export async function getAdminOrders(status?: string): Promise<PageResponse<Order>> {
  const res = await api.get<PageResponse<Order>>('/admin/orders', { params: { size: 50, ...(status ? { status } : {}) } });
  return res.data;
}

export async function updateOrderStatus(orderId: string, status: string): Promise<Order> {
  const res = await api.patch<Order>(`/admin/orders/${orderId}/status`, null, { params: { status } });
  return res.data;
}
