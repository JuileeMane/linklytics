import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  CardHeader,
  TextField,
  Button,
  IconButton,
  Paper,
  Divider,
  Alert,
  Chip,
  useTheme,
} from '@mui/material';
import {
  Target,
  Plus,
  Trash2,
  ExternalLink,
  MousePointerClick,
  Link as LinkIcon,
  Calendar,
} from 'lucide-react';
import { campaignService } from '../services/campaignService';
import { DeleteConfirmModal } from '../components/common/DeleteConfirmModal';

export const CampaignManagerPage = () => {
  const theme = useTheme();
  const navigate = useNavigate();

  const [campaigns, setCampaigns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // New campaign form
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Delete modal
  const [deleteId, setDeleteId] = useState(null);

  useEffect(() => {
    loadCampaigns();
  }, []);

  const loadCampaigns = async () => {
    try {
      setLoading(true);
      const data = await campaignService.getCampaigns();
      setCampaigns(data || []);
    } catch (e) {
      console.error(e);
      setError('Failed to load campaigns.');
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    if (!name.trim()) return;

    try {
      setIsSubmitting(true);
      await campaignService.createCampaign({ name: name.trim(), description: description.trim() });
      setName('');
      setDescription('');
      loadCampaigns();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create campaign.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const confirmDelete = async () => {
    if (!deleteId) return;
    try {
      await campaignService.deleteCampaign(deleteId);
      setDeleteId(null);
      loadCampaigns();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to delete campaign.');
    }
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
      <Box>
        <Typography variant="h4" sx={{ fontWeight: 800 }}>
          Campaigns Manager
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Aggregate multiple shortened destination URLs under marketing campaigns and track aggregate performance.
        </Typography>
      </Box>

      {error && <Alert severity="error" onClose={() => setError('')}>{error}</Alert>}

      <Grid container spacing={3}>
        {/* Create Campaign Card */}
        <Grid item xs={12} md={4}>
          <Card>
            <CardHeader
              avatar={<Target size={22} color="#10B981" />}
              title={<Typography variant="h6" sx={{ fontWeight: 700 }}>New Campaign</Typography>}
              subheader="Start tracking a new marketing campaign"
            />
            <Divider />
            <CardContent sx={{ p: 3 }}>
              <Box component="form" onSubmit={handleCreate} sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                <TextField
                  label="Campaign Name *"
                  placeholder="e.g. Summer Launch 2026, Black Friday"
                  fullWidth
                  size="small"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
                <TextField
                  label="Description"
                  placeholder="Optional details or goal"
                  multiline
                  rows={3}
                  fullWidth
                  size="small"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                />
                <Button
                  type="submit"
                  variant="contained"
                  color="primary"
                  startIcon={<Plus size={16} />}
                  disabled={!name.trim() || isSubmitting}
                >
                  {isSubmitting ? 'Creating...' : 'Create Campaign'}
                </Button>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Existing Campaigns Grid */}
        <Grid item xs={12} md={8}>
          {campaigns.length > 0 ? (
            <Grid container spacing={2}>
              {campaigns.map((c) => (
                <Grid item xs={12} sm={6} key={c.id}>
                  <Card
                    sx={{
                      height: '100%',
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'space-between',
                      transition: 'all 0.2s ease',
                      '&:hover': { transform: 'translateY(-2px)' },
                    }}
                  >
                    <CardContent sx={{ p: 3 }}>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 }}>
                        <Typography variant="h6" sx={{ fontWeight: 700 }}>
                          {c.name}
                        </Typography>
                        <IconButton size="small" color="error" onClick={() => setDeleteId(c.id)}>
                          <Trash2 size={16} />
                        </IconButton>
                      </Box>

                      {c.description && (
                        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                          {c.description}
                        </Typography>
                      )}

                      <Box sx={{ display: 'flex', gap: 3, my: 2 }}>
                        <Box>
                          <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 600 }}>
                            TOTAL LINKS
                          </Typography>
                          <Typography variant="h5" sx={{ fontWeight: 800, color: 'primary.main' }}>
                            {c.totalLinks}
                          </Typography>
                        </Box>
                        <Box>
                          <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 600 }}>
                            TOTAL CLICKS
                          </Typography>
                          <Typography variant="h5" sx={{ fontWeight: 800, color: '#10B981' }}>
                            {c.totalClicks.toLocaleString()}
                          </Typography>
                        </Box>
                      </Box>
                    </CardContent>

                    <Box sx={{ p: 2, pt: 0 }}>
                      <Button
                        variant="outlined"
                        fullWidth
                        size="small"
                        onClick={() => navigate(`/links?campaignId=${c.id}`)}
                      >
                        View Campaign Links
                      </Button>
                    </Box>
                  </Card>
                </Grid>
              ))}
            </Grid>
          ) : (
            <Paper
              elevation={0}
              sx={{
                p: 6,
                textAlign: 'center',
                borderRadius: 3,
                border: `1px dashed ${theme.palette.divider}`,
              }}
            >
              <Target size={44} color="#10B981" style={{ opacity: 0.5, marginBottom: 12 }} />
              <Typography variant="h6" sx={{ fontWeight: 700, mb: 1 }}>
                No campaigns created
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Use campaigns to organize multiple short links across social media or ad channels.
              </Typography>
            </Paper>
          )}
        </Grid>
      </Grid>

      <DeleteConfirmModal
        open={Boolean(deleteId)}
        onClose={() => setDeleteId(null)}
        onConfirm={confirmDelete}
        title="Delete Campaign"
        message="Are you sure you want to delete this campaign? Links assigned to this campaign will remain intact without the campaign label."
      />
    </Box>
  );
};
