import React from 'react';
// components
import SingleSlideCarousel from '@/components/carousels/single-slide';
import HeroShops from './shops';
// mui
import { Stack, Container } from '@mui/material';

export default function Hero({ data, banners }) {
  return (
    <Container maxWidth="xl">
      <Stack direction="row" gap={2} mt={2}>
        <HeroShops data={data} />
        <SingleSlideCarousel data={banners?.slides} />
      </Stack>
    </Container>
  );
}
