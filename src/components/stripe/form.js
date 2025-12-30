import PropTypes from 'prop-types';
import { CardElement } from '@stripe/react-stripe-js';

// components
import CheckoutError from './error';

// MUI
import { Paper } from '@mui/material';
import { useTheme } from '@mui/material/styles';

const CheckoutForm = ({ error, onCardChange }) => {
  const theme = useTheme();

  const handleCardDetailsChange = (event) => {
    if (onCardChange) onCardChange(event);
  };

  const cardElementStyles = {
    base: {
      color: theme.palette.text.primary,
      fontSize: '16px',
      iconColor: theme.palette.text.primary,
      '::placeholder': {
        color: theme.palette.text.secondary
      }
    },
    invalid: {
      iconColor: theme.palette.error.main,
      color: theme.palette.error.main
    },
    complete: {
      iconColor: theme.palette.success.main,
      color: theme.palette.text.primary
    }
  };

  const cardElementOptions = {
    iconStyle: 'solid',
    style: cardElementStyles,
    hidePostalCode: true
  };

  return (
    <>
      <Paper
        sx={{
          height: 48,
          borderRadius: '6px',
          backgroundColor: 'background.paper',
          border: `1px solid ${theme.palette.divider}`,
          display: 'flex',
          alignItems: 'center',

          '& .StripeElement': {
            width: '100%',
            padding: '12px 14px'
          }
        }}
      >
        <CardElement options={cardElementOptions} onChange={handleCardDetailsChange} />
      </Paper>

      {error && <CheckoutError>{error}</CheckoutError>}
    </>
  );
};

CheckoutForm.propTypes = {
  error: PropTypes.string,
  onCardChange: PropTypes.func
};

export default CheckoutForm;
