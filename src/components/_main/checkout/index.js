'use client';
import React from 'react';
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import CheckoutMain from './checkout-main';

export default function Checkout({ data }) {
  const { isActive: isActiveStripe, publishableKey } = data.stripe;
  const { isActive: isActivePaypal, clientId: paypalClientId } = data.paypal;

  const stripePromise = publishableKey ? loadStripe(publishableKey) : null;

  return (
    <Elements stripe={stripePromise}>
      <CheckoutMain isActiveStripe={isActiveStripe} isActivePaypal={isActivePaypal} paypalClientId={paypalClientId} />
    </Elements>
  );
}
