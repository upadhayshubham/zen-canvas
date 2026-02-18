import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'My Orders',
  description: 'View your Zen Canvas order history and tracking.',
  robots: { index: false, follow: false },
};

export default function OrdersLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
