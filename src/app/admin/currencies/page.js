import React from 'react';

// Components
import CurrencyList from '@/components/_admin/currencies/currency-list';

// Meta information
export const metadata = {
  title: 'Currencies - Pahadi',
  applicationName: 'Pahadi',
  authors: 'Pahadi'
};
export default function Currencies() {
  return <CurrencyList />;
}
