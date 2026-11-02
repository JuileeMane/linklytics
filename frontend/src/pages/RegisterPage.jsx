import React, { useState } from 'react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
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
import { UserPlus, Sparkles } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export const RegisterPage = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const { register } = useAuth();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password.length < 6) {
      setError('Password must be at least 6 characters long.');
      return;
    }

    try {
      setLoading(true);
      setError('');
      await register(name, email, password);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Registration failed. Please check your details.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="xs" sx={{ py: { xs: 8, md: 12 } }}>
      <Paper
        elevation={4}
        sx={{
          p: { xs: 3, sm: 4 },
          borderRadius: 4,
          bgcolor: 'background.paper',
          border: `1px solid ${theme.palette.divider}`,
        }}
      >
        <Box sx={{ textAlign: 'center', mb: 3 }}>
          <Box
            component="img"
            src="/logo.svg"
            alt="LinkLytics"
            sx={{ width: 44, height: 44, borderRadius: 2, mb: 1.5 }}
          />
          <Typography variant="h5" sx={{ fontWeight: 800 }}>
            Create Your Account
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Get started with free short links &amp; analytics
          </Typography>
        </Box>

        {error && (
          <Alert severity="error" sx={{ mb: 2.5, borderRadius: 2 }}>
            {error}
          </Alert>
        )}

        <form onSubmit={handleSubmit}>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <TextField
              label="Full Name"
              type="text"
              fullWidth
              required
              autoFocus
              value={name}
              onChange={(e) => setName(e.target.value)}
            />

            <TextField
              label="Email Address"
              type="email"
              fullWidth
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />

            <TextField
              label="Password (min 6 characters)"
              type="password"
              fullWidth
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />

            <Button
              type="submit"
              variant="contained"
              color="primary"
              size="large"
              disabled={loading}
              startIcon={<UserPlus size={18} />}
              sx={{ mt: 1, py: 1.25, borderRadius: 2.5 }}
            >
              {loading ? 'Creating Account...' : 'Get Started Free'}
            </Button>
          </Box>
        </form>

        <Box sx={{ textAlign: 'center', mt: 3 }}>
          <Typography variant="body2" color="text.secondary">
            Already have an account?{' '}
            <RouterLink to="/login" style={{ color: '#6366F1', fontWeight: 700, textDecoration: 'none' }}>
              Sign in
            </RouterLink>
          </Typography>
        </Box>
      </Paper>
    </Container>
  );
};
