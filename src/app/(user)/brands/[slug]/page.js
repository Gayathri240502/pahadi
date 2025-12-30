// src/app/(user)/brands/[slug]/page.js
import React from 'react';
import { notFound } from 'next/navigation';
import { Stack, Container } from '@mui/material';

import HeaderBreadcrumbs from '@/components/header-breadcrumbs';
import ProductList from 'src/components/_main/products';

// ISR: Revalidate every 60 seconds
export const revalidate = 60;

const baseUrl = process.env.NEXT_PUBLIC_API_URL;

// Safe fetch helper
async function fetchJSON(url, options) {
  try {
    const res = await fetch(url, options);
    const text = await res.text();
    try {
      return JSON.parse(text);
    } catch (err) {
      console.error(`Failed to parse JSON from ${url}:`, text);
      return null;
    }
  } catch (err) {
    console.error(`Fetch failed for ${url}:`, err);
    return null;
  }
}

// Generate static params for brands
export async function generateStaticParams() {
  const result = await fetchJSON(`${baseUrl}/api/brands-slugs`, { next: { revalidate: 3600 } });
  if (!result?.data) return [];

  return result.data.map((brand) => ({
    slug: brand.slug
  }));
}

// Generate metadata per brand
export async function generateMetadata({ params }) {
  const { slug } = params;

  const result = await fetchJSON(`${baseUrl}/api/brands/${slug}`, { cache: 'force-cache' });

  if (!result?.data) return {};

  const brand = result.data;

  return {
    title: brand.metaTitle || brand.name,
    description: brand.metaDescription || brand.description,
    openGraph: {
      title: brand.name,
      description: brand.metaDescription || brand.description
    }
  };
}

// Main brand detail page
export default async function BrandDetail({ params }) {
  const { slug } = params;

  // Fetch brand data
  const brandRes = await fetchJSON(`${baseUrl}/api/brands/${slug}`, { next: { revalidate: 60 } });
  const filtersRes = await fetchJSON(`${baseUrl}/api/products/filters`, { next: { revalidate: 60 } });

  if (!brandRes?.success || !brandRes?.data) notFound();

  const brand = brandRes.data;
  const filters = filtersRes?.data || [];

  return (
    <Container maxWidth="xl">
      <Stack gap={3}>
        <HeaderBreadcrumbs
          heading={brand?.name}
          links={[{ name: 'Home', href: '/' }, { name: 'Brands', href: '/brands' }, { name: brand?.name }]}
        />
        <ProductList brand={brand} filters={filters} />
      </Stack>
    </Container>
  );
}
