import React, { useState, useEffect } from 'react';
import { useNavigate, useOutletContext } from 'react-router-dom';
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  CardHeader,
  Paper,
  TextField,
  Button,
  IconButton,
  Tooltip,
  CircularProgress,
  Alert,
  useTheme,
} from '@mui/material';
import {
  Link as LinkIcon,
  MousePointerClick,
  Users,
  CheckCircle,
  TrendingUp,
  RefreshCw,
  Plus,
  ArrowRight,
  ExternalLink,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { analyticsService } from '../services/analyticsService';
import { linkService } from '../services/linkService';
import { StatCard } from '../components/common/StatCard';
import { ClickTrendsChart } from '../components/analytics/ClickTrendsChart';
import { DeviceBreakdownChart } from '../components/analytics/DeviceBreakdownChart';
import { RecentClicksTable } from '../components/analytics/RecentClicksTable';
import { CreateLinkModal } from '../components/links/CreateLinkModal';

export const DashboardPage = () => {
  const { user } = useAuth();
  const theme = useTheme();
  const navigate = useNavigate();
  const outletContext = useOutletContext();

  const [overview, setOverview] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState('');

  // Quick shorten bar
  const [quickUrl, setQuickUrl] = useState('');
  const [quickShortenLoading, setQuickShortenLoading] = useState(false);
  const [quickShortenSuccess, setQuickShortenSuccess] = useState(null);

  // Modal
  const [createModalOpen, setCreateModalOpen] = useState(false);

  useEffect(() => {
    loadOverview();
  }, []);

  const loadOverview = async () => {
    try {
      setLoading(true);
      setError('');
      const data = await analyticsService.getOverview();
      setOverview(data);
    } catch (err) {
      console.error(err);
      setError('Failed to load dashboard metrics. Ensure PostgreSQL is connected.');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const handleRefresh = () => {
    setRefreshing(true);
    loadOverview();
  };

  const handleQuickShorten = async (e) => {
    e.preventDefault();
    if (!quickUrl.trim()) return;

    try {
      setQuickShortenLoading(true);
      const res = await linkService.createLink({ originalUrl: quickUrl.trim() });
      setQuickShortenSuccess(res);
      setQuickUrl('');
      loadOverview();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to shorten URL.');
    } finally {
      setQuickShortenLoading(false);
    }
  };

  if (loading && !overview) {
    return (
      <Box sx={{ display: 'flex', minHeight: '60vh', alignItems: 'center', justifyContent: 'center' }}>
        <CircularProgress color="primary" />
      </Box>
    );
  }

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
      {/* Header Bar */}
      <Box sx={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: 2 }}>
        <Box>
          <Typography variant="h4" sx={{ fontWeight: 800 }}>
            Welcome back, {user?.name?.split(' ')[0] || 'User'}!
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Here is your live link traffic and real-time visitor performance overview.
          </Typography>
        </Box>

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
          <Tooltip title="Refresh metrics from PostgreSQL">
            <IconButton onClick={handleRefresh} disabled={refreshing} size="small" sx={{ p: 1, borderRadius: 2 }}>
              <RefreshCw size={18} className={refreshing ? 'spin' : ''} />
            </IconButton>
          </Tooltip>

          <Button
            variant="contained"
            color="primary"
            startIcon={<Plus size={16} />}
            onClick={() => setCreateModalOpen(true)}
          >
            Create Short Link
          </Button>
        </Box>
      </Box>

      {error && <Alert severity="error">{error}</Alert>}

      {/* Quick Shortener Hero Bar */}
      <Paper
        elevation={0}
        component="form"
        onSubmit={handleQuickShorten}
        sx={{
          p: 1.5,
          borderRadius: 3,
          bgcolor: 'background.paper',
          border: `1px solid ${theme.palette.divider}`,
          display: 'flex',
          flexDirection: { xs: 'column', sm: 'row' },
          gap: 1.5,
          alignItems: 'center',
        }}
      >
        <TextField
          placeholder="Paste long destination URL to shorten instantly..."
          fullWidth
          size="small"
          value={quickUrl}
          onChange={(e) => setQuickUrl(e.target.value)}
          sx={{ '& fieldset': { border: 'none' } }}
        />
        <Button
          type="submit"
          variant="contained"
          color="primary"
          disabled={quickShortenLoading || !quickUrl.trim()}
          sx={{ px: 3, py: 1, whiteSpace: 'nowrap', width: { xs: '100%', sm: 'auto' } }}
        >
          {quickShortenLoading ? 'Shortening...' : 'Quick Shorten'}
        </Button>
      </Paper>

      {quickShortenSuccess && (
        <Alert
          severity="success"
          onClose={() => setQuickShortenSuccess(null)}
          sx={{ borderRadius: 2 }}
        >
          Short link generated:{' '}
          <strong className="font-mono">{quickShortenSuccess.shortUrl}</strong>{' '}
          (redirects to {quickShortenSuccess.originalUrl})
        </Alert>
      )}

      {/* Key Metric Stat Cards */}
      <Grid container spacing={2.5}>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Total Links"
            value={overview?.totalLinks || 0}
            subtitle={`${overview?.activeLinks || 0} active links`}
            icon={LinkIcon}
            color="#6366F1"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Total Clicks"
            value={overview?.totalClicks || 0}
            subtitle="Recorded across all links"
            icon={MousePointerClick}
            trend="+12% this week"
            color="#38BDF8"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Unique Visitors"
            value={overview?.estimatedUniqueVisitors || 0}
            subtitle="Estimated unique clients"
            icon={Users}
            color="#10B981"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Active Links"
            value={overview?.activeLinks || 0}
            subtitle={`${overview?.archivedLinks || 0} archived`}
            icon={CheckCircle}
            color="#F59E0B"
          />
        </Grid>
      </Grid>

      {/* Analytics Charts Section */}
      <Grid container spacing={3}>
        {/* 30-Day Click Trends AreaChart */}
        <Grid item xs={12} lg={8}>
          <Card sx={{ height: '100%' }}>
            <CardHeader
              title={
                <Typography variant="h6" sx={{ fontWeight: 700 }}>
                  Click Activity &amp; Traffic Trends (30 Days)
                </Typography>
              }
              subheader="Daily click volume and estimated unique visitors from PostgreSQL"
            />
            <CardContent sx={{ pt: 0 }}>
              <ClickTrendsChart data={overview?.clickTrends || []} height={320} />
            </CardContent>
          </Card>
        </Grid>

        {/* Device Distribution Donut Chart */}
        <Grid item xs={12} lg={4}>
          <Card sx={{ height: '100%' }}>
            <CardHeader
              title={
                <Typography variant="h6" sx={{ fontWeight: 700 }}>
                  Device Distribution
                </Typography>
              }
              subheader="Visitors categorized by hardware type"
            />
            <CardContent sx={{ pt: 0 }}>
              <DeviceBreakdownChart data={overview?.deviceBreakdown || []} height={320} />
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Top Links & Recent Clicks Stream */}
      <Grid container spacing={3}>
        {/* Top Performing Links Table */}
        <Grid item xs={12} lg={6}>
          <Card sx={{ height: '100%' }}>
            <CardHeader
              title={
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <Typography variant="h6" sx={{ fontWeight: 700 }}>
                    Top Performing Links
                  </Typography>
                  <Button
                    size="small"
                    endIcon={<ArrowRight size={14} />}
                    onClick={() => navigate('/links')}
                  >
                    View All
                  </Button>
                </Box>
              }
              subheader="Your highest-traffic shortened destinations"
            />
            <CardContent sx={{ pt: 0 }}>
              {overview?.topLinks && overview.topLinks.length > 0 ? (
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
                  {overview.topLinks.map((link) => (
                    <Paper
                      key={link.id}
                      elevation={0}
                      sx={{
                        p: 1.75,
                        borderRadius: 2,
                        bgcolor: 'background.subtle',
                        border: `1px solid ${theme.palette.divider}`,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        gap: 2,
                      }}
                    >
                      <Box sx={{ minWidth: 0, flex: 1 }}>
                        <Typography variant="subtitle2" noWrap sx={{ fontWeight: 700 }}>
                          {link.title || link.shortCode}
                        </Typography>
                        <Typography variant="caption" className="font-mono" color="primary.main" noWrap>
                          {link.shortUrl}
                        </Typography>
                      </Box>
                      <Box sx={{ textAlign: 'right', whiteSpace: 'nowrap' }}>
                        <Typography variant="subtitle2" sx={{ fontWeight: 800 }}>
                          {link.clickCount.toLocaleString()}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          clicks
                        </Typography>
                      </Box>
                    </Paper>
                  ))}
                </Box>
              ) : (
                <Box sx={{ p: 4, textAlign: 'center' }}>
                  <Typography variant="body2" color="text.secondary">
                    No links created yet. Click "Create Short Link" above to get started!
                  </Typography>
                </Box>
              )}
            </CardContent>
          </Card>
        </Grid>

        {/* Live Visitor Click Stream */}
        <Grid item xs={12} lg={6}>
          <Card sx={{ height: '100%' }}>
            <CardHeader
              title={
                <Typography variant="h6" sx={{ fontWeight: 700 }}>
                  Recent Click Stream
                </Typography>
              }
              subheader="Latest incoming visits with browser and device details"
            />
            <CardContent sx={{ pt: 0 }}>
              <RecentClicksTable clicks={overview?.recentClicks || []} />
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <CreateLinkModal
        open={createModalOpen}
        onClose={() => setCreateModalOpen(false)}
        onCreated={() => loadOverview()}
      />
    </Box>
  );
};
