import React from 'react';
import PropTypes from 'prop-types';
import { fDateShort } from '@/utils/format-time';
import { useRouter } from '@bprogress/next';

// mui
import { styled } from '@mui/material/styles';
import { Box, TableRow, Skeleton, TableCell, Typography, Stack, IconButton, Tooltip, Chip } from '@mui/material';

// icons
import { MdEdit } from 'react-icons/md';
import { MdDelete } from 'react-icons/md';

// components
import BlurImage from '@/components/blur-image';

Category.propTypes = {
  isLoading: PropTypes.bool.isRequired,
  row: PropTypes.shape({
    name: PropTypes.string.isRequired,
    description: PropTypes.string,
    status: PropTypes.string.isRequired,
    createdAt: PropTypes.instanceOf(Date).isRequired,
    cover: PropTypes.shape({
      url: PropTypes.string
    }),
    slug: PropTypes.string.isRequired,
    parentCategory: PropTypes.shape({
      name: PropTypes.string,
      cover: PropTypes.shape({
        url: PropTypes.string
      })
    })
  }).isRequired,
  handleClickOpen: PropTypes.func.isRequired
};

const ThumbImgStyle = styled(Box)(({ theme }) => ({
  width: 50,
  height: 50,
  minWidth: 50,
  objectFit: 'cover',
  background: theme.palette.background.default,
  marginRight: theme.spacing(2),
  border: '1px solid ' + theme.palette.divider,
  borderRadius: theme.shape.borderRadiusSm,
  position: 'relative',
  overflow: 'hidden'
}));

export default function Category({ isLoading, row, handleClickOpen }) {
  const router = useRouter();

  return (
    <TableRow hover>
      {/* CATEGORY IMAGE + NAME */}
      <TableCell component="th" scope="row">
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          {isLoading ? (
            <Skeleton variant="rounded" width={50} height={50} sx={{ borderRadius: 1 }} />
          ) : (
            <ThumbImgStyle>
              <BlurImage
                priority
                fill
                alt={row?.name || 'Category'}
                src={row?.cover?.url || '/no-image.png'}
                objectFit="cover"
              />
            </ThumbImgStyle>
          )}
          <Typography variant="subtitle2" noWrap>
            {isLoading ? <Skeleton variant="text" width={120} sx={{ ml: 1 }} /> : row?.name}
          </Typography>
        </Box>
      </TableCell>

      {/* PARENT CATEGORY IMAGE + NAME */}
      <TableCell component="th" scope="row">
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          {isLoading ? (
            <Skeleton variant="rounded" width={50} height={50} sx={{ borderRadius: 1 }} />
          ) : (
            <ThumbImgStyle>
              <BlurImage
                priority
                fill
                alt={row?.parentCategory?.name || 'No Parent'}
                src={row?.parentCategory?.cover?.url || '/no-image.png'}
                objectFit="cover"
              />
            </ThumbImgStyle>
          )}
          <Typography variant="subtitle2" noWrap>
            {isLoading ? (
              <Skeleton variant="text" width={120} sx={{ ml: 1 }} />
            ) : (
              row?.parentCategory?.name || 'No Parent Category'
            )}
          </Typography>
        </Box>
      </TableCell>

      {/* STATUS */}
      <TableCell>
        {isLoading ? (
          <Skeleton variant="text" />
        ) : (
          <Chip
            size="small"
            label={row?.status}
            color={row?.status?.toLowerCase() === 'active' ? 'success' : 'error'}
          />
        )}
      </TableCell>

      {/* CREATED DATE */}
      <TableCell>{isLoading ? <Skeleton variant="text" /> : fDateShort(row.createdAt)}</TableCell>

      {/* ACTION BUTTONS */}
      <TableCell align="right">
        <Stack direction="row" justifyContent="flex-end">
          {isLoading ? (
            <>
              <Skeleton variant="circular" width={34} height={34} sx={{ mr: 1 }} />
              <Skeleton variant="circular" width={34} height={34} />
            </>
          ) : (
            <>
              <Tooltip title="Edit">
                <IconButton onClick={() => router.push(`/admin/categories/sub-categories/${row?.slug}`)}>
                  <MdEdit />
                </IconButton>
              </Tooltip>

              <Tooltip title="Delete">
                {/* FIXED: Wrapped in arrow function */}
                <IconButton onClick={() => handleClickOpen(row.slug)}>
                  <MdDelete />
                </IconButton>
              </Tooltip>
            </>
          )}
        </Stack>
      </TableCell>
    </TableRow>
  );
}
