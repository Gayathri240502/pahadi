'use client';
import React from 'react';
import dynamic from 'next/dynamic';
import { useSelector } from 'react-redux';

// mui
import { alpha } from '@mui/material/styles';
import { Toolbar, Stack, AppBar, useMediaQuery, Container } from '@mui/material';

// components
import Logo from '@/components/logo';
// Widgets
import WishlistWidget from '@/components/widgets/wishlist';
import CartWidget from '@/components/widgets/cart';
import CompareWidget from '@/components/widgets/compare';
import Search from '@/components/widgets/search';
import UserSelect from '@/components/select/user-select';
// dynamic import components
const MobileBar = dynamic(() => import('@/layout/_main/mobile-bar'));

// ----------------------------------------------------------------------
export default function Navbar({ branding }) {
  const { checkout } = useSelector(({ product }) => product);
  const isMobile = useMediaQuery('(max-width:992px)');
  const [open, setOpen] = React.useState(false);
  return (
    <>
      <AppBar
        sx={{
          boxShadow: 'none',
          position: 'sticky',
          top: 0,
          zIndex: 999,
          borderRadius: 0,
          pr: '0px !important',
          bgcolor: (theme) => alpha(theme.palette.background.paper, 1),
          borderTop: (theme) => `1px solid ${theme.palette.divider}`,
          display: { md: 'block', xs: 'none' },
          '& .toolbar': {
            justifyContent: 'space-between',
            backdropFilter: 'blur(6px)',
            borderRadius: 0,
            WebkitBackdropFilter: 'blur(6px)', // Fix on Mobile
            bgcolor: (theme) => alpha(theme.palette.background.paper, 1),
            px: 3,
            py: 1.5
          }
        }}
      >
        <Container maxWidth="xl">
          <Toolbar disableGutters className="toolbar" sx={{ px: '0px!important' }}>
            <Stack gap={3} direction="row" alignItems={'center'}>
              <Logo branding={branding} />
              <Search setOpen={setOpen} open={open} />
            </Stack>

            <Stack gap={2} direction="row" alignItems={'center'}>
              <WishlistWidget />
              <CompareWidget />
              <CartWidget checkout={checkout} />
              <UserSelect />
            </Stack>
          </Toolbar>
        </Container>
      </AppBar>
      {isMobile && <MobileBar />}
    </>
  );
}
