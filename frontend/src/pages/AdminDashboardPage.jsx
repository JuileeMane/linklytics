import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  CardHeader,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  IconButton,
  Switch,
  Chip,
  Alert,
  CircularProgress,
  Divider,
  useTheme,
} from '@mui/material';
import {
  ShieldAlert,
  Users,
  Link as LinkIcon,
  MousePointerClick,
  AlertTriangle,
  Trash2,
  ExternalLink,
  ShieldCheck,
} from 'lucide-react';
import { adminService } from '../services/adminService';
import { StatCard } from '../components/common/StatCard';
import { RecentClicksTable } from '../components/analytics/RecentClicksTable';
import { DeleteConfirmModal } from '../components/common/DeleteConfirmModal';

export const AdminDashboardPage = () => {
  const theme = useTheme();

  const [dashboard, setDashboard] = useState(null);
  const [users, setUsers] = useState([]);
  const [suspiciousLinks, setSuspiciousLinks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Delete modal
  const [deleteLinkId, setDeleteLinkId] = useState(null);

  useEffect(() => {
    loadAdminData();
  }, []);

  const loadAdminData = async () => {
    try {
      setLoading(true);
      setError('');
      const [dData, uData, sData] = await Promise.all([
        adminService.getDashboard(),
        adminService.getUsers(),
        adminService.getSuspiciousLinks(),
      ]);
      setDashboard(dData);
      setUsers(uData || []);
      setSuspiciousLinks(sData || []);
    } catch (err) {
      console.error(err);
      setError('Failed to load administrative console data.');
    } finally {
      setLoading(false);
    }
  };

  const handleToggleUser = async (userId) => {
    try {
      await adminService.toggleUserStatus(userId);
      loadAdminData();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update user status.');
    }
  };

  const confirmDeleteLink = async () => {
    if (!deleteLinkId) return;
    try {
      await adminService.deleteLink(deleteLinkId);
      setDeleteLinkId(null);
      loadAdminData();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to delete link.');
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', minHeight: '60vh', alignItems: 'center', justifyContent: 'center' }}>
        <CircularProgress color="secondary" />
      </Box>
    );
  }

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
      <Box>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
          <ShieldAlert size={28} color="#EC4899" />
          <Typography variant="h4" sx={{ fontWeight: 800 }}>
            Platform Administration Console
          </Typography>
        </Box>
        <Typography variant="body2" color="text.secondary">
          Global metrics, user governance, security monitoring, and abusive link enforcement.
        </Typography>
      </Box>

      {error && <Alert severity="error" onClose={() => setError('')}>{error}</Alert>}

      {/* Global Platform KPIs */}
      <Grid container spacing={2.5}>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Total Platform Users"
            value={dashboard?.totalUsers || 0}
            subtitle={`${dashboard?.activeUsers || 0} active • ${dashboard?.suspendedUsers || 0} suspended`}
            icon={Users}
            color="#EC4899"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Platform Short Links"
            value={dashboard?.totalLinks || 0}
            subtitle={`${dashboard?.activeLinks || 0} active links`}
            icon={LinkIcon}
            color="#6366F1"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Total Clicks Served"
            value={dashboard?.totalClicks || 0}
            subtitle="System-wide redirect volume"
            icon={MousePointerClick}
            color="#38BDF8"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Platform Unique Visitors"
            value={dashboard?.estimatedUniqueVisitors || 0}
            subtitle="Estimated unique clients"
            icon={ShieldCheck}
            color="#10B981"
          />
        </Grid>
      </Grid>

      {/* User Governance Table */}
      <Card>
        <CardHeader
          title={<Typography variant="h6" sx={{ fontWeight: 700 }}>Registered Users</Typography>}
          subheader="Manage user status and view individual link creation volume"
        />
        <Divider />
        <CardContent sx={{ p: 0 }}>
          <TableContainer>
            <Table size="small">
              <TableHead sx={{ bgcolor: theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.02)' : 'rgba(0,0,0,0.02)' }}>
                <TableRow>
                  <TableCell sx={{ fontWeight: 700, py: 1.5 }}>Name &amp; Email</TableCell>
                  <TableCell sx={{ fontWeight: 700 }}>Role</TableCell>
                  <TableCell sx={{ fontWeight: 700 }}>Links Created</TableCell>
                  <TableCell sx={{ fontWeight: 700 }}>Clicks Generated</TableCell>
                  <TableCell sx={{ fontWeight: 700 }}>Status</TableCell>
                  <TableCell sx={{ fontWeight: 700 }} align="right">Account Active</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {users.map((u) => (
                  <TableRow key={u.id} hover>
                    <TableCell>
                      <Typography variant="body2" sx={{ fontWeight: 700 }}>
                        {u.name}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {u.email}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={u.role === 'ROLE_ADMIN' ? 'ADMIN' : 'USER'}
                        size="small"
                        color={u.role === 'ROLE_ADMIN' ? 'secondary' : 'default'}
                        sx={{ fontSize: '0.65rem', fontWeight: 700 }}
                      />
                    </TableCell>
                    <TableCell sx={{ fontWeight: 600 }}>{u.totalLinks}</TableCell>
                    <TableCell sx={{ fontWeight: 600 }}>{u.totalClicks.toLocaleString()}</TableCell>
                    <TableCell>
                      <Chip
                        label={u.active ? 'ACTIVE' : 'SUSPENDED'}
                        size="small"
                        color={u.active ? 'success' : 'error'}
                        sx={{ fontSize: '0.65rem', fontWeight: 700 }}
                      />
                    </TableCell>
                    <TableCell align="right">
                      <Switch
                        checked={u.active}
                        onChange={() => handleToggleUser(u.id)}
                        size="small"
                        color="success"
                      />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </CardContent>
      </Card>

      {/* Flagged / Suspicious Links Monitor */}
      {suspiciousLinks.length > 0 && (
        <Card sx={{ borderColor: 'warning.main' }}>
          <CardHeader
            avatar={<AlertTriangle size={20} color="#F59E0B" />}
            title={<Typography variant="h6" sx={{ fontWeight: 700, color: 'warning.main' }}>Suspicious Link Monitor</Typography>}
            subheader="Links flagged for high velocity clicks (>1000) or unusual TLDs"
          />
          <Divider />
          <CardContent sx={{ p: 2 }}>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
              {suspiciousLinks.map((l) => (
                <Paper
                  key={l.id}
                  elevation={0}
                  sx={{
                    p: 2,
                    borderRadius: 2,
                    bgcolor: 'background.subtle',
                    border: `1px solid ${theme.palette.divider}`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                  }}
                >
                  <Box sx={{ minWidth: 0, flex: 1 }}>
                    <Typography variant="body2" sx={{ fontWeight: 700 }}>
                      {l.title || l.shortCode}
                    </Typography>
                    <Typography variant="caption" className="font-mono" color="primary.main">
                      {l.shortUrl} → {l.originalUrl}
                    </Typography>
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <Typography variant="caption" sx={{ fontWeight: 800 }}>
                      {l.clickCount.toLocaleString()} clicks
                    </Typography>
                    <IconButton size="small" color="error" onClick={() => setDeleteLinkId(l.id)}>
                      <Trash2 size={16} />
                    </IconButton>
                  </Box>
                </Paper>
              ))}
            </Box>
          </CardContent>
        </Card>
      )}

      {/* System-Wide Recent Clicks */}
      <Card>
        <CardHeader
          title={<Typography variant="h6" sx={{ fontWeight: 700 }}>Platform Live Click Stream</Typography>}
          subheader="Latest 20 redirect events processed across the entire LinkLytics application"
        />
        <Divider />
        <CardContent sx={{ pt: 0 }}>
          <RecentClicksTable clicks={dashboard?.recentSystemClicks || []} />
        </CardContent>
      </Card>

      <DeleteConfirmModal
        open={Boolean(deleteLinkId)}
        onClose={() => setDeleteLinkId(null)}
        onConfirm={confirmDeleteLink}
        title="Admin: Remove Link"
        message="As an administrator, permanently remove this link from the platform and terminate all future redirects."
      />
    </Box>
  );
};
