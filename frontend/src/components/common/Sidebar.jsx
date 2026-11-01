import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import {
  Box,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Typography,
  Chip,
  useTheme,
  Divider,
} from '@mui/material';
import {
  LayoutDashboard,
  Link as LinkIcon,
  PlusCircle,
  QrCode,
  FolderKanban,
  Target,
  Crosshair,
  User,
  ShieldAlert,
  Sparkles,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const DRAWER_WIDTH = 250;

export const Sidebar = () => {
  const { isAdmin } = useAuth();
  const location = useLocation();
  const theme = useTheme();

  const navItems = [
    { title: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { title: 'Links Manager', path: '/links', icon: LinkIcon },
    { title: 'Create Link', path: '/create', icon: PlusCircle },
    { title: 'QR Studio', path: '/qr-studio', icon: QrCode },
    { title: 'Folders & Tags', path: '/folders-tags', icon: FolderKanban },
    { title: 'Campaigns', path: '/campaigns', icon: Target },
    { title: 'UTM Builder', path: '/utm-builder', icon: Crosshair },
    { title: 'Profile & Settings', path: '/profile', icon: User },
  ];

  if (isAdmin) {
    navItems.push({
      title: 'Admin Console',
      path: '/admin',
      icon: ShieldAlert,
      badge: 'ADMIN',
    });
  }

  return (
    <Box
      component="nav"
      sx={{
        width: { md: DRAWER_WIDTH },
        flexShrink: { md: 0 },
      }}
    >
      <Box
        sx={{
          width: DRAWER_WIDTH,
          height: 'calc(100vh - 68px)',
          position: 'sticky',
          top: 68,
          borderRight: `1px solid ${theme.palette.divider}`,
          bgcolor: 'background.paper',
          display: { xs: 'none', md: 'flex' },
          flexDirection: 'column',
          justifyContent: 'space-between',
          p: 2,
        }}
      >
        <List disablePadding sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;

            return (
              <ListItem key={item.path} disablePadding>
                <ListItemButton
                  component={NavLink}
                  to={item.path}
                  sx={{
                    borderRadius: 2.5,
                    py: 1.2,
                    px: 1.8,
                    bgcolor: isActive ? 'primary.main' : 'transparent',
                    color: isActive ? '#FFFFFF' : 'text.secondary',
                    '&:hover': {
                      bgcolor: isActive ? 'primary.main' : 'action.hover',
                      color: isActive ? '#FFFFFF' : 'text.primary',
                    },
                    transition: 'all 0.15s ease',
                  }}
                >
                  <ListItemIcon
                    sx={{
                      minWidth: 36,
                      color: isActive ? '#FFFFFF' : 'inherit',
                    }}
                  >
                    <Icon size={18} />
                  </ListItemIcon>
                  <ListItemText
                    primary={item.title}
                    primaryTypographyProps={{
                      fontSize: '0.875rem',
                      fontWeight: isActive ? 700 : 500,
                    }}
                  />
                  {item.badge && (
                    <Chip
                      label={item.badge}
                      size="small"
                      sx={{
                        height: 18,
                        fontSize: '0.625rem',
                        fontWeight: 800,
                        bgcolor: isActive ? 'rgba(255,255,255,0.2)' : 'error.main',
                        color: '#FFFFFF',
                      }}
                    />
                  )}
                </ListItemButton>
              </ListItem>
            );
          })}
        </List>

        {/* Project Credit / Mini card at bottom */}
        <Box
          sx={{
            p: 2,
            borderRadius: 3,
            bgcolor: 'background.subtle',
            border: `1px solid ${theme.palette.divider}`,
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
            <Sparkles size={16} color="#6366F1" />
            <Typography variant="caption" sx={{ fontWeight: 700, color: 'text.primary' }}>
              LinkLytics v1.0
            </Typography>
          </Box>
          <Typography variant="caption" color="text.secondary" sx={{ fontSize: '0.7rem', display: 'block' }}>
            B.Tech Mini-Project • Java 17, Spring Boot &amp; React
          </Typography>
        </Box>
      </Box>
    </Box>
  );
};
