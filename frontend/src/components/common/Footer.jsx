import React from 'react';
import { Box, Container, Typography, Link, useTheme } from '@mui/material';

export const Footer = () => {
  const theme = useTheme();

  return (
    <Box
      component="footer"
      sx={{
        py: 4,
        mt: 'auto',
        borderTop: `1px solid ${theme.palette.divider}`,
        bgcolor: 'background.paper',
      }}
    >
      <Container maxWidth="xl">
        <Box
          sx={{
            display: 'flex',
            flexDirection: { xs: 'column', sm: 'row' },
            justifyContent: 'space-between',
            alignItems: 'center',
            gap: 2,
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Box
              component="img"
              src="/logo.svg"
              alt="Logo"
              sx={{ width: 22, height: 22, borderRadius: 0.8 }}
            />
            <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 600 }}>
              LinkLytics © 2026 • Full-Stack Java &amp; React Mini-Project
            </Typography>
          </Box>

          <Box sx={{ display: 'flex', gap: 3 }}>
            <Link
              href="http://localhost:8080/swagger-ui/index.html"
              target="_blank"
              rel="noreferrer"
              variant="body2"
              color="text.secondary"
              underline="hover"
            >
              OpenAPI / Swagger
            </Link>
            <Link
              href="/api/health"
              target="_blank"
              rel="noreferrer"
              variant="body2"
              color="text.secondary"
              underline="hover"
            >
              Health Check
            </Link>
          </Box>
        </Box>
      </Container>
    </Box>
  );
};
