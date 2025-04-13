import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { Providers } from '@/store/provider';
import { AuthProvider } from '@/context/AuthContext';
const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: '<Be>Copy',
  description: 'Transform your code between programming languages',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <AuthProvider>
          <Providers>
            {children}
          </Providers>
        </AuthProvider>
      </body>
    </html>
  );
}