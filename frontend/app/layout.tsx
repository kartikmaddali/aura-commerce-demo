import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import '@/styles/globals.css';
import { BrandProvider } from '@/components/providers/BrandProvider';
import { AuthProvider } from '@/components/providers/AuthProvider';
import { AIProvider } from '@/components/providers/AIProvider';
import { Toaster } from 'react-hot-toast';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Aura Commerce Group',
  description: 'Multi-brand retail platform showcasing Auth0 and AI integration',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <BrandProvider>
          <AuthProvider>
            <AIProvider>
              {children}
              <Toaster 
                position="top-right"
                toastOptions={{
                  duration: 4000,
                  style: {
                    background: '#363636',
                    color: '#fff',
                  },
                }}
              />
            </AIProvider>
          </AuthProvider>
        </BrandProvider>
      </body>
    </html>
  );
}
