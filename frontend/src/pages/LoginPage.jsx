import React, { useState } from 'react';
import { Link as RouterLink, useNavigate, useLocation } from 'react-router-dom';
import {
  Box,
  Container,
  Paper,
  Typography,
  TextField,
  Button,
  Alert,
  Divider,
  Chip,
  useTheme,
} from '@mui/material';
import { LogIn, Key, Sparkles, ShieldAlert } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export const LoginPage = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const from = location.state?.from?.pathname || '/dashboard';

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      setError('');
      await login(email, password);
      navigate(from, { replace: true });
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Invalid email or password. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const fillCredentials = (demoEmail, demoPassword) => {
    setEmail(demoEmail);
    setPassword(demoPassword);
    setError('');
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
            Welcome Back
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Sign in to manage your short links and analytics
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
              label="Email Address"
              type="email"
              fullWidth
              required
              autoFocus
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />

            <TextField
              label="Password"
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
              startIcon={<LogIn size={18} />}
              sx={{ mt: 1, py: 1.25, borderRadius: 2.5 }}
            >
              {loading ? 'Authenticating...' : 'Sign In'}
            </Button>
          </Box>
        </form>

        <Divider sx={{ my: 3 }}>
          <Chip label="DEMO QUICK-FILL" size="small" sx={{ fontSize: '0.65rem', fontWeight: 700 }} />
        </Divider>

        {/* Teacher Demonstration Quick Fill Buttons */}
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
          <Button
            variant="outlined"
            size="small"
            color="primary"
            startIcon={<Sparkles size={14} />}
            onClick={() => fillCredentials('demo@linklytics.com', 'Demo@123')}
            sx={{ justifyContent: 'flex-start', py: 0.75 }}
          >
            Fill Demo User (demo@linklytics.com)
          </Button>

          <Button
            variant="outlined"
            size="small"
            color="secondary"
            startIcon={<ShieldAlert size={14} />}
            onClick={() => fillCredentials('admin@linklytics.com', 'Admin@123')}
            sx={{ justifyContent: 'flex-start', py: 0.75 }}
          >
            Fill Admin User (admin@linklytics.com)
          </Button>
        </Box>

        <Box sx={{ textAlign: 'center', mt: 3 }}>
          <Typography variant="body2" color="text.secondary">
            Don't have an account?{' '}
            <RouterLink to="/register" style={{ color: '#6366F1', fontWeight: 700, textDecoration: 'none' }}>
              Register free
            </RouterLink>
          </Typography>
        </Box>
      </Paper>
    </Container>
  );
};
