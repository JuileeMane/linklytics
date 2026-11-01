import React, { useState } from 'react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import {
  Box,
  Container,
  Typography,
  Button,
  Grid,
  Card,
  CardContent,
  Paper,
  TextField,
  InputAdornment,
  Chip,
  useTheme,
} from '@mui/material';
import {
  Link as LinkIcon,
  BarChart3,
  QrCode,
  ShieldCheck,
  Zap,
  Layers,
  ArrowRight,
  CheckCircle2,
  Lock,
  Globe2,
  Sparkles,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export const LandingPage = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const [quickUrl, setQuickUrl] = useState('');

  const handleQuickShorten = (e) => {
    e.preventDefault();
    if (isAuthenticated) {
      navigate('/create', { state: { url: quickUrl } });
    } else {
      navigate('/register', { state: { url: quickUrl } });
    }
  };

  const features = [
    {
      icon: Zap,
      title: 'Ultra-Fast Base62 Shortening',
      description: 'Generate collision-resistant 7-character short codes powered by Java 17 and high-performance PostgreSQL indexing.',
      color: '#6366F1',
    },
    {
      icon: BarChart3,
      title: 'Deep Click Analytics',
      description: 'Track clicks, estimated unique visitors, device categories, operating systems, browsers, and traffic referrers in real time.',
      color: '#38BDF8',
    },
    {
      icon: QrCode,
      title: 'Built-in Local QR Studio',
      description: 'Instant QR code generation using local ZXing engine with no external third-party API dependencies or fees.',
      color: '#F59E0B',
    },
    {
      icon: Lock,
      title: 'Password & Expiry Protection',
      description: 'Secure sensitive short links with BCrypt hashed passwords and configurable expiration timestamps.',
      color: '#EC4899',
    },
    {
      icon: Layers,
      title: 'Folders, Tags & Campaigns',
      description: 'Organize high-volume links into color-coded folders, custom tags, and trackable marketing campaigns.',
      color: '#10B981',
    },
    {
      icon: ShieldCheck,
      title: 'Enterprise Spring Security',
      description: 'Robust JWT token authentication, role-based access control (User/Admin), and complete user link isolation.',
      color: '#8B5CF6',
    },
  ];

  const steps = [
    {
      step: '01',
      title: 'Paste Destination URL',
      description: 'Enter any lengthy destination web address with optional custom alias and UTM tracking tags.',
    },
    {
      step: '02',
      title: 'Generate Short Link & QR',
      description: 'Get an instant branded short link and high-resolution downloadable QR code.',
    },
    {
      step: '03',
      title: 'Measure Real-Time Engagement',
      description: 'Watch visitor clicks, devices, platforms, and traffic channels update live on your dashboard.',
    },
  ];

  return (
    <Box sx={{ overflowX: 'hidden' }}>
      {/* Hero Section */}
      <Box
        sx={{
          pt: { xs: 8, md: 14 },
          pb: { xs: 8, md: 12 },
          position: 'relative',
          background: theme.palette.mode === 'dark'
            ? 'radial-gradient(ellipse 80% 50% at 50% -20%, rgba(99, 102, 241, 0.25), transparent)'
            : 'radial-gradient(ellipse 80% 50% at 50% -20%, rgba(99, 102, 241, 0.12), transparent)',
        }}
      >
        <Container maxWidth="lg">
          <Box sx={{ textAlign: 'center', maxWidth: 840, mx: 'auto', mb: 6 }}>
            <Chip
              icon={<Sparkles size={14} color="#6366F1" />}
              label="Java Full-Stack Academic Mini-Project 2026"
              sx={{
                mb: 3,
                px: 1.5,
                py: 0.5,
                bgcolor: 'rgba(99, 102, 241, 0.1)',
                color: 'primary.main',
                fontWeight: 700,
                fontSize: '0.8rem',
                border: '1px solid rgba(99, 102, 241, 0.25)',
              }}
            />

            <Typography
              variant="h1"
              sx={{
                fontSize: { xs: '2.5rem', sm: '3.5rem', md: '4.25rem' },
                lineHeight: 1.15,
                mb: 3,
              }}
            >
              Shorten Links. <br />
              <span className="gradient-text">Deliver Deep Insights.</span>
            </Typography>

            <Typography
              variant="h6"
              color="text.secondary"
              sx={{
                fontWeight: 400,
                fontSize: { xs: '1rem', sm: '1.2rem' },
                lineHeight: 1.6,
                mb: 4,
                px: { xs: 1, sm: 4 },
              }}
            >
              LinkLytics is a production-ready URL shortener and click analytics platform engineered with 
              <strong> Spring Boot 3</strong>, <strong>PostgreSQL</strong>, and <strong>React</strong>. 
              Track visitors, generate QR codes, build UTM links, and visualize trends.
            </Typography>

            {/* Quick Shortener Hero Input */}
            <Paper
              component="form"
              onSubmit={handleQuickShorten}
              elevation={4}
              sx={{
                p: { xs: 1, sm: 1.25 },
                display: 'flex',
                flexDirection: { xs: 'column', sm: 'row' },
                alignItems: 'center',
                gap: 1.5,
                borderRadius: 3.5,
                maxWidth: 620,
                mx: 'auto',
                bgcolor: 'background.paper',
                border: `1px solid ${theme.palette.divider}`,
              }}
            >
              <TextField
                placeholder="Paste your long destination URL..."
                variant="standard"
                fullWidth
                value={quickUrl}
                onChange={(e) => setQuickUrl(e.target.value)}
                InputProps={{
                  disableUnderline: true,
                  startAdornment: (
                    <InputAdornment position="start" sx={{ pl: 1.5, pr: 0.5 }}>
                      <LinkIcon size={18} color="#6366F1" />
                    </InputAdornment>
                  ),
                  sx: { fontSize: '0.95rem', py: 0.5 },
                }}
              />
              <Button
                type="submit"
                variant="contained"
                color="primary"
                size="large"
                endIcon={<ArrowRight size={16} />}
                sx={{
                  width: { xs: '100%', sm: 'auto' },
                  px: 3.5,
                  py: 1.25,
                  whiteSpace: 'nowrap',
                  borderRadius: 2.5,
                }}
              >
                Shorten Free
              </Button>
            </Paper>

            <Box sx={{ display: 'flex', justifyContent: 'center', gap: 3, mt: 3, color: 'text.secondary', fontSize: '0.8rem' }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75 }}>
                <CheckCircle2 size={15} color="#10B981" /> Free &amp; Open Source
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75 }}>
                <CheckCircle2 size={15} color="#10B981" /> No Paid API Keys
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75 }}>
                <CheckCircle2 size={15} color="#10B981" /> PostgreSQL Native
              </Box>
            </Box>
          </Box>
        </Container>
      </Box>

      {/* Feature Highlights Grid */}
      <Container maxWidth="lg" sx={{ py: { xs: 8, md: 10 } }}>
        <Box sx={{ textAlign: 'center', mb: 8 }}>
          <Typography variant="overline" sx={{ color: 'primary.main', fontWeight: 800, letterSpacing: '0.1em' }}>
            ENGINEERED FOR PERFORMANCE
          </Typography>
          <Typography variant="h2" sx={{ mt: 1, fontSize: { xs: '2rem', md: '2.5rem' } }}>
            Everything You Need for Link Management
          </Typography>
        </Box>

        <Grid container spacing={3}>
          {features.map((f, idx) => {
            const Icon = f.icon;
            return (
              <Grid item xs={12} sm={6} md={4} key={idx}>
                <Card
                  sx={{
                    height: '100%',
                    transition: 'all 0.25s ease',
                    '&:hover': {
                      transform: 'translateY(-4px)',
                      borderColor: f.color,
                    },
                  }}
                >
                  <CardContent sx={{ p: 3.5 }}>
                    <Box
                      sx={{
                        width: 48,
                        height: 48,
                        borderRadius: 2.5,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        bgcolor: `${f.color}15`,
                        color: f.color,
                        mb: 2.5,
                      }}
                    >
                      <Icon size={24} />
                    </Box>
                    <Typography variant="h6" sx={{ fontWeight: 700, mb: 1 }}>
                      {f.title}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.6 }}>
                      {f.description}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            );
          })}
        </Grid>
      </Container>

      {/* How it Works Section */}
      <Box sx={{ bgcolor: 'background.subtle', py: { xs: 8, md: 10 } }}>
        <Container maxWidth="lg">
          <Box sx={{ textAlign: 'center', mb: 8 }}>
            <Typography variant="overline" sx={{ color: 'primary.main', fontWeight: 800, letterSpacing: '0.1em' }}>
              HOW LINKLYTICS WORKS
            </Typography>
            <Typography variant="h2" sx={{ mt: 1, fontSize: { xs: '2rem', md: '2.5rem' } }}>
              From Long URL to Live Analytics in 3 Steps
            </Typography>
          </Box>

          <Grid container spacing={4}>
            {steps.map((s, idx) => (
              <Grid item xs={12} md={4} key={idx}>
                <Paper
                  elevation={0}
                  sx={{
                    p: 4,
                    height: '100%',
                    borderRadius: 3.5,
                    bgcolor: 'background.paper',
                    border: `1px solid ${theme.palette.divider}`,
                  }}
                >
                  <Typography
                    variant="h3"
                    className="font-mono"
                    sx={{ color: 'primary.main', fontWeight: 800, mb: 2, opacity: 0.8 }}
                  >
                    {s.step}
                  </Typography>
                  <Typography variant="h6" sx={{ fontWeight: 700, mb: 1.5 }}>
                    {s.title}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.6 }}>
                    {s.description}
                  </Typography>
                </Paper>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* Call to Action Banner */}
      <Container maxWidth="md" sx={{ py: { xs: 8, md: 12 } }}>
        <Paper
          elevation={4}
          sx={{
            p: { xs: 4, md: 6 },
            borderRadius: 4,
            textAlign: 'center',
            background: 'linear-gradient(135deg, #4F46E5 0%, #7C3AED 100%)',
            color: '#FFFFFF',
          }}
        >
          <Typography variant="h3" sx={{ fontWeight: 800, mb: 2, fontSize: { xs: '1.8rem', md: '2.5rem' } }}>
            Ready to Supercharge Your Links?
          </Typography>
          <Typography variant="body1" sx={{ maxWidth: 540, mx: 'auto', mb: 4, opacity: 0.9 }}>
            Join LinkLytics today. Free demo credentials included for instant teacher evaluation.
          </Typography>
          <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2, flexWrap: 'wrap' }}>
            <Button
              component={RouterLink}
              to="/register"
              variant="contained"
              size="large"
              sx={{
                bgcolor: '#FFFFFF',
                color: '#4F46E5',
                fontWeight: 700,
                px: 4,
                '&:hover': { bgcolor: '#F8FAFC' },
              }}
            >
              Create Free Account
            </Button>
            <Button
              component={RouterLink}
              to="/login"
              variant="outlined"
              size="large"
              sx={{
                borderColor: 'rgba(255,255,255,0.4)',
                color: '#FFFFFF',
                fontWeight: 600,
                px: 3.5,
                '&:hover': { borderColor: '#FFFFFF', bgcolor: 'rgba(255,255,255,0.08)' },
              }}
            >
              Sign In Demo
            </Button>
          </Box>
        </Paper>
      </Container>
    </Box>
  );
};
