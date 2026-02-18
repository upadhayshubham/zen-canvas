import type { Metadata } from 'next';
import { Suspense } from 'react';

export const metadata: Metadata = {
  title: 'Order Confirmed',
  robots: { index: false, follow: false },
};

export default function ConfirmationLayout({ children }: { children: React.ReactNode }) {
  return <Suspense>{children}</Suspense>;
}
