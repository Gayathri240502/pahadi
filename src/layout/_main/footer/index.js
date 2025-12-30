'use client';
import React from 'react';
import Link from 'next/link';

// mui
import { alpha } from '@mui/material/styles';
import { Typography, Container, Stack, Box, IconButton, Grid, Fab, Divider, useTheme } from '@mui/material';

// components
import NewsLetter from './newsletter';
import Logo from '@/components/logo';

// icons
import { FaFacebookF, FaInstagram, FaLinkedinIn } from 'react-icons/fa';
import { MdOutlineLocationOn } from 'react-icons/md';
import { FiMail } from 'react-icons/fi';
import { MdOutlineCall } from 'react-icons/md';

const MAIN_LINKS = [
  {
    heading: 'Resources',
    listText1: 'Contact us',
    listLink1: '/contact',
    listText2: 'Products',
    listLink2: '/products',
    listText3: 'Shops',
    listLink3: '/shops'
  },
  {
    heading: 'About us',
    listText1: 'About us',
    listLink1: '/about',
    listText2: 'Privacy policy',
    listLink2: '/privacy-policy',
    listText3: 'Term and conditions',
    listLink3: '/terms-and-conditions',
    listText4: 'Refund return policy',
    listLink4: '/refund-return-policy'
  }
];

export default function Footer({ branding }) {
  const theme = useTheme();
  return (
    <Box
      sx={{
        bgcolor: (theme) => alpha(theme.palette.primary.light, 0.1),
        py: 4,
        mt: 7,
        overflow: 'hidden',
        position: 'relative',

        display: {
          md: 'block',
          xs: 'none'
        }
      }}
    >
      <Container maxWidth="xl">
        <Grid container spacing={4}>
          <Grid size={3}>
            <Stack spacing={3}>
              <Logo branding={branding} />
              <Typography variant="body1" color="text.secondary">
                Lorem Ipsum is simply dummy text of the printing and typesetting industry.
              </Typography>
              <Stack>
                <Stack direction={'row'} alignItems={'center'} gap={2}>
                  <IconButton
                    sx={{
                      svg: {
                        color: theme.palette.primary.main
                      }
                    }}
                  >
                    <MdOutlineLocationOn />
                  </IconButton>
                  <Typography variant="body1" color="text.secondary">
                    {branding.contact.address}
                  </Typography>
                </Stack>

                <Stack direction={'row'} alignItems={'center'} gap={2}>
                  <IconButton
                    sx={{
                      svg: {
                        color: theme.palette.primary.main
                      }
                    }}
                  >
                    <MdOutlineCall />
                  </IconButton>
                  <Typography
                    variant="body1"
                    color="text.secondary"
                    component="a"
                    href="/"
                    sx={{
                      ':hover': {
                        color: 'primary.main'
                      }
                    }}
                  >
                    {branding.contact.whatsappNo}
                  </Typography>
                </Stack>
                <Stack direction={'row'} alignItems={'center'} gap={2}>
                  <IconButton
                    sx={{
                      svg: {
                        color: theme.palette.primary.main
                      }
                    }}
                  >
                    <FiMail />
                  </IconButton>
                  <Typography
                    variant="body1"
                    color="text.secondary"
                    component="a"
                    href="/"
                    sx={{
                      ':hover': {
                        color: 'primary.main'
                      }
                    }}
                  >
                    {branding.contact.email}
                  </Typography>
                </Stack>
              </Stack>
            </Stack>
          </Grid>
          {MAIN_LINKS.map((item, idx) => (
            <Grid size={2} key={idx}>
              <Stack spacing={3}>
                <Typography variant="h4" color="text.primary">
                  {item.heading}
                </Typography>
                <Box
                  sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 1,
                    a: {
                      '&:hover': {
                        color: theme.palette.primary.main
                      }
                    }
                  }}
                >
                  <Typography color="text.secondary" variant="subtitle1" component={Link} href={`${item.listLink1}`}>
                    {item.listText1}
                  </Typography>
                  <Typography color="text.secondary" variant="subtitle1" component={Link} href={`${item.listLink2}`}>
                    {item.listText2}
                  </Typography>
                  <Typography color="text.secondary" variant="subtitle1" component={Link} href={`${item.listLink3}`}>
                    {item.listText3}
                  </Typography>
                  <Typography color="text.secondary" variant="subtitle1" component={Link} href={`${item.listLink4}`}>
                    {item.listText4}
                  </Typography>
                  <Typography color="text.secondary" variant="subtitle1" component={Link} href={`${item.listLink5}`}>
                    {item.listText5}
                  </Typography>
                </Box>
              </Stack>
            </Grid>
          ))}

          <Grid size={5}>
            <Stack spacing={3}>
              <Typography variant="h4" color="text.primary">
                Join a Newsletter
              </Typography>
              <NewsLetter />
              <Stack direction="row" alignItems="center" spacing={2}>
                <Fab
                  size="small"
                  color="primary"
                  component={Link}
                  href={branding.socialLinks.facebook}
                  sx={{
                    zIndex: 1
                  }}
                >
                  <FaFacebookF size={18} />
                </Fab>
                <Fab
                  size="small"
                  color="primary"
                  component={Link}
                  href={branding.socialLinks.instagram}
                  sx={{
                    zIndex: 1
                  }}
                >
                  <FaInstagram size={18} />
                </Fab>
                <Fab
                  size="small"
                  color="primary"
                  component={Link}
                  href={branding.socialLinks.linkedin}
                  sx={{
                    zIndex: 1
                  }}
                >
                  <FaLinkedinIn size={18} />{' '}
                </Fab>
              </Stack>
            </Stack>
          </Grid>
        </Grid>
        <Divider sx={{ my: 3 }} />
        <Typography variant="body1" color="text.primary" textAlign="center">
          © 2024 Pahadi. All rights reserved
        </Typography>
      </Container>
    </Box>
  );
}
