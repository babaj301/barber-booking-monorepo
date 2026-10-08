import './globals.css';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Barber Booking',
  description: 'Book premium barber appointments online',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
