import { Stack } from '@mui/material';

// Components
import Hero from 'src/components/_main/home/hero';
import WhyUs from '@/components/_main/home/why-us';
import TopBanners from '@/components/_main/home/banners';
import Categories from '@/components/_main/home/categories';
import Brands from '@/components/_main/home/brands';
import Shops from '@/components/_main/home/shops';
import Testimonials from 'src/components/_main/home/testimonials';
import ProductList from '@/components/_main/home/products';
import SubscriptionModal from 'src/components/_main/home/subscription';

// API services (direct fetch here or via service layer)
const baseUrl = process.env.NEXT_PUBLIC_API_URL;

export const revalidate = 60; // ISR: Revalidate every 60 seconds

export default async function IndexPage() {
  // Fetch all home data in parallel
  const [homeRes, categoriesRes, bestSellingRes, topRatedRes, featuredRes, brandsRes, shopsRes, reviewsRes] =
    await Promise.all([
      fetch(`${baseUrl}/api/settings/home`, { next: { revalidate: 60 } }),
      fetch(`${baseUrl}/api/home/categories`, { next: { revalidate: 60 } }),
      fetch(`${baseUrl}/api/home/products/best-selling`, { next: { revalidate: 60 } }),
      fetch(`${baseUrl}/api/home/products/top`, { next: { revalidate: 60 } }),
      fetch(`${baseUrl}/api/home/products/featured`, { next: { revalidate: 60 } }),
      fetch(`${baseUrl}/api/home/brands`, { next: { revalidate: 60 } }),
      fetch(`${baseUrl}/api/shops?limit=8`, { next: { revalidate: 60 } }),
      fetch(`${baseUrl}/api/home/reviews?limit=8`, { next: { revalidate: 60 } })
    ]);

  const [banners, categories, bestSellingProducts, topRatedProducts, featuredProducts, brands, shops, reviews] =
    await Promise.all([
      homeRes.json(),
      categoriesRes.json(),
      bestSellingRes.json(),
      topRatedRes.json(),
      featuredRes.json(),
      brandsRes.json(),
      shopsRes.json(),
      reviewsRes.json()
    ]);

  return (
    <Stack gap={5}>
      <Stack gap={2}>
        <Hero data={shops?.data || []} banners={banners?.data || []} />
        <TopBanners banners={banners?.data} />
        <WhyUs />
      </Stack>

      <Categories data={categories?.data || []} isHome />
      {/* <ProductList
        title="Featured Products"
        description="Discover a curated selection of our most loved products — handpicked for quality, popularity, and style."
        path="?featured=true"
        data={featuredProducts?.data || []}
      /> */}
      <ProductList
        title="Best Selling Products"
        description="Special products in this month"
        path="?top=1"
        data={bestSellingProducts?.data || []}
      />
      <Shops data={shops?.data || []} />
      <ProductList
        title="Top Collection"
        description="Explore our best-selling collections, featuring the latest trends and timeless styles handpicked for every
        occasion."
        path="?top=1"
        data={topRatedProducts?.data || []}
      />
      {Boolean(reviews?.data.length) && <Testimonials data={reviews?.data} />}
      <Brands data={brands?.data || []} />
      <SubscriptionModal />
    </Stack>
  );
}
