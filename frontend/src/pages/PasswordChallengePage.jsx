import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import {
  Box,
  Container,
  Paper,
  Typography,
  TextField,
  Button,
  Alert,
  useTheme,
} from '@mui/material';
import { Lock, ArrowRight, ShieldCheck } from 'lucide-react';
import axios from 'axios';

export const PasswordChallengePage = () => {
  const { shortCode } = useParams();
  const theme = useTheme();

  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleUnlock = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      setError('');
      const backendUrl = import.meta.env.VITE_BACKEND_URL || '';
      const res = await axios.post(`${backendUrl}/r/${shortCode}/verify`, { password });
      if (res.data?.destinationUrl) {
        window.location.href = res.data.destinationUrl;
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Incorrect password. Access denied.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="xs" sx={{ py: 12 }}>
      <Paper
        elevation={4}
        sx={{
          p: 4,
          borderRadius: 4,
          textAlign: 'center',
          bgcolor: 'background.paper',
          border: `1px solid ${theme.palette.divider}`,
        }}
      >
        <Box
          sx={{
            width: 56,
            height: 56,
            borderRadius: '50%',
            bgcolor: 'rgba(236, 72, 153, 0.1)',
            color: '#EC4899',
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            mb: 2,
          }}
        >
          <Lock size={26} />
        </Box>

        <Typography variant="h5" sx={{ fontWeight: 800, mb: 1 }}>
          Password Protected
        </Typography>

        <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
          The link <strong className="font-mono">/r/{shortCode}</strong> is protected. Please enter the password to proceed.
        </Typography>

        {error && <Alert severity="error" sx={{ mb: 2, textAlign: 'left' }}>{error}</Alert>}

        <form onSubmit={handleUnlock}>
          <TextField
            label="Enter Link Password"
            type="password"
            fullWidth
            required
            autoFocus
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            sx={{ mb: 2 }}
          />

          <Button
            type="submit"
            variant="contained"
            color="primary"
            fullWidth
            size="large"
            disabled={loading || !password}
            endIcon={<ArrowRight size={16} />}
          >
            {loading ? 'Verifying...' : 'Unlock Destination'}
          </Button>
        </form>

        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1, mt: 3, color: 'text.secondary', fontSize: '0.75rem' }}>
          <ShieldCheck size={14} color="#10B981" /> Secured by LinkLytics
        </Box>
      </Paper>
    </Container>
  );
};
