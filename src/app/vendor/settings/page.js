import React from 'react';

// components
import HeaderBreadcrumbs from '@/components/header-breadcrumbs';
import AccountGeneral from '@/components/_main/profile/profile';

// Meta information
export const metadata = {
  title: 'Setting - Pahadi',
  applicationName: 'Pahadi',
  authors: 'Pahadi'
};
export default function page() {
  return (
    <div>
      <HeaderBreadcrumbs
        heading="Settings"
        admin
        links={[
          {
            name: 'Dashboard',
            href: '/vendor/dashboard'
          },
          {
            name: 'Settings'
          }
        ]}
        action={{
          href: `/vendor/settings/shop`,
          title: 'Shop Setting'
        }}
      />
      <AccountGeneral />
    </div>
  );
}
