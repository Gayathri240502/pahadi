import React from 'react';

// components
import HeaderBreadcrumbs from '@/components/header-breadcrumbs';
import OrdersList from '@/components/_admin/orders/orders';

// Meta information
export const metadata = {
  title: 'Order - Pahadi',
  applicationName: 'Pahadi',
  authors: 'Pahadi'
};
export default function page() {
  return (
    <div>
      <HeaderBreadcrumbs
        admin
        heading="Orders List"
        links={[
          {
            name: 'Dashboard',
            href: '/vendor/dashboard'
          },
          {
            name: 'Orders'
          }
        ]}
      />
      <OrdersList isVendor />
    </div>
  );
}
