import type { Metadata } from 'next';
import './globals.css';
import Providers from './Providers';

export const metadata: Metadata = {
  title: 'ToroLens',
  description:
    'Inspect wallet activity, analyze transactions, and understand failures on Toronet.',
};

type RootLayoutProps = {
  children: React.ReactNode;
};

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-[#041A1F] text-slate-900 antialiased">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
