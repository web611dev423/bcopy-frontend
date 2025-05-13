
import './globals.css';
import type { Metadata } from 'next';
// import { Inter } from 'next/font/google';
import { GeistSans } from 'geist/font/sans';
import { Providers } from '@/store/provider';
import { AuthProvider } from '@/context/AuthContext';
import { SocketProvider } from '@/context/SocketContext';
import { Toaster } from '@/components/ui/toaster';
import { ThemeProvider } from 'next-themes';

// Load Geist font (replacing Inter)
// const geistSans = Inter({
//   variable: '--font-geist-sans',
//   subsets: ['latin'],
// });



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
      <body className={`${GeistSans.className} font-sans antialiased`}>
        <ThemeProvider defaultTheme="light" enableSystem attribute="class">
          <AuthProvider>
            <SocketProvider>
              <Providers>
                {children}
                <Toaster />
              </Providers>
            </SocketProvider>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
