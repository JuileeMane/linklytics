import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  CardHeader,
  Paper,
  Button,
  IconButton,
  Tooltip,
  CircularProgress,
  Alert,
  Chip,
  useTheme,
} from '@mui/material';
import {
  ArrowLeft,
  Copy,
  Check,
  QrCode,
  ExternalLink,
  Edit2,
  MousePointerClick,
  Users,
  Lock,
  Clock,
  Folder,
  Tag as TagIcon,
} from 'lucide-react';
import { analyticsService } from '../services/analyticsService';
import { linkService } from '../services/linkService';
import { StatCard } from '../components/common/StatCard';
import { ClickTrendsChart } from '../components/analytics/ClickTrendsChart';
import { DeviceBreakdownChart } from '../components/analytics/DeviceBreakdownChart';
import { BrowserBreakdownChart } from '../components/analytics/BrowserBreakdownChart';
import { ReferrerChart } from '../components/analytics/ReferrerChart';
import { RecentClicksTable } from '../components/analytics/RecentClicksTable';
import { QrModal } from '../components/common/QrModal';
import { EditLinkModal } from '../components/common/EditLinkModal';

export const LinkDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const theme = useTheme();

  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);

  const [qrOpen, setQrOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);

  useEffect(() => {
    loadLinkAnalytics();
  }, [id]);

  const loadLinkAnalytics = async () => {
    try {
      setLoading(true);
      setError('');
      const data = await analyticsService.getLinkAnalytics(id);
      setAnalytics(data);
    } catch (err) {
      console.error(err);
      setError('Failed to load analytics for this link.');
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = () => {
    if (analytics?.link) {
      navigator.clipboard.writeText(analytics.link.shortUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', minHeight: '60vh', alignItems: 'center', justifyContent: 'center' }}>
        <CircularProgress color="primary" />
      </Box>
    );
  }

  if (error || !analytics) {
    return (
      <Box sx={{ py: 4 }}>
        <Alert severity="error">{error || 'Link not found'}</Alert>
        <Button startIcon={<ArrowLeft size={16} />} onClick={() => navigate('/links')} sx={{ mt: 2 }}>
          Return to Links
        </Button>
      </Box>
    );
  }

  const { link } = analytics;

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
      {/* Navigation and Title */}
      <Box sx={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: 2 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <IconButton onClick={() => navigate('/links')} size="small">
            <ArrowLeft size={20} />
          </IconButton>
          <Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Typography variant="h4" sx={{ fontWeight: 800 }}>
                {link.title || link.shortCode}
              </Typography>
              {link.favorite && <Chip label="Favorite" size="small" sx={{ bgcolor: 'rgba(245, 158, 11, 0.15)', color: '#F59E0B' }} />}
              {link.passwordProtected && <Chip label="Password" size="small" sx={{ bgcolor: 'rgba(236, 72, 153, 0.15)', color: '#EC4899' }} />}
            </Box>
            <Typography variant="body2" color="text.secondary">
              Created {new Date(link.createdAt).toLocaleString()}
            </Typography>
          </Box>
        </Box>

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
          <Button
            variant="outlined"
            color="inherit"
            startIcon={<QrCode size={16} />}
            onClick={() => setQrOpen(true)}
          >
            QR Code
          </Button>
          <Button
            variant="outlined"
            color="inherit"
            startIcon={<Edit2 size={16} />}
            onClick={() => setEditOpen(true)}
          >
            Edit
          </Button>
          <Button
            variant="contained"
            color={copied ? 'success' : 'primary'}
            startIcon={copied ? <Check size={16} /> : <Copy size={16} />}
            onClick={handleCopy}
          >
            {copied ? 'Copied' : 'Copy Link'}
          </Button>
        </Box>
      </Box>

      {/* URL Meta Banner */}
      <Paper
        elevation={0}
        sx={{
          p: 2.5,
          borderRadius: 3,
          bgcolor: 'background.paper',
          border: `1px solid ${theme.palette.divider}`,
          display: 'flex',
          flexDirection: { xs: 'column', md: 'row' },
          justifyContent: 'space-between',
          alignItems: { xs: 'flex-start', md: 'center' },
          gap: 2,
        }}
      >
        <Box sx={{ minWidth: 0 }}>
          <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 600 }}>
            SHORT URL
          </Typography>
          <Typography variant="h6" className="font-mono" sx={{ fontWeight: 800, color: 'primary.main', my: 0.25 }}>
            {link.shortUrl}
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75 }}>
            <Typography variant="caption" color="text.secondary">
              Dest:
            </Typography>
            <Typography variant="caption" sx={{ fontWeight: 500, wordBreak: 'break-all' }}>
              {link.originalUrl}
            </Typography>
            <IconButton
              component="a"
              href={link.shortUrl}
              target="_blank"
              rel="noreferrer"
              size="small"
              sx={{ p: 0.25, color: 'primary.main' }}
            >
              <ExternalLink size={12} />
            </IconButton>
          </Box>
        </Box>

        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
          {link.folder && (
            <Chip
              icon={<Folder size={12} color={link.folder.color} />}
              label={`Folder: ${link.folder.name}`}
              size="small"
              variant="outlined"
            />
          )}
          {link.campaign && (
            <Chip
              icon={<TagIcon size={12} color="#10B981" />}
              label={`Campaign: ${link.campaign.name}`}
              size="small"
              variant="outlined"
            />
          )}
          {link.tags?.map((t) => (
            <Chip key={t.id} label={`#${t.name}`} size="small" />
          ))}
        </Box>
      </Paper>

      {/* Key Metric Cards */}
      <Grid container spacing={2.5}>
        <Grid item xs={12} sm={6}>
          <StatCard
            title="Total Clicks"
            value={analytics.totalClicks}
            subtitle="Total times this link was accessed"
            icon={MousePointerClick}
            color="#6366F1"
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <StatCard
            title="Estimated Unique Visitors"
            value={analytics.estimatedUniqueVisitors}
            subtitle="Unique visitor clients identified"
            icon={Users}
            color="#38BDF8"
          />
        </Grid>
      </Grid>

      {/* Traffic Trend and Device Charts */}
      <Grid container spacing={3}>
        <Grid item xs={12} lg={8}>
          <Card>
            <CardHeader
              title={<Typography variant="h6" sx={{ fontWeight: 700 }}>Click Trend (30 Days)</Typography>}
              subheader="Daily access events logged in PostgreSQL"
            />
            <CardContent sx={{ pt: 0 }}>
              <ClickTrendsChart data={analytics.clickTrends || []} height={300} />
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} lg={4}>
          <Card>
            <CardHeader
              title={<Typography variant="h6" sx={{ fontWeight: 700 }}>Device Category</Typography>}
              subheader="Hardware breakdown for this link"
            />
            <CardContent sx={{ pt: 0 }}>
              <DeviceBreakdownChart data={analytics.deviceBreakdown || []} height={300} />
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Browser and Referrer Breakdown */}
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Card sx={{ height: '100%' }}>
            <CardHeader
              title={<Typography variant="h6" sx={{ fontWeight: 700 }}>Browser Distribution</Typography>}
              subheader="User agent browser signatures"
            />
            <CardContent sx={{ pt: 0 }}>
              <BrowserBreakdownChart data={analytics.browserBreakdown || []} />
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={6}>
          <Card sx={{ height: '100%' }}>
            <CardHeader
              title={<Typography variant="h6" sx={{ fontWeight: 700 }}>Top Traffic Sources</Typography>}
              subheader="Referral domains and direct traffic"
            />
            <CardContent sx={{ pt: 0 }}>
              <ReferrerChart data={analytics.referrerBreakdown || []} />
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Recent Clicks Log */}
      <Card>
        <CardHeader
          title={<Typography variant="h6" sx={{ fontWeight: 700 }}>Recent Click History</Typography>}
          subheader="Latest visitor click events for this specific link"
        />
        <CardContent sx={{ pt: 0 }}>
          <RecentClicksTable clicks={analytics.recentClicks || []} />
        </CardContent>
      </Card>

      <QrModal open={qrOpen} onClose={() => setQrOpen(false)} link={link} />
      <EditLinkModal open={editOpen} onClose={() => setEditOpen(false)} link={link} onUpdated={loadLinkAnalytics} />
    </Box>
  );
};
