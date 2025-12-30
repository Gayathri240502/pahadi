import React from 'react';

// guard
import VendorGuard from '@/guards/vendor';

// layout
import VendorLayout from 'src/layout/_vendor';
const baseUrl = process.env.NEXT_PUBLIC_API_URL;
export const metadata = {
  title: 'Pahadi E-commerce Script | Your Gateway to Seamless Shopping and Secure Transactions',
  description:
    'Log in to Pahadi for secure access to your account. Enjoy seamless shopping, personalized experiences, and hassle-free transactions. Your trusted portal to a world of convenience awaits. Login now!',
  applicationName: 'Pahadi',
  authors: 'Pahadi',
  keywords: 'ecommerce, Pahadi, Commerce, Sign in Pahadi, Signin From Pahadi',
  icons: {
    icon: 'https://Pahadi.vercel.app/favicon.png'
  },
  openGraph: {
    images: 'https://Pahadi.vercel.app/opengraph-image.png?1c6a1fa20db2840f'
  }
};
export default async function layout({ children }) {
  const res = await fetch(`${baseUrl}/api/settings/branding`, { next: { revalidate: 60 } });
  const { data: branding } = await res.json();
  return (
    <VendorGuard>
      <VendorLayout branding={branding}>{children}</VendorLayout>
    </VendorGuard>
  );
}
