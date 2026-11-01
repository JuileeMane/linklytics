import React, { useState } from 'react';
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  CardHeader,
  TextField,
  Button,
  Avatar,
  Divider,
  Alert,
  Chip,
  useTheme,
} from '@mui/material';
import {
  User,
  Shield,
  Key,
  CheckCircle,
  MousePointerClick,
  Link as LinkIcon,
  Calendar,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { authService } from '../services/authService';

export const ProfilePage = () => {
  const { user, refreshUser } = useAuth();
  const theme = useTheme();

  // Name update
  const [name, setName] = useState(user?.name || '');
  const [nameLoading, setNameLoading] = useState(false);
  const [nameSuccess, setNameSuccess] = useState('');
  const [nameError, setNameError] = useState('');

  // Password change
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [pwLoading, setPwLoading] = useState(false);
  const [pwSuccess, setPwSuccess] = useState('');
  const [pwError, setPwError] = useState('');

  const handleUpdateName = async (e) => {
    e.preventDefault();
    try {
      setNameLoading(true);
      setNameError('');
      setNameSuccess('');
      await authService.updateProfile({ name });
      setNameSuccess('Profile name updated successfully.');
      refreshUser();
    } catch (err) {
      setNameError(err.response?.data?.message || 'Failed to update profile.');
    } finally {
      setNameLoading(false);
    }
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    if (newPassword.length < 6) {
      setPwError('New password must be at least 6 characters long.');
      return;
    }
    try {
      setPwLoading(true);
      setPwError('');
      setPwSuccess('');
      await authService.changePassword({ currentPassword, newPassword });
      setPwSuccess('Password changed successfully.');
      setCurrentPassword('');
      setNewPassword('');
    } catch (err) {
      setPwError(err.response?.data?.message || 'Failed to change password.');
    } finally {
      setPwLoading(false);
    }
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3, maxWidth: 840, mx: 'auto' }}>
      <Box>
        <Typography variant="h4" sx={{ fontWeight: 800 }}>
          User Profile &amp; Settings
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Manage your account credentials, security preferences, and view platform metrics.
        </Typography>
      </Box>

      {/* Profile Overview Card */}
      <Card>
        <CardContent sx={{ p: 4, display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 3 }}>
          <Avatar
            sx={{
              width: 80,
              height: 80,
              bgcolor: 'primary.main',
              fontSize: '2rem',
              fontWeight: 800,
            }}
          >
            {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
          </Avatar>
          <Box sx={{ flex: 1, minWidth: 200 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Typography variant="h5" sx={{ fontWeight: 800 }}>
                {user?.name}
              </Typography>
              <Chip
                label={user?.role === 'ROLE_ADMIN' ? 'ADMINISTRATOR' : 'USER'}
                size="small"
                color={user?.role === 'ROLE_ADMIN' ? 'secondary' : 'primary'}
                sx={{ fontSize: '0.65rem', fontWeight: 700 }}
              />
            </Box>
            <Typography variant="body2" color="text.secondary" sx={{ mt: 0.25 }}>
              {user?.email}
            </Typography>
            <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
              Account Active • Member since {user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : '2026'}
            </Typography>
          </Box>

          <Box sx={{ display: 'flex', gap: 3 }}>
            <Box sx={{ textAlign: 'center' }}>
              <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 600 }}>
                LINKS
              </Typography>
              <Typography variant="h5" sx={{ fontWeight: 800, color: 'primary.main' }}>
                {user?.totalLinks || 0}
              </Typography>
            </Box>
            <Box sx={{ textAlign: 'center' }}>
              <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 600 }}>
                CLICKS
              </Typography>
              <Typography variant="h5" sx={{ fontWeight: 800, color: '#10B981' }}>
                {(user?.totalClicks || 0).toLocaleString()}
              </Typography>
            </Box>
          </Box>
        </CardContent>
      </Card>

      <Grid container spacing={3}>
        {/* Update Profile Name */}
        <Grid item xs={12} md={6}>
          <Card sx={{ height: '100%' }}>
            <CardHeader
              title={<Typography variant="h6" sx={{ fontWeight: 700 }}>Personal Info</Typography>}
              subheader="Update your display name"
            />
            <Divider />
            <CardContent sx={{ p: 3 }}>
              {nameSuccess && <Alert severity="success" sx={{ mb: 2 }}>{nameSuccess}</Alert>}
              {nameError && <Alert severity="error" sx={{ mb: 2 }}>{nameError}</Alert>}

              <form onSubmit={handleUpdateName}>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                  <TextField
                    label="Full Name"
                    fullWidth
                    size="small"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                  <TextField
                    label="Email Address"
                    fullWidth
                    size="small"
                    disabled
                    value={user?.email || ''}
                    helperText="Email cannot be changed"
                  />
                  <Button
                    type="submit"
                    variant="contained"
                    color="primary"
                    disabled={nameLoading || name === user?.name}
                    sx={{ alignSelf: 'flex-start', mt: 1 }}
                  >
                    {nameLoading ? 'Saving...' : 'Update Name'}
                  </Button>
                </Box>
              </form>
            </CardContent>
          </Card>
        </Grid>

        {/* Change Password */}
        <Grid item xs={12} md={6}>
          <Card sx={{ height: '100%' }}>
            <CardHeader
              title={<Typography variant="h6" sx={{ fontWeight: 700 }}>Security</Typography>}
              subheader="Change your account password"
            />
            <Divider />
            <CardContent sx={{ p: 3 }}>
              {pwSuccess && <Alert severity="success" sx={{ mb: 2 }}>{pwSuccess}</Alert>}
              {pwError && <Alert severity="error" sx={{ mb: 2 }}>{pwError}</Alert>}

              <form onSubmit={handleChangePassword}>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                  <TextField
                    label="Current Password"
                    type="password"
                    fullWidth
                    size="small"
                    required
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                  />
                  <TextField
                    label="New Password"
                    type="password"
                    fullWidth
                    size="small"
                    required
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    helperText="Minimum 6 characters"
                  />
                  <Button
                    type="submit"
                    variant="contained"
                    color="primary"
                    disabled={pwLoading || !currentPassword || !newPassword}
                    sx={{ alignSelf: 'flex-start', mt: 1 }}
                  >
                    {pwLoading ? 'Changing...' : 'Change Password'}
                  </Button>
                </Box>
              </form>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};
