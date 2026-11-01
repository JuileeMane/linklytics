import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Typography,
  Card,
  CardContent,
  CardHeader,
  Grid,
  TextField,
  Button,
  Paper,
  Chip,
  IconButton,
  Tooltip,
  Divider,
  useTheme,
} from '@mui/material';
import {
  Crosshair,
  Copy,
  Check,
  Plus,
  Sparkles,
  ArrowRight,
  ExternalLink,
} from 'lucide-react';

export const UtmBuilderPage = () => {
  const theme = useTheme();
  const navigate = useNavigate();

  const [baseUrl, setBaseUrl] = useState('');
  const [utmSource, setUtmSource] = useState('');
  const [utmMedium, setUtmMedium] = useState('');
  const [utmCampaign, setUtmCampaign] = useState('');
  const [utmTerm, setUtmTerm] = useState('');
  const [utmContent, setUtmContent] = useState('');
  const [copied, setCopied] = useState(false);

  const presets = [
    { label: 'Google Search Ads', source: 'google', medium: 'cpc', campaign: 'brand_search' },
    { label: 'X / Twitter Post', source: 'twitter', medium: 'social', campaign: 'spring_showcase' },
    { label: 'LinkedIn Post', source: 'linkedin', medium: 'social_post', campaign: 'tech_demo' },
    { label: 'Email Newsletter', source: 'newsletter', medium: 'email', campaign: 'weekly_digest' },
    { label: 'GitHub Readme', source: 'github', medium: 'readme', campaign: 'opensource_btech' },
  ];

  const applyPreset = (preset) => {
    setUtmSource(preset.source);
    setUtmMedium(preset.medium);
    setUtmCampaign(preset.campaign);
  };

  const getFullUrl = () => {
    if (!baseUrl.trim()) return '';
    try {
      const url = new URL(baseUrl.startsWith('http') ? baseUrl : `https://${baseUrl}`);
      if (utmSource.trim()) url.searchParams.set('utm_source', utmSource.trim());
      if (utmMedium.trim()) url.searchParams.set('utm_medium', utmMedium.trim());
      if (utmCampaign.trim()) url.searchParams.set('utm_campaign', utmCampaign.trim());
      if (utmTerm.trim()) url.searchParams.set('utm_term', utmTerm.trim());
      if (utmContent.trim()) url.searchParams.set('utm_content', utmContent.trim());
      return url.toString();
    } catch (e) {
      return '';
    }
  };

  const fullUrl = getFullUrl();

  const handleCopy = () => {
    if (fullUrl) {
      navigator.clipboard.writeText(fullUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleShortenNow = () => {
    if (fullUrl) {
      navigate('/create', { state: { url: fullUrl } });
    }
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3, maxWidth: 900, mx: 'auto' }}>
      <Box>
        <Typography variant="h4" sx={{ fontWeight: 800 }}>
          UTM Campaign URL Builder
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Easily append Google Analytics-compliant UTM parameters to target URLs and convert them into short links.
        </Typography>
      </Box>

      {/* Preset Chips */}
      <Paper elevation={0} sx={{ p: 2, borderRadius: 3, bgcolor: 'background.paper', border: `1px solid ${theme.palette.divider}` }}>
        <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 700, display: 'block', mb: 1 }}>
          QUICK CHANNEL PRESETS
        </Typography>
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
          {presets.map((p) => (
            <Chip
              key={p.label}
              label={p.label}
              clickable
              onClick={() => applyPreset(p)}
              sx={{ fontWeight: 600, fontSize: '0.75rem' }}
            />
          ))}
        </Box>
      </Paper>

      {/* Inputs Card */}
      <Card>
        <CardHeader
          title={<Typography variant="h6" sx={{ fontWeight: 700 }}>UTM Parameters</Typography>}
          subheader="Configure standard marketing parameters"
        />
        <Divider />
        <CardContent sx={{ p: 3, display: 'flex', flexDirection: 'column', gap: 2.5 }}>
          <TextField
            label="Website Destination URL *"
            placeholder="https://mywebsite.com/product-launch"
            fullWidth
            required
            value={baseUrl}
            onChange={(e) => setBaseUrl(e.target.value)}
          />

          <Grid container spacing={2}>
            <Grid item xs={12} sm={4}>
              <TextField
                label="Campaign Source (utm_source) *"
                placeholder="e.g. google, newsletter, twitter"
                fullWidth
                size="small"
                value={utmSource}
                onChange={(e) => setUtmSource(e.target.value)}
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField
                label="Campaign Medium (utm_medium) *"
                placeholder="e.g. cpc, banner, email, social"
                fullWidth
                size="small"
                value={utmMedium}
                onChange={(e) => setUtmMedium(e.target.value)}
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField
                label="Campaign Name (utm_campaign) *"
                placeholder="e.g. spring_sale_2026"
                fullWidth
                size="small"
                value={utmCampaign}
                onChange={(e) => setUtmCampaign(e.target.value)}
              />
            </Grid>
          </Grid>

          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Campaign Term (utm_term - optional)"
                placeholder="e.g. running+shoes, java+course"
                fullWidth
                size="small"
                value={utmTerm}
                onChange={(e) => setUtmTerm(e.target.value)}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Campaign Content (utm_content - optional)"
                placeholder="e.g. logolink, textlink, hero_cta"
                fullWidth
                size="small"
                value={utmContent}
                onChange={(e) => setUtmContent(e.target.value)}
              />
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {/* Live Generated URL Output */}
      {fullUrl && (
        <Card sx={{ bgcolor: 'rgba(99, 102, 241, 0.04)', borderColor: 'rgba(99, 102, 241, 0.25)' }}>
          <CardContent sx={{ p: 3 }}>
            <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 1, color: 'primary.main' }}>
              GENERATED UTM DESTINATION URL
            </Typography>
            <Paper
              elevation={0}
              sx={{
                p: 2,
                borderRadius: 2,
                bgcolor: 'background.paper',
                border: `1px solid ${theme.palette.divider}`,
                wordBreak: 'break-all',
                mb: 2,
              }}
            >
              <Typography variant="body2" className="font-mono">
                {fullUrl}
              </Typography>
            </Paper>

            <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
              <Button
                variant="outlined"
                color="inherit"
                startIcon={copied ? <Check size={16} /> : <Copy size={16} />}
                onClick={handleCopy}
              >
                {copied ? 'Copied' : 'Copy Full URL'}
              </Button>
              <Button
                variant="contained"
                color="primary"
                endIcon={<ArrowRight size={16} />}
                onClick={handleShortenNow}
              >
                Shorten with LinkLytics
              </Button>
            </Box>
          </CardContent>
        </Card>
      )}
    </Box>
  );
};
