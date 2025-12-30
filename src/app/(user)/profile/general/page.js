import React from 'react';

// mui
import { Container, Stack } from '@mui/material';

import HeaderBreadcrumbs from '@/components/header-breadcrumbs';
import GeneralProfileMain from '@/components/_main/profile/profile';

// Meta information
export const metadata = {
  title: 'Pahadi - Your Gateway to Seamless Shopping and Secure Transactions',
  applicationName: 'Pahadi',
  authors: 'Pahadi'
};

export default function GeneralProfile() {
  return (
    <Container maxWidth="xl">
      <Stack gap={4}>
        <HeaderBreadcrumbs
          heading="General"
          links={[
            {
              name: 'Home',
              href: '/'
            },
            {
              name: 'Profile',
              href: '/profile/general'
            },
            {
              name: 'General'
            }
          ]}
        />
        <GeneralProfileMain />
      </Stack>
    </Container>
  );
}
