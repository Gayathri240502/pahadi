'use client';

import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { useRouter } from '@bprogress/next';
import { useDispatch, useSelector } from 'react-redux';
import { useMutation } from '@tanstack/react-query';
import { toast } from 'react-hot-toast';
import { sum } from 'lodash';
import { useFormik, Form, FormikProvider } from 'formik';
import { useStripe, useElements, CardElement } from '@stripe/react-stripe-js';

// MUI
import { Box, Collapse, Grid, Button } from '@mui/material';

// API & Redux
import * as api from 'src/services';
import { resetCart, getCart } from 'src/redux/slices/product';

// Components
import PayPalPaymentMethod from 'src/components/paypal/paypal';
import CheckoutForm from 'src/components/forms/checkout';
import ShipmentCheckoutForm from '@/components/forms/shipment-address';
import PaymentInfo from '@/components/_main/checkout/payment-info';
import PaymentMethodCard from '@/components/_main/checkout/payment-methods';
import CartItemsCard from '@/components/cards/cart-Items';

// Hooks & Data
import { useCurrencyConvert } from '@/hooks/use-currency';
import { PayPalScriptProvider } from '@paypal/react-paypal-js';
import countries from 'src/data/countries.json';
import { checkoutSchema } from '@/validations';

const CheckoutMain = ({ isActiveStripe, isActivePaypal, paypalClientId }) => {
  const router = useRouter();
  const dispatch = useDispatch();
  const cCurrency = useCurrencyConvert();
  const stripe = useStripe();
  const elements = useElements();

  const { currency, rate } = useSelector((state) => state.settings);
  const { checkout } = useSelector((state) => state.product);
  const { user: userData } = useSelector((state) => state.user);
  const { cart, total, shipping } = checkout;

  const [paymentMethod, setPaymentMethod] = useState('COD');
  const [checked, setChecked] = useState(false);
  const [couponCode, setCouponCode] = useState(null);
  const [checkoutError, setCheckoutError] = useState(null);
  const [isProcessing, setProcessingTo] = useState(false);
  const [totalWithDiscount, setTotalWithDiscount] = useState(null);
  const [loading, setLoading] = useState(true);
  const [hasPlacedOrder, setHasPlacedOrder] = useState(false);

  const { mutate, isPending: isLoading } = useMutation({
    mutationKey: ['order'],
    mutationFn: api.placeOrder,
    onSuccess: (data) => {
      setHasPlacedOrder(true);
      toast.success('Order placed successfully!');
      router.push(`/order/${data.orderId}`);
      dispatch(resetCart());
    },
    onError: (err) => {
      toast.error(err.response?.data?.message || 'Failed to place order');
    },
    onSettled: () => {
      setProcessingTo(false);
    }
  });

  const newAddressSchema = useMemo(() => checkoutSchema(checked), [checked]);

  const formik = useFormik({
    initialValues: {
      firstName: userData?.firstName || '',
      lastName: userData?.lastName || '',
      phone: userData?.phone || '',
      email: userData?.email || '',
      address: userData?.address || '',
      city: userData?.city || '',
      state: userData?.state || '',
      country: userData?.country || '',
      zip: userData?.zip || '',
      note: '',
      shippingAddress: checked
        ? {
            firstName: '',
            lastName: '',
            phone: '',
            email: '',
            address: '',
            city: '',
            state: '',
            country: '',
            zip: ''
          }
        : {}
    },
    enableReinitialize: true,
    validationSchema: newAddressSchema,
    onSubmit: async (values) => {
      const items = cart.map((item) => ({ ...item }));
      const totalItems = sum(items.map((i) => i.quantity));

      const data = {
        paymentMethod,
        items,
        user: values,
        totalItems,
        couponCode,
        currency,
        conversionRate: rate,
        shipping: Number(shipping) || 0
      };

      if (paymentMethod === 'stripe') {
        await handleStripePayment(data);
      } else {
        mutate(data);
      }
    }
  });

  const { errors, values, touched, handleSubmit, getFieldProps, isValid, setFieldValue } = formik;

  const handleStripePayment = useCallback(
    async (data) => {
      setProcessingTo(true);
      setCheckoutError(null);

      const selected = countries.find((v) => v.label?.toLowerCase() === values.country?.toLowerCase());

      const billingDetails = {
        name: `${values.firstName} ${values.lastName}`,
        email: values.email,
        address: {
          city: values.city,
          line1: values.address,
          state: values.state,
          postal_code: values.zip,
          country: selected?.code?.toLowerCase() || 'us'
        }
      };

      const cardElement = elements.getElement(CardElement);
      try {
        const { client_secret: clientSecret } = await api.paymentIntents(
          cCurrency(totalWithDiscount || checkout.total),
          currency
        );

        const paymentMethodReq = await stripe.createPaymentMethod({
          type: 'card',
          card: cardElement,
          billing_details: billingDetails
        });

        if (paymentMethodReq.error) {
          setCheckoutError(paymentMethodReq.error.message);
          setProcessingTo(false);
          return;
        }

        const { error } = await stripe.confirmCardPayment(clientSecret, {
          payment_method: paymentMethodReq.paymentMethod.id
        });

        if (error) {
          setCheckoutError(error.message);
          setProcessingTo(false);
          return;
        }

        mutate({ ...data, paymentMethod: 'Stripe', couponCode, paymentId: paymentMethodReq.paymentMethod.id });
      } catch (err) {
        setCheckoutError(err?.response?.data?.message || 'Payment failed');
      } finally {
        setProcessingTo(false);
      }
    },
    [values, totalWithDiscount, checkout.total, currency, couponCode, stripe, elements, mutate, cCurrency]
  );

  const onSuccessPaypal = useCallback(
    (paymentId) => {
      const items = cart.map((item) => ({ ...item }));
      const totalItems = sum(items.map((i) => i.quantity));

      mutate({
        paymentMethod: 'PayPal',
        items,
        user: values,
        totalItems,
        couponCode,
        shipping: Number(shipping) || 0,
        paymentId,
        currency,
        conversionRate: rate
      });
    },
    [cart, values, couponCode]
  );

  const digitalProducts = cart.filter((item) => item.deliveryType === 'digital');

  useEffect(() => {
    formik.validateForm();
    if (!hasPlacedOrder && cart.length < 1) {
      router.push('/');
    } else {
      if (digitalProducts.length) {
        setPaymentMethod('stripe');
      }
      setLoading(false);
      dispatch(getCart({ cart, shipping }));
    }
  }, [hasPlacedOrder]);

  return (
    <FormikProvider value={formik}>
      <Form autoComplete="off" noValidate onSubmit={handleSubmit}>
        <Box py={5}>
          <Grid container spacing={2}>
            <Grid size={{ md: 8, xs: 12 }}>
              <CheckoutForm
                getFieldProps={getFieldProps}
                setFieldValue={setFieldValue}
                touched={touched}
                errors={errors}
                handleChangeShipping={(e) => setChecked(e.target.checked)}
                checked={checked}
                phone={values.phone}
              />
              <Collapse in={checked}>
                <ShipmentCheckoutForm getFieldProps={getFieldProps} touched={touched} errors={errors} />
              </Collapse>
            </Grid>

            <Grid size={{ md: 4, xs: 12 }}>
              <CartItemsCard cart={cart} loading={loading} />
              <PaymentInfo loading={loading} setCouponCode={setCouponCode} setTotal={setTotalWithDiscount} />

              <PaymentMethodCard
                isActiveStripe={isActiveStripe}
                isActivePaypal={isActivePaypal}
                loading={loading}
                value={paymentMethod}
                setValue={setPaymentMethod}
                error={checkoutError}
                isAnyDigital={Boolean(digitalProducts.length)}
              />

              <br />

              <Collapse in={isActivePaypal && paymentMethod === 'paypal'}>
                <PayPalScriptProvider
                  options={{
                    'client-id': paypalClientId,
                    currency: currency,
                    'disable-funding': 'paylater',
                    vault: true,
                    intent: 'capture'
                  }}
                >
                  <PayPalPaymentMethod
                    onSuccess={onSuccessPaypal}
                    values={values}
                    total={cCurrency(totalWithDiscount || total)}
                    isValid={isValid}
                    formik={formik}
                    couponCode={couponCode}
                    currency={currency}
                  />
                </PayPalScriptProvider>
              </Collapse>

              <Collapse in={paymentMethod !== 'paypal'}>
                <Button
                  variant="contained"
                  fullWidth
                  size="large"
                  type="submit"
                  disabled={isLoading || isProcessing || loading}
                >
                  {isLoading || isProcessing ? 'Processing...' : 'Place Order'}
                </Button>
              </Collapse>
            </Grid>
          </Grid>
        </Box>
      </Form>
    </FormikProvider>
  );
};

export default CheckoutMain;
