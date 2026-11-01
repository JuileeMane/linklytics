import React, { useState } from 'react';
import { Link as RouterLink, useNavigate, useLocation } from 'react-router-dom';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  IconButton,
  Box,
  Container,
  Menu,
  MenuItem,
  Avatar,
  Divider,
  ListItemIcon,
  Tooltip,
  useTheme,
} from '@mui/material';
import {
  Sun,
  Moon,
  Plus,
  LogOut,
  User as UserIcon,
  ShieldAlert,
  BarChart2,
  ExternalLink,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useThemeMode } from '../../context/ThemeContext';

export const Navbar = ({ onOpenCreateModal }) => {
  const { user, isAuthenticated, logout, isAdmin } = useAuth();
  const { mode, toggleTheme } = useThemeMode();
  const navigate = useNavigate();
  const location = useLocation();
  const theme = useTheme();

  const [anchorEl, setAnchorEl] = useState(null);

  const handleOpenMenu = (event) => setAnchorEl(event.currentTarget);
  const handleCloseMenu = () => setAnchorEl(null);

  const handleLogout = async () => {
    handleCloseMenu();
    await logout();
    navigate('/');
  };

  const isPublicPage = ['/', '/login', '/register'].includes(location.pathname);

  return (
    <AppBar
      position="sticky"
      elevation={0}
      sx={{
        backgroundColor: mode === 'dark' ? 'rgba(10, 14, 23, 0.85)' : 'rgba(255, 255, 255, 0.85)',
        backdropFilter: 'blur(12px)',
        borderBottom: `1px solid ${theme.palette.divider}`,
        color: 'text.primary',
        zIndex: (theme) => theme.zIndex.drawer + 1,
      }}
    >
      <Container maxWidth="xl">
        <Toolbar disableGutters sx={{ minHeight: 68, justifyContent: 'space-between' }}>
          {/* Brand Logo & Title */}
          <Box
            component={RouterLink}
            to={isAuthenticated ? '/dashboard' : '/'}
            sx={{
              display: 'flex',
              alignItems: 'center',
              textDecoration: 'none',
              color: 'inherit',
              gap: 1.5,
            }}
          >
            <Box
              component="img"
              src="/logo.svg"
              alt="LinkLytics"
              sx={{ width: 34, height: 34, borderRadius: 1.5 }}
            />
            <Typography
              variant="h6"
              sx={{
                fontWeight: 800,
                letterSpacing: '-0.02em',
                background: mode === 'dark'
                  ? 'linear-gradient(135deg, #FFFFFF 0%, #CBD5E1 100%)'
                  : 'linear-gradient(135deg, #0F172A 0%, #334155 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}
            >
              Link<span style={{ color: '#6366F1', WebkitTextFillColor: '#6366F1' }}>Lytics</span>
            </Typography>
          </Box>

          {/* Action Bar */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
            {/* Theme Toggle Button */}
            <Tooltip title={`Switch to ${mode === 'dark' ? 'Light' : 'Dark'} mode`}>
              <IconButton onClick={toggleTheme} color="inherit" size="small" sx={{ p: 1, borderRadius: 2 }}>
                {mode === 'dark' ? <Sun size={18} color="#FBBF24" /> : <Moon size={18} color="#6366F1" />}
              </IconButton>
            </Tooltip>

            {isAuthenticated ? (
              <>
                {/* Create Link Quick Action */}
                <Button
                  variant="contained"
                  color="primary"
                  size="small"
                  startIcon={<Plus size={16} />}
                  onClick={onOpenCreateModal || (() => navigate('/create'))}
                  sx={{ display: { xs: 'none', sm: 'inline-flex' } }}
                >
                  Create Link
                </Button>

                {/* User Menu Trigger */}
                <IconButton onClick={handleOpenMenu} sx={{ p: 0.5, ml: 0.5 }}>
                  <Avatar
                    sx={{
                      width: 36,
                      height: 36,
                      bgcolor: '#6366F1',
                      fontSize: '0.9rem',
                      fontWeight: 700,
                    }}
                  >
                    {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
                  </Avatar>
                </IconButton>

                {/* Dropdown Menu */}
                <Menu
                  anchorEl={anchorEl}
                  open={Boolean(anchorEl)}
                  onClose={handleCloseMenu}
                  onClick={handleCloseMenu}
                  transformOrigin={{ horizontal: 'right', vertical: 'top' }}
                  anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
                  PaperProps={{
                    sx: {
                      mt: 1.5,
                      minWidth: 220,
                      borderRadius: 3,
                      p: 1,
                      border: `1px solid ${theme.palette.divider}`,
                      boxShadow: '0 10px 30px rgba(0,0,0,0.2)',
                    },
                  }}
                >
                  <Box sx={{ px: 2, py: 1 }}>
                    <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>
                      {user?.name}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {user?.email}
                    </Typography>
                  </Box>
                  <Divider sx={{ my: 1 }} />

                  <MenuItem onClick={() => navigate('/dashboard')}>
                    <ListItemIcon>
                      <BarChart2 size={16} />
                    </ListItemIcon>
                    Dashboard
                  </MenuItem>

                  <MenuItem onClick={() => navigate('/profile')}>
                    <ListItemIcon>
                      <UserIcon size={16} />
                    </ListItemIcon>
                    Profile &amp; Settings
                  </MenuItem>

                  {isAdmin && (
                    <MenuItem onClick={() => navigate('/admin')}>
                      <ListItemIcon>
                        <ShieldAlert size={16} color="#EC4899" />
                      </ListItemIcon>
                      Admin Console
                    </MenuItem>
                  )}

                  <Divider sx={{ my: 1 }} />

                  <MenuItem onClick={handleLogout} sx={{ color: 'error.main' }}>
                    <ListItemIcon>
                      <LogOut size={16} color={theme.palette.error.main} />
                    </ListItemIcon>
                    Log Out
                  </MenuItem>
                </Menu>
              </>
            ) : (
              // Guest view (Landing page)
              <>
                <Button
                  component={RouterLink}
                  to="/login"
                  color="inherit"
                  sx={{ fontWeight: 600 }}
                >
                  Log In
                </Button>
                <Button
                  component={RouterLink}
                  to="/register"
                  variant="contained"
                  color="primary"
                >
                  Get Started Free
                </Button>
              </>
            )}
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
};
