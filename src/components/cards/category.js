'use client';
import PropTypes from 'prop-types';
import Link from 'next/link';
import { Typography, CardActionArea, Card, Box, Stack } from '@mui/material';
import Image from '@/components/blur-image';

export default function CategoriesCard({ category, slug }) {
  const baseUrl = '/products/' + (slug ? slug + '/' : '');

  return (
    <Stack spacing={1} alignItems="center" width="100%">
      <Card
        sx={{
          borderRadius: '50%',
          borderWidth: '3px !important',
          transform: 'scale(1.0)',
          transition: 'all 0.2s ease-in-out',
          width: '100%',
          aspectRatio: '1 / 1',
          '&:hover': {
            color: '#000',
            borderColor: (theme) => theme.palette.primary.main + '!important',
            transform: 'scale(1.05)'
          },
          '& .image-wrapper': {
            position: 'relative',
            width: '100%',
            height: '100%',
            img: {
              borderRadius: '50%'
            }
          }
        }}
      >
        <CardActionArea component={Link} href={`${baseUrl + category?.slug}`} sx={{ height: '100%' }}>
          <Box className="image-wrapper">
            <Image
              alt="category"
              src={category?.cover?.url}
              layout="fill"
              objectFit="cover"
              draggable="false"
              quality={5}
              sizes="100vw"
            />
          </Box>
        </CardActionArea>
      </Card>

      <Typography
        component={Link}
        href={baseUrl + category.slug}
        color="text.primary"
        variant="subtitle1"
        textAlign="center"
        noWrap
        className="title"
        sx={{
          py: 0.5,
          textTransform: 'capitalize',
          fontWeight: 700,
          fontSize: {
            sm: 16,
            xs: 12
          }
        }}
      >
        {category?.name}
      </Typography>
    </Stack>
  );
}

CategoriesCard.propTypes = {
  category: PropTypes.shape({
    slug: PropTypes.string.isRequired,
    cover: PropTypes.shape({
      url: PropTypes.string.isRequired,
      blurDataURL: PropTypes.string
    }),
    name: PropTypes.string.isRequired
  }).isRequired,
  slug: PropTypes.string
};
