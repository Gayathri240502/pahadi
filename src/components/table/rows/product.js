import PropTypes from 'prop-types';
import { useRouter } from '@bprogress/next';
import { enUS } from 'date-fns/locale';
import Link from '@/utils/link';
// mui
import {
  Box,
  TableRow,
  Skeleton,
  TableCell,
  Typography,
  Stack,
  IconButton,
  Rating,
  Tooltip,
  Chip
} from '@mui/material';

// redux
import { fDateShort } from '@/utils/format-time';

// components

import BlurImage from '@/components/blur-image';

// icons
import { MdEdit } from 'react-icons/md';
import { MdDelete } from 'react-icons/md';
import { IoEye } from 'react-icons/io5';

import { useSelector } from '@/redux';
import { useCurrencyFormat } from '@/hooks/use-currency-format';
export default function ProductRow({ isLoading, row, handleClickOpen, isVendor }) {
  const router = useRouter();
  const { currency } = useSelector((state) => state.settings);
  const fCurrency = useCurrencyFormat('base');
  return (
    <TableRow hover key={Math.random()}>
      <TableCell component="th" scope="row" sx={{ maxWidth: 300 }}>
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center'
          }}
        >
          {isLoading ? (
            <Skeleton variant="rectangular" width={50} height={50} sx={{ borderRadius: 1 }} />
          ) : (
            <Box
              sx={{
                position: 'relative',
                overflow: 'hidden',
                width: 50,
                height: 50,
                bgcolor: 'background.default',
                mr: 2,
                border: (theme) => '1px solid ' + theme.palette.divider,
                borderRadius: '6px',
                img: {
                  borderRadius: '2px'
                }
              }}
            >
              <BlurImage alt={row?.name} src={row?.image.url} layout="fill" objectFit="cover" />
            </Box>
          )}
          <Typography variant="subtitle2" noWrap>
            {isLoading ? <Skeleton variant="text" width={120} sx={{ ml: 1 }} /> : row?.name}
          </Typography>
        </Box>
      </TableCell>
      <TableCell>
        {isLoading ? <Skeleton variant="text" /> : fCurrency(row?.salePrice || row?.price, currency)}
      </TableCell>
      {/* <TableCell>
        <Skeleton variant="text" />
      </TableCell> */}

      <TableCell>
        {isLoading ? (
          <Skeleton variant="text" />
        ) : (
          <Chip
            size="small"
            label={
              (row?.stockQuantity < 1 && 'Out of stock') ||
              (row?.stockQuantity < 20 && 'Low stock') ||
              (row?.stockQuantity >= 20 && 'In stock')
            }
            color={
              (row?.stockQuantity < 1 && 'error') ||
              (row?.stockQuantity < 20 && 'warning') ||
              (row?.stockQuantity >= 20 && 'success') ||
              'primary'
            }
          />
        )}
      </TableCell>
      <TableCell>
        {isLoading ? (
          <Skeleton variant="text" />
        ) : (
          <Chip
            size="small"
            label={row?.status}
            color={
              row.status === 'published'
                ? 'success'
                : row.status === 'draft'
                  ? 'warning'
                  : row.status === 'pending'
                    ? 'info'
                    : 'default'
            }
          />
        )}
      </TableCell>
      <TableCell align="left">
        {isLoading ? (
          <Skeleton variant="text" />
        ) : (
          <Rating name="text-feedback" size="small" value={row?.averageRating || 0} readOnly precision={0.5} />
        )}
      </TableCell>

      <TableCell>{isLoading ? <Skeleton variant="text" /> : <>{fDateShort(row?.createdAt, enUS)}</>}</TableCell>
      <TableCell align="right">
        {isLoading ? (
          <Stack direction="row" justifyContent="flex-end">
            <Skeleton variant="circular" width={34} height={34} sx={{ mr: 1 }} />
            <Skeleton variant="circular" width={34} height={34} sx={{ mr: 1 }} />
            <Skeleton variant="circular" width={34} height={34} />
          </Stack>
        ) : (
          <Stack direction="row" justifyContent="flex-end">
            <Tooltip title="Preview">
              <Link target="_blank" href={`/product/${row.slug}`}>
                <IconButton>
                  <IoEye />
                </IconButton>
              </Link>
            </Tooltip>
            <Tooltip title="Edit">
              <IconButton onClick={() => router.push(`/${isVendor ? 'vendor' : 'admin'}/products/${row.slug}`)}>
                <MdEdit />
              </IconButton>
            </Tooltip>
            <Tooltip title="Delete">
              <IconButton onClick={handleClickOpen(row.slug)}>
                <MdDelete />
              </IconButton>
            </Tooltip>
          </Stack>
        )}
      </TableCell>
    </TableRow>
  );
}
ProductRow.propTypes = {
  isLoading: PropTypes.bool.isRequired,

  row: PropTypes.shape({
    image: PropTypes.object.isRequired,
    name: PropTypes.string.isRequired,
    images: PropTypes.arrayOf(
      PropTypes.shape({
        url: PropTypes.string.isRequired
      })
    ).isRequired,
    createdAt: PropTypes.instanceOf(Date).isRequired,
    available: PropTypes.number,
    averageRating: PropTypes.number.isRequired,
    salePrice: PropTypes.number,
    price: PropTypes.number.isRequired,
    slug: PropTypes.string.isRequired
  }).isRequired,

  handleClickOpen: PropTypes.func.isRequired
};
