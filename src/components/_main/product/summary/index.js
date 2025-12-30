// react
'use client';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';

import { useRouter } from '@bprogress/next';
import PropTypes from 'prop-types';

// mui
import { Box, Stack, Button, IconButton, Typography, FormHelperText, Rating, Tooltip, Chip } from '@mui/material';

// formik
import { useFormik, Form, FormikProvider } from 'formik';

// redux
import { useDispatch, useSelector } from 'src/redux';
import { addCart } from 'src/redux/slices/product';

// styles & hooks
import { useCurrencyConvert } from '@/hooks/use-currency';
import { useCurrencyFormat } from '@/hooks/use-currency-format';

import { MdContentCopy } from 'react-icons/md';
import { LiaShippingFastSolid } from 'react-icons/lia';
import { MdLockOutline } from 'react-icons/md';
import { FaRegStar } from 'react-icons/fa';
import { FiShoppingCart } from 'react-icons/fi';
import { IoBagCheckOutline } from 'react-icons/io5';
import { useSearchParams } from 'next/navigation';
import { FiExternalLink } from 'react-icons/fi';

import VariantSelection from '../variant-selection';
import SocialShare from '../social-share';
import Incrementer from '@/components/incrementer';

// PropTypes
ProductDetailsSumary.propTypes = {
  product: PropTypes.object.isRequired,
  id: PropTypes.string.isRequired,
  totalRating: PropTypes.number.isRequired,
  onClickWishList: PropTypes.func.isRequired,
  wishlist: PropTypes.array.isRequired
};

export default function ProductDetailsSumary({ ...props }) {
  const { product, totalRating, totalReviews, setSelectedVariant, selectedVariant, isSimpleProduct, isPopup } = props;
  const searchParams = useSearchParams();
  const variantParam = searchParams.get('variant') || '';

  const cCurrency = useCurrencyConvert();
  const fCurrency = useCurrencyFormat();

  const [isInitialized, setInitialized] = useState(false);
  const [variantObj, setVariantObj] = useState(
    isSimpleProduct
      ? null
      : {
          ...product.variants[0],
          name: product.variants[0].name
        }
  );

  useEffect(() => {
    setInitialized(true);
  }, []);

  const router = useRouter();
  const dispatch = useDispatch();

  const { checkout } = useSelector(({ product }) => product);
  const { user } = useSelector(({ user }) => user);
  const isNotUser = user?.role === 'vendor' || user?.role?.includes('admin');

  const [isLoaded, setLoaded] = useState(false);

  const variantList = isSimpleProduct ? [] : product.variants.map((v) => v.name);
  const names = isSimpleProduct ? [] : product.variants[0].variant.split('/');
  const variants = names.map((_, i) => variantList.map((variantObj) => variantObj.split('/')[i]));
  const stockQuantity = isSimpleProduct ? product.stockQuantity : variantObj?.stockQuantity || 0;

  const isMaxQuantity =
    checkout?.cart?.filter((item) => item._id === product._id)?.map((item) => item.quantity)[0] >= stockQuantity;

  const onAddCart = (param) => {
    toast.success('Added to cart');
    dispatch(addCart(param));
  };

  // Formik
  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      pid: product._id,
      quantity: 1
    },
    onSubmit: async (values, { setSubmitting }) => {
      try {
        if (isNotUser) {
          toast.error('Only user can add to cart');
          return;
        }

        const alreadyProduct = checkout.cart.filter(
          (item) => item.sku === (isSimpleProduct ? product : variantObj).sku
        );

        if (!Boolean(alreadyProduct.length)) {
          onAddCart({
            pid: product._id,
            name: product.name,
            sku: (isSimpleProduct ? product : variantObj).sku,
            slug: product.slug + (isSimpleProduct ? '' : '?variant=' + variantObj.name),
            stockQuantity,
            type: product.type,
            deliveryType: product.deliveryType,
            ...(product.deliveryType === 'digital' && {
              downloadLink: (isSimpleProduct ? product : variantObj).downloadLink
            }),
            ...(!isSimpleProduct && {
              variant: variantObj.name,
              variantName: variantObj.variant
            }),
            image: (isSimpleProduct ? product : variantObj).images[0].url,
            quantity: values.quantity,
            discount:
              (isSimpleProduct ? product : variantObj).price - (isSimpleProduct ? product : variantObj).salePrice,
            price: (isSimpleProduct ? product : variantObj).salePrice || (isSimpleProduct ? product : variantObj).price,
            subtotal:
              ((isSimpleProduct ? product : variantObj).salePrice || (isSimpleProduct ? product : variantObj).price) *
              values.quantity
          });

          setFieldValue('quantity', 1);
        }

        setSubmitting(false);
        router.push('/cart');
      } catch {
        setSubmitting(false);
      }
    }
  });

  const { values, touched, errors, setFieldValue, handleSubmit } = formik;

  const handleAddCart = () => {
    if (isNotUser) {
      toast.error('Only user can add to cart');
      return;
    }

    const alreadyProduct = checkout.cart.filter(
      (item) => item.sku === (isSimpleProduct ? product : variantObj).sku && item.deliveryType === 'digital'
    );

    if (Boolean(alreadyProduct.length)) {
      toast.error('Product is already in cart');
      return;
    }

    onAddCart({
      pid: product._id,
      name: product.name,
      sku: (isSimpleProduct ? product : variantObj).sku,
      slug: product.slug + (isSimpleProduct ? '' : '?variant=' + variantObj.name),
      stockQuantity,
      type: product.type,
      deliveryType: product.deliveryType,
      ...(product.deliveryType === 'digital' && {
        downloadLink: (isSimpleProduct ? product : variantObj).downloadLink
      }),
      ...(!isSimpleProduct && {
        variant: variantObj.name,
        variantName: variantObj.variant
      }),
      discount: (isSimpleProduct ? product : variantObj).price - (isSimpleProduct ? product : variantObj).salePrice,
      image: (isSimpleProduct ? product : variantObj).images[0].url,
      quantity: values.quantity,
      price: (isSimpleProduct ? product : variantObj).salePrice || (isSimpleProduct ? product : variantObj).price,
      subtotal:
        ((isSimpleProduct ? product : variantObj).salePrice || (isSimpleProduct ? product : variantObj).price) *
        values.quantity
    });

    setFieldValue('quantity', 1);
  };

  const onChangeVariant = (name, i) => {
    let splited = selectedVariant.split('/');
    splited[i] = name;
    const newVariant = splited.join('/');

    setSelectedVariant(newVariant);

    const matched = product.variants.find((v) => v.name === newVariant);
    setVariantObj(matched);

    if (!isPopup) {
      const params = new URLSearchParams(searchParams.toString());
      params.set('variant', splited.join('_'));
      router.replace(`?${params.toString()}`, { scroll: false });
    }
  };

  useEffect(() => {
    if (variantParam) {
      const formatted = variantParam.replace(/_/g, '/');
      setSelectedVariant(formatted);
    }
  }, [variantParam]);

  useEffect(() => {
    setLoaded(true);
  }, []);

  return (
    <Box py={2}>
      <FormikProvider value={formik}>
        <Form autoComplete="off" noValidate onSubmit={handleSubmit}>
          <Stack gap={1}>
            {/* Discount */}
            <Box>
              {(isSimpleProduct ? product : variantObj).price <=
              (isSimpleProduct ? product : variantObj).salePrice ? null : (
                <Chip
                  color="success"
                  label={`-${(
                    100 -
                    ((isSimpleProduct ? product : variantObj).salePrice /
                      (isSimpleProduct ? product : variantObj).price) *
                      100
                  ).toFixed(0)}% Discount`}
                />
              )}
            </Box>

            {/* Brand */}
            <Typography noWrap variant="subtitle1" color="primary.main" sx={{ textTransform: 'uppercase' }}>
              {product.brand.name}
            </Typography>

            {/* Product Name */}
            <Typography variant="h3" component={'h1'} lineHeight={1}>
              {product.name}
            </Typography>

            {/* Category */}
            <Typography noWrap variant="subtitle1" color="text.secondary">
              {product.category.name}
            </Typography>

            {/* Rating */}
            <Stack direction="row" alignItems="center" justifyContent="space-between" spacing={1}>
              <Stack direction="row" alignItems="center" spacing={1}>
                <Rating value={totalRating} precision={0.1} size="small" readOnly />
                <Typography variant="subtitle2" color="text.secondary">
                  {totalReviews || 0} {totalReviews > 1 ? 'Reviews' : 'Review'}
                </Typography>
              </Stack>
            </Stack>

            <Typography variant="body1" color="text.secondary">
              {product.description}
            </Typography>

            {/* AVAILABLE STOCK — FIXED HERE */}
            {product.deliveryType === 'physical' && (
              <Typography variant="body1" color="text.secondary">
                <Typography variant="subtitle1" color="text.primary" component="span">
                  Available:
                </Typography>{' '}
                {stockQuantity ? stockQuantity + ' Items' : 'Out of stock'}
              </Typography>
            )}

            {/* Variant selection */}
            <VariantSelection
              names={names}
              variants={variants}
              product={product}
              selectedVariant={selectedVariant}
              onChangeVariant={onChangeVariant}
            />

            <Stack
              direction={{ sm: 'row', xs: 'column-reverse' }}
              gap={1}
              alignItems={{ sm: 'center', xs: 'start' }}
              justifyContent="space-between"
            >
              {product.deliveryType === 'physical' ? (
                <Stack direction="row" alignItems="center" spacing={1}>
                  <div>
                    <Incrementer
                      quantity={values.quantity}
                      stockQuantity={stockQuantity}
                      onDecrease={() => setFieldValue('quantity', values.quantity - 1)}
                      onIncrease={() => setFieldValue('quantity', values.quantity + 1)}
                    />
                    {touched.quantity && errors.quantity && <FormHelperText error>{errors.quantity}</FormHelperText>}
                  </div>
                </Stack>
              ) : (
                <div />
              )}

              {/* Price */}
              <Stack direction="row" gap={1} alignItems="center">
                {product.price <= product.salePrice ? null : (
                  <Typography component="span" color="text.secondary" sx={{ textDecoration: 'line-through' }}>
                    {isLoaded && (
                      <del>{fCurrency(cCurrency(parseInt((isSimpleProduct ? product : variantObj).price)))}</del>
                    )}
                  </Typography>
                )}

                <Typography variant="h3" sx={{ display: 'flex', alignItems: 'center' }}>
                  {isLoaded && fCurrency(cCurrency(parseInt((isSimpleProduct ? product : variantObj).salePrice)))}{' '}
                </Typography>
              </Stack>
            </Stack>

            {/* Buttons */}
            <Stack direction={{ sm: 'row', xs: 'column' }} spacing={1}>
              {/* Add to Cart */}
              <Button
                fullWidth
                size="large"
                disabled={isMaxQuantity || stockQuantity < 1}
                type="button"
                color="primary"
                variant="contained"
                onClick={() => handleAddCart()}
                startIcon={<FiShoppingCart />}
              >
                Add to Cart
              </Button>

              {/* Buy Now */}
              <Button
                disabled={stockQuantity < 1}
                fullWidth
                size="large"
                type="submit"
                variant="contained"
                color="secondary"
                startIcon={<IoBagCheckOutline />}
              >
                Buy Now
              </Button>

              {/* Demo Button */}
              {product.deliveryType === 'digital' && Boolean(product.demo) && (
                <Button
                  fullWidth
                  size="large"
                  component={Link}
                  href={product.demo}
                  target="_blank"
                  variant="contained"
                  color="info"
                  startIcon={<FiExternalLink />}
                >
                  View Demo
                </Button>
              )}
            </Stack>

            {/* Share */}
            <Stack direction="row" spacing={1} justifyContent="end">
              <Tooltip title="Copy Product URL">
                <IconButton
                  aria-label="copy"
                  onClick={() => {
                    navigator.clipboard.writeText(window?.location.href);
                    toast.success('Link copied.');
                  }}
                >
                  <MdContentCopy size={24} />
                </IconButton>
              </Tooltip>
              {isInitialized && <SocialShare />}
            </Stack>

            {/* Shipping Info */}
            <Stack direction="row" alignItems="center" spacing={2} justifyContent="end">
              {shippingData.map((item, index) => (
                <Stack
                  key={index}
                  direction="row"
                  alignItems="center"
                  spacing={1}
                  my={1}
                  sx={{ color: 'text.secondary' }}
                >
                  {item.icon}
                  <Typography variant="subtitle2" color="text.secondary">
                    {item.name}
                  </Typography>
                </Stack>
              ))}
            </Stack>
          </Stack>
        </Form>
      </FormikProvider>
    </Box>
  );
}

const shippingData = [
  {
    icon: <LiaShippingFastSolid size={20} />,
    name: 'Worldwide shipping'
  },
  {
    icon: <MdLockOutline size={20} />,
    name: 'Secure payment'
  },
  {
    icon: <FaRegStar size={20} />,
    name: '2 years full warranty'
  }
];
