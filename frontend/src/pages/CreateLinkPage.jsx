import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  Box,
  Typography,
  Card,
  CardContent,
  CardHeader,
  TextField,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  InputAdornment,
  Grid,
  Alert,
  Paper,
  Divider,
  useTheme,
} from '@mui/material';
import {
  Plus,
  Sparkles,
  Lock,
  Calendar,
  Folder,
  Target,
  ArrowLeft,
  Link as LinkIcon,
  Crosshair,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { linkService } from '../services/linkService';
import { folderService } from '../services/folderTagService';
import { campaignService } from '../services/campaignService';

export const CreateLinkPage = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const location = useLocation();

  const [originalUrl, setOriginalUrl] = useState(location.state?.url || '');
  const [title, setTitle] = useState('');
  const [customAlias, setCustomAlias] = useState('');
  const [folderId, setFolderId] = useState('');
  const [campaignId, setCampaignId] = useState('');
  const [tagInput, setTagInput] = useState('');
  const [expirationDate, setExpirationDate] = useState('');
  const [password, setPassword] = useState('');

  // UTM Parameters
  const [utmSource, setUtmSource] = useState('');
  const [utmMedium, setUtmMedium] = useState('');
  const [utmCampaign, setUtmCampaign] = useState('');

  const [folders, setFolders] = useState([]);
  const [campaigns, setCampaigns] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    loadOptions();
  }, []);

  const loadOptions = async () => {
    try {
      const [fData, cData] = await Promise.all([
        folderService.getFolders(),
        campaignService.getCampaigns(),
      ]);
      setFolders(fData || []);
      setCampaigns(cData || []);
    } catch (e) {
      console.error(e);
    }
  };

  const getComputedDestinationUrl = () => {
    let url = originalUrl.trim();
    if (!url) return '';

    try {
      const hasUtm = utmSource || utmMedium || utmCampaign;
      if (!hasUtm) return url;

      const urlObj = new URL(url.startsWith('http') ? url : `https://${url}`);
      if (utmSource) urlObj.searchParams.set('utm_source', utmSource);
      if (utmMedium) urlObj.searchParams.set('utm_medium', utmMedium);
      if (utmCampaign) urlObj.searchParams.set('utm_campaign', utmCampaign);
      return urlObj.toString();
    } catch (e) {
      return url;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      setError('');

      const destination = getComputedDestinationUrl();
      const tagsArray = tagInput
        .split(',')
        .map((t) => t.trim())
        .filter(Boolean);

      const payload = {
        originalUrl: destination,
        title: title.trim() || undefined,
        customAlias: customAlias.trim() || undefined,
        folderId: folderId ? Number(folderId) : undefined,
        campaignId: campaignId ? Number(campaignId) : undefined,
        tagNames: tagsArray.length > 0 ? tagsArray : undefined,
        expirationDate: expirationDate || undefined,
        password: password.trim() || undefined,
      };

      const result = await linkService.createLink(payload);

      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
      });

      navigate(`/links/${result.id}/analytics`);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create short link.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3, maxWidth: 840, mx: 'auto' }}>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
        <Button
          startIcon={<ArrowLeft size={16} />}
          onClick={() => navigate(-1)}
          color="inherit"
          size="small"
        >
          Back
        </Button>
        <Typography variant="h4" sx={{ fontWeight: 800 }}>
          Create Short Link
        </Typography>
      </Box>

      {error && <Alert severity="error">{error}</Alert>}

      <Card>
        <CardHeader
          title={
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Sparkles size={18} color="#6366F1" />
              <Typography variant="h6" sx={{ fontWeight: 700 }}>
                Link Details &amp; Configuration
              </Typography>
            </Box>
          }
          subheader="Enter destination parameters and configure tracking options"
        />
        <Divider />
        <CardContent sx={{ p: 3 }}>
          <form onSubmit={handleSubmit}>
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <TextField
                  label="Destination URL *"
                  placeholder="https://example.com/long-target-url"
                  fullWidth
                  required
                  value={originalUrl}
                  onChange={(e) => setOriginalUrl(e.target.value)}
                  helperText="Only valid HTTP and HTTPS web addresses are supported"
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  label="Title (optional)"
                  placeholder="e.g. Developer Docs"
                  fullWidth
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  label="Custom Alias (optional)"
                  placeholder="e.g. spring2026"
                  fullWidth
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Typography variant="caption" className="font-mono">
                          /r/
                        </Typography>
                      </InputAdornment>
                    ),
                  }}
                  value={customAlias}
                  onChange={(e) => setCustomAlias(e.target.value)}
                  helperText="Leave empty to auto-generate a Base62 7-char code"
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <FormControl fullWidth>
                  <InputLabel>Folder</InputLabel>
                  <Select
                    value={folderId}
                    label="Folder"
                    onChange={(e) => setFolderId(e.target.value)}
                  >
                    <MenuItem value="">None</MenuItem>
                    {folders.map((f) => (
                      <MenuItem key={f.id} value={f.id}>
                        {f.name}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>

              <Grid item xs={12} sm={6}>
                <FormControl fullWidth>
                  <InputLabel>Campaign</InputLabel>
                  <Select
                    value={campaignId}
                    label="Campaign"
                    onChange={(e) => setCampaignId(e.target.value)}
                  >
                    <MenuItem value="">None</MenuItem>
                    {campaigns.map((c) => (
                      <MenuItem key={c.id} value={c.id}>
                        {c.name}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>

              <Grid item xs={12}>
                <TextField
                  label="Tags (comma-separated)"
                  placeholder="react, spring, release"
                  fullWidth
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                />
              </Grid>

              {/* UTM Builder Sub-section */}
              <Grid item xs={12}>
                <Paper
                  elevation={0}
                  sx={{
                    p: 2.5,
                    borderRadius: 2.5,
                    bgcolor: 'background.subtle',
                    border: `1px solid ${theme.palette.divider}`,
                  }}
                >
                  <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 1.5, display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Crosshair size={16} color="#6366F1" /> UTM Tracking Parameters
                  </Typography>
                  <Grid container spacing={2}>
                    <Grid item xs={12} sm={4}>
                      <TextField
                        label="utm_source"
                        placeholder="twitter, newsletter"
                        size="small"
                        fullWidth
                        value={utmSource}
                        onChange={(e) => setUtmSource(e.target.value)}
                      />
                    </Grid>
                    <Grid item xs={12} sm={4}>
                      <TextField
                        label="utm_medium"
                        placeholder="social, email, cpc"
                        size="small"
                        fullWidth
                        value={utmMedium}
                        onChange={(e) => setUtmMedium(e.target.value)}
                      />
                    </Grid>
                    <Grid item xs={12} sm={4}>
                      <TextField
                        label="utm_campaign"
                        placeholder="summer-launch-2026"
                        size="small"
                        fullWidth
                        value={utmCampaign}
                        onChange={(e) => setUtmCampaign(e.target.value)}
                      />
                    </Grid>
                  </Grid>

                  {getComputedDestinationUrl() && (utmSource || utmMedium || utmCampaign) && (
                    <Box sx={{ mt: 1.5 }}>
                      <Typography variant="caption" color="text.secondary">
                        Computed Final URL:
                      </Typography>
                      <Typography variant="body2" className="font-mono" sx={{ wordBreak: 'break-all', color: 'primary.main', fontSize: '0.8rem' }}>
                        {getComputedDestinationUrl()}
                      </Typography>
                    </Box>
                  )}
                </Paper>
              </Grid>

              {/* Security & Expiry Options */}
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Link Expiration Date &amp; Time"
                  type="datetime-local"
                  fullWidth
                  InputLabelProps={{ shrink: true }}
                  value={expirationDate}
                  onChange={(e) => setExpirationDate(e.target.value)}
                  helperText="Link will be automatically paused after this time"
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  label="Password Protect (optional)"
                  placeholder="Visitor must enter this password"
                  type="password"
                  fullWidth
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  helperText="Secured with BCrypt password hashing"
                />
              </Grid>

              <Grid item xs={12} sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2, mt: 1 }}>
                <Button onClick={() => navigate('/links')} color="inherit">
                  Cancel
                </Button>
                <Button
                  type="submit"
                  variant="contained"
                  color="primary"
                  size="large"
                  disabled={loading}
                  startIcon={<Plus size={18} />}
                  sx={{ px: 4 }}
                >
                  {loading ? 'Creating Short Link...' : 'Create Short Link'}
                </Button>
              </Grid>
            </Grid>
          </form>
        </CardContent>
      </Card>
    </Box>
  );
};
