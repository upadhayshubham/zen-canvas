import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Shopping Cart',
  description: 'Review your selected mandala art pieces before checkout.',
};

export default function CartLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
