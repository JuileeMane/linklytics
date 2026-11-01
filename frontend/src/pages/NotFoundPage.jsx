import React from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { Box, Container, Typography, Button, Paper } from '@mui/material';
import { Compass, Home } from 'lucide-react';

export const NotFoundPage = () => {
  return (
    <Container maxWidth="sm" sx={{ py: 14, textAlign: 'center' }}>
      <Paper elevation={0} sx={{ p: 6, borderRadius: 4, bgcolor: 'background.subtle', border: '1px solid', borderColor: 'divider' }}>
        <Compass size={64} color="#6366F1" style={{ opacity: 0.8, marginBottom: 16 }} />
        <Typography variant="h1" className="font-mono" sx={{ fontWeight: 800, fontSize: '4.5rem', color: 'primary.main', mb: 1 }}>
          404
        </Typography>
        <Typography variant="h5" sx={{ fontWeight: 700, mb: 1 }}>
          Destination Not Found
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ maxWidth: 380, mx: 'auto', mb: 4 }}>
          The page or short link you are looking for does not exist, has expired, or may have been removed.
        </Typography>
        <Button
          component={RouterLink}
          to="/"
          variant="contained"
          color="primary"
          size="large"
          startIcon={<Home size={18} />}
        >
          Return Home
        </Button>
      </Paper>
    </Container>
  );
};
