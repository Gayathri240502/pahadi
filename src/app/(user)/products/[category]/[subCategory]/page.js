// mui
import { Box, Container } from '@mui/material';

// next
import { notFound } from 'next/navigation';

// components
import HeaderBreadcrumbs from '@/components/header-breadcrumbs';
import ProductList from 'src/components/_main/products';
import Categories from '@/components/_main/home/categories';

// 🔴 IMPORTANT: force runtime rendering (prevents build-time API failures)
export const dynamic = 'force-dynamic';

// ISR for page data (runtime)
export const revalidate = 60;

const baseUrl = process.env.NEXT_PUBLIC_API_URL;

/**
 * SEO Metadata
 * Runs at request time (safe)
 */
export async function generateMetadata({ params }) {
  const { subCategory } = params;

  try {
    const res = await fetch(`${baseUrl}/api/sub-categories/${subCategory}`, {
      cache: 'force-cache'
    });

    if (!res.ok) return {};

    const { data: currentCategory } = await res.json();

    if (!currentCategory) return {};

    return {
      title: currentCategory.metaTitle || currentCategory.name,
      description: currentCategory.metaDescription || currentCategory.description,
      openGraph: {
        title: currentCategory.name,
        description: currentCategory.metaDescription || currentCategory.description
      }
    };
  } catch (error) {
    // Prevent metadata crash
    return {};
  }
}

/**
 * Page
 */
export default async function Listing({ params }) {
  const { category, subCategory } = params;

  // Fetch sub-category details
  let subCategoryData;
  try {
    const res = await fetch(`${baseUrl}/api/sub-categories/${subCategory}`, {
      next: { revalidate: 60 }
    });

    if (!res.ok) notFound();

    const response = await res.json();

    if (!response?.success || !response?.data) {
      notFound();
    }

    subCategoryData = response.data;
  } catch (error) {
    notFound();
  }

  // Fetch filters (non-blocking)
  let filters = [];
  try {
    const res2 = await fetch(`${baseUrl}/api/products/filters`, {
      next: { revalidate: 60 }
    });

    if (res2.ok) {
      const response2 = await res2.json();
      filters = response2?.data || [];
    }
  } catch (error) {
    filters = [];
  }

  const childCategories = subCategoryData?.childCategories || [];

  return (
    <Box>
      <Box sx={{ bgcolor: 'background.default' }}>
        <Container maxWidth="xl">
          <HeaderBreadcrumbs
            heading={subCategoryData?.name}
            links={[
              { name: 'Home', href: '/' },
              { name: 'Products', href: '/products' },
              {
                name: subCategoryData?.parentCategory?.name,
                href: `/products/${category}`
              },
              { name: subCategoryData?.name }
            ]}
          />

          {Boolean(childCategories.length) && <Categories data={childCategories} slug={`${category}/${subCategory}`} />}

          <ProductList subCategory={subCategoryData} filters={filters} />
        </Container>
      </Box>
    </Box>
  );
}
