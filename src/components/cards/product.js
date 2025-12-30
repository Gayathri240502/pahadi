'use client';
import { useState } from 'react';
import PropTypes from 'prop-types';
import { useMutation } from '@tanstack/react-query';
import { useSelector } from 'react-redux';
import Link from 'next/link';
import { useRouter } from '@bprogress/next';
import { toast } from 'react-hot-toast';
import dynamic from 'next/dynamic';

// mui
import { Box, Card, Typography, Stack, IconButton, useMediaQuery, Tooltip, Skeleton, Zoom, Chip } from '@mui/material';
// components
import { useDispatch } from 'src/redux';
import { setWishlist } from 'src/redux/slices/wishlist';
import { addCompareProduct, removeCompareProduct } from '../../redux/slices/compare';

import BlurImage from '@/components/blur-image';
// hooks
import { useCurrencyConvert } from '@/hooks/use-currency';
import { useCurrencyFormat } from '@/hooks/use-currency-format';
// api
import * as api from 'src/services';
// icons
import { IoMdHeartEmpty } from 'react-icons/io';
import { GoEye } from 'react-icons/go';
import { GoGitCompare } from 'react-icons/go';
import { IoIosHeart } from 'react-icons/io';
import { FaRegStar } from 'react-icons/fa';
// dynamic
const ProductDetailsDialog = dynamic(() => import('../dialog/product-details'));
export default function ShopProductCard({ ...props }) {
  const { product, loading } = props;
  const cCurrency = useCurrencyConvert();
  const fCurrency = useCurrencyFormat();

  const [open, setOpen] = useState(false);
  const [openActions, setOpenActions] = useState(false);
  const router = useRouter();
  const dispatch = useDispatch();
  // type error
  const { wishlist } = useSelector(({ wishlist }) => wishlist);
  const { user } = useSelector(({ user }) => user);
  const { products: compareProducts } = useSelector(({ compare }) => compare);
  const isNotUser = user?.role === 'vendor' || user?.role?.includes('admin');

  const { isAuthenticated } = useSelector(({ user }) => user);
  const isTablet = useMediaQuery('(max-width:900px)');
  const [isLoading, setLoading] = useState(false);
  const [quickViewLoading, setQuickViewLoading] = useState(false);
  const [quickViewData, setQuickViewData] = useState(null);

  const handleQuickView = async (event) => {
    event.stopPropagation();
    setQuickViewLoading(true);
    try {
      const data = await api.getProductBySlug(product.slug);
      setQuickViewData(data); // store product details
      setOpen(true); // open dialog
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Failed to load product details');
    } finally {
      setQuickViewLoading(false);
    }
  };
  const { mutate } = useMutation({
    mutationFn: api.updateWishlist,
    onSuccess: (data) => {
      toast.success(data.message);
      setLoading(false);
      dispatch(setWishlist(data.data));
    },
    onError: (err) => {
      setLoading(false);
      const message = JSON.stringify(err?.response?.data?.message);
      toast.error(message ? t('common:' + JSON.parse(message)) : t('common:something-wrong'));
    }
  });

  const { name, slug, images, _id } = !loading && product;
  // averageRating
  const linkTo = `/product/${slug ? slug : ''}${product?.variant ? `?variant=${product.variant}` : ''}`;

  const onClickWishList = async (event) => {
    if (isNotUser) {
      toast.error('Only user can add to wishlist');
      return;
    }
    if (!isAuthenticated) {
      event.stopPropagation();
      router.push('/auth/sign-in');
    } else {
      event.stopPropagation();
      setLoading(true);
      await mutate(_id);
    }
  };
  const onAddCompare = async (event) => {
    if (isNotUser) {
      toast.error('Only user can add to compare');
      return;
    }
    event.stopPropagation();
    toast.success('Added to compare list');
    dispatch(addCompareProduct(product._id));
  };

  const onRemoveCompare = async (event) => {
    event.stopPropagation();
    toast.success('Removed from compare list');
    dispatch(removeCompareProduct(_id));
  };
  return (
    <Card
      onMouseEnter={() => !isLoading && setOpenActions(true)}
      onMouseLeave={() => setOpenActions(false)}
      sx={{ display: 'block' }}
    >
      <Box sx={{ position: 'relative' }}>
        {!loading && product?.stockQuantity < 1 && (
          <Chip
            size="small"
            sx={{
              top: isTablet ? 8 : 12,
              left: isTablet ? 8 : 12,
              zIndex: 9,
              position: 'absolute',
              textTransform: 'uppercase',
              fontSize: isTablet ? 8 : 12
            }}
            label="Out of Stock"
            color={'error'}
          />
        )}
        <Box
          {...(!loading &&
            product?.stockQuantity > 0 && {
              component: Link,
              href: linkTo
            })}
          sx={{
            bgcolor: isLoading || loading ? 'transparent' : 'common.white',
            position: 'relative',
            cursor: 'pointer',
            aspectRatio: '1 / 1',

            '&:after': { content: `""`, display: 'block', paddingBottom: '100%' },
            width: '100%',
            img: {
              objectFit: 'cover'
            }
          }}
        >
          {loading ? (
            <Skeleton variant="rectangular" width="100%" sx={{ height: '100%', position: 'absolute' }} />
          ) : (
            <BlurImage alt={name} src={images[0].url} fill draggable="false" sizes="(max-width: 600px) 100vw, 50vw" />
          )}
        </Box>
        <Zoom in={openActions}>
          <Box>
            {}
            <Stack
              direction={'row'}
              sx={{
                position: 'absolute',
                bottom: 8,
                left: '50%',
                transform: 'translate(-50%, 0px)',
                bgcolor: 'background.paper',
                borderRadius: '27px',
                p: '2px',
                zIndex: 11
              }}
            >
              <Tooltip title="Quick View">
                <span>
                  {' '}
                  {/* span to wrap disabled IconButton */}
                  <IconButton
                    aria-label="Quick View"
                    disabled={loading || product?.stockQuantity < 1 || quickViewLoading}
                    onClick={handleQuickView}
                    size={isTablet ? 'small' : 'medium'}
                  >
                    {quickViewLoading ? <Skeleton variant="circular" width={24} height={24} /> : <GoEye />}
                  </IconButton>
                </span>
              </Tooltip>

              {wishlist?.filter((v) => v === _id).length > 0 ? (
                <Tooltip title="Remove from cart">
                  <IconButton
                    disabled={isLoading}
                    onClick={onClickWishList}
                    aria-label="Remove from cart"
                    color="primary"
                    size={isTablet ? 'small' : 'medium'}
                  >
                    <IoIosHeart />
                  </IconButton>
                </Tooltip>
              ) : (
                <Tooltip title="Add to wishlist">
                  <IconButton
                    disabled={isLoading}
                    onClick={onClickWishList}
                    aria-label="add to wishlist"
                    size={isTablet ? 'small' : 'medium'}
                  >
                    <IoMdHeartEmpty />
                  </IconButton>
                </Tooltip>
              )}
              {compareProducts?.filter((v) => v._id === _id).length > 0 ? (
                <Tooltip title="Remove from cart">
                  <IconButton
                    disabled={isLoading}
                    onClick={onRemoveCompare}
                    aria-label="Remove from compare"
                    color="primary"
                    size={isTablet ? 'small' : 'medium'}
                  >
                    <GoGitCompare />
                  </IconButton>
                </Tooltip>
              ) : (
                <Tooltip title="Add to compare">
                  <IconButton
                    disabled={isLoading}
                    onClick={onAddCompare}
                    aria-label="add to compare"
                    size={isTablet ? 'small' : 'medium'}
                  >
                    <GoGitCompare />
                  </IconButton>
                </Tooltip>
              )}
            </Stack>
          </Box>
        </Zoom>
      </Box>

      <Stack
        justifyContent="center"
        sx={{
          zIndex: 111,
          p: 1,
          width: '100%',

          a: { color: 'text.primary', textDecoration: 'none' }
        }}
      >
        <Box sx={{ display: 'grid' }}>
          {' '}
          <Typography
            sx={{
              cursor: 'pointer',
              textTransform: 'capitalize'
              // fontWeight: 500,
            }}
            {...(product?.stockQuantity > 0 && { component: Link, href: linkTo })}
            variant={'subtitle1'}
            noWrap
          >
            {loading ? <Skeleton variant="text" width={120} /> : name}{' '}
            {product?.variant ? ' | ' + product?.variant.split('/').join(' | ').toUpperCase() : ''}
          </Typography>
        </Box>
        <Stack direction="row" alignItems="center" justifyContent="space-between" spacing={1}>
          <Typography variant="subtitle2" color="text.primary" sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
            {loading ? (
              <>
                <Skeleton variant="text" width={72} />
              </>
            ) : (
              <>
                <FaRegStar /> ({product.averageRating?.toFixed(1) || 0})
              </>
            )}
          </Typography>
        </Stack>

        <Stack spacing={0.5} direction="row" justifyContent={'space-between'} alignItems="center">
          <Typography
            variant={isTablet ? 'body1' : 'h5'}
            component="p"
            sx={{
              fontWeight: 700,
              display: 'flex',
              alignItems: 'center',
              '& .discount': { fontSize: { md: 14, xs: 12 }, fontWeight: 600, color: 'error.main', ml: 0.5 }
            }}
          >
            {loading ? (
              <Skeleton variant="text" width={120} />
            ) : (
              <>
                <span>{fCurrency(cCurrency(product?.salePrice))}</span>
                <span className="discount">
                  ({`-${(100 - (product?.salePrice / product?.price) * 100).toFixed()}%`})
                </span>
              </>
            )}
          </Typography>
        </Stack>
      </Stack>
      {open && quickViewData && (
        <ProductDetailsDialog
          product={quickViewData} // <-- send full data
          slug={product.slug} // optional if dialog still needs slug
          open={open}
          isSimpleProduct={product.type === 'simple'}
          onClose={() => setOpen(false)}
        />
      )}
    </Card>
  );
}
ShopProductCard.propTypes = {
  product: PropTypes.shape({
    _id: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    slug: PropTypes.string,
    sku: PropTypes.string,
    status: PropTypes.string,
    images: PropTypes.array.isRequired,
    price: PropTypes.number.isRequired,
    salePrice: PropTypes.number,
    stockQuantity: PropTypes.number,
    colors: PropTypes.array,
    averageRating: PropTypes.number
  }),
  loading: PropTypes.bool.isRequired
};
