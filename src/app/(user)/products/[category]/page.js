// mui
import { Box, Container } from '@mui/material';

// next
import { notFound } from 'next/navigation';

// components
import HeaderBreadcrumbs from '@/components/header-breadcrumbs';
import ProductList from 'src/components/_main/products';
import Categories from '@/components/_main/home/categories';

// 🔴 IMPORTANT: prevent build-time API calls
export const dynamic = 'force-dynamic';
export const revalidate = 60;

const baseUrl = process.env.NEXT_PUBLIC_API_URL;

/**
 * SEO metadata (safe at runtime)
 */
export async function generateMetadata({ params }) {
  const { category } = params;

  try {
    const res = await fetch(`${baseUrl}/api/categories/${category}`, {
      cache: 'force-cache'
    });

    if (!res.ok) return {};

    const { data } = await res.json();
    if (!data) return {};

    return {
      title: data.metaTitle || data.name,
      description: data.metaDescription || data.description,
      openGraph: {
        title: data.name,
        description: data.metaDescription || data.description
      }
    };
  } catch {
    return {};
  }
}

export default async function Listing({ params }) {
  const { category } = params;

  let categoryData;
  let filters = [];

  // Fetch category
  try {
    const res = await fetch(`${baseUrl}/api/categories/${category}`, {
      next: { revalidate: 60 }
    });

    if (!res.ok) notFound();

    const response = await res.json();
    if (!response?.success || !response?.data) notFound();

    categoryData = response.data;
  } catch {
    notFound();
  }

  // Fetch filters (non-blocking)
  try {
    const res = await fetch(`${baseUrl}/api/products/filters`, {
      next: { revalidate: 60 }
    });

    if (res.ok) {
      const response = await res.json();
      filters = response?.data || [];
    }
  } catch {
    filters = [];
  }

  const subCategories = categoryData?.subCategories || [];

  return (
    <Box>
      <Box sx={{ bgcolor: 'background.default' }}>
        <Container maxWidth="xl">
          <HeaderBreadcrumbs
            heading={categoryData?.name}
            links={[{ name: 'Home', href: '/' }, { name: 'Products', href: '/products' }, { name: categoryData?.name }]}
          />

          {Boolean(subCategories.length) && <Categories data={subCategories} slug={category} />}

          <ProductList category={categoryData} filters={filters} />
        </Container>
      </Box>
    </Box>
  );
}
