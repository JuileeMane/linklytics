import React, { useState, useEffect, useCallback } from 'react';
import {
  Box,
  Typography,
  TextField,
  InputAdornment,
  Button,
  Chip,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Pagination,
  CircularProgress,
  Alert,
  Paper,
  useTheme,
} from '@mui/material';
import {
  Search,
  Plus,
  Download,
  Filter,
  Layers,
  Star,
  Archive,
  CheckCircle,
  Clock,
} from 'lucide-react';
import { linkService } from '../services/linkService';
import { folderService } from '../services/folderTagService';
import { campaignService } from '../services/campaignService';
import { LinkCard } from '../components/links/LinkCard';
import { CreateLinkModal } from '../components/links/CreateLinkModal';

export const LinksPage = () => {
  const theme = useTheme();

  const [links, setLinks] = useState([]);
  const [totalPages, setTotalPages] = useState(1);
  const [totalElements, setTotalElements] = useState(0);
  const [page, setPage] = useState(0);
  const [size, setSize] = useState(10);
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('all');
  const [folderId, setFolderId] = useState('');
  const [campaignId, setCampaignId] = useState('');
  const [sortBy, setSortBy] = useState('createdAt');
  const [direction, setDirection] = useState('desc');

  const [folders, setFolders] = useState([]);
  const [campaigns, setCampaigns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const [createModalOpen, setCreateModalOpen] = useState(false);

  const fetchLinks = useCallback(async () => {
    try {
      setLoading(true);
      setError('');
      const data = await linkService.getLinks({
        search: search.trim() || undefined,
        folderId: folderId || undefined,
        campaignId: campaignId || undefined,
        status,
        page,
        size,
        sortBy,
        direction,
      });
      setLinks(data.content || []);
      setTotalPages(data.totalPages || 1);
      setTotalElements(data.totalElements || 0);
    } catch (err) {
      console.error(err);
      setError('Failed to fetch links. Please check backend connection.');
    } finally {
      setLoading(false);
    }
  }, [search, folderId, campaignId, status, page, size, sortBy, direction]);

  useEffect(() => {
    fetchLinks();
  }, [fetchLinks]);

  useEffect(() => {
    loadFilterOptions();
  }, []);

  const loadFilterOptions = async () => {
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

  const handleExportCsv = async () => {
    try {
      await linkService.exportCsv();
    } catch (e) {
      console.error('Failed to export CSV:', e);
    }
  };

  const statusFilters = [
    { label: 'All Links', value: 'all' },
    { label: 'Active', value: 'active', icon: CheckCircle },
    { label: 'Favorites', value: 'favorite', icon: Star },
    { label: 'Archived', value: 'archived', icon: Archive },
    { label: 'Expired', value: 'expired', icon: Clock },
  ];

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
      {/* Top Header */}
      <Box sx={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: 2 }}>
        <Box>
          <Typography variant="h4" sx={{ fontWeight: 800 }}>
            Links Manager
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Manage, filter, search, and monitor all your shortened destination URLs ({totalElements} total).
          </Typography>
        </Box>

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
          <Button
            variant="outlined"
            color="inherit"
            startIcon={<Download size={16} />}
            onClick={handleExportCsv}
          >
            Export CSV
          </Button>
          <Button
            variant="contained"
            color="primary"
            startIcon={<Plus size={16} />}
            onClick={() => setCreateModalOpen(true)}
          >
            Create Link
          </Button>
        </Box>
      </Box>

      {error && <Alert severity="error">{error}</Alert>}

      {/* Filter and Search Toolbar */}
      <Paper
        elevation={0}
        sx={{
          p: 2,
          borderRadius: 3,
          bgcolor: 'background.paper',
          border: `1px solid ${theme.palette.divider}`,
          display: 'flex',
          flexDirection: 'column',
          gap: 2,
        }}
      >
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, alignItems: 'center' }}>
          {/* Search bar */}
          <TextField
            placeholder="Search links by title, destination URL, or alias..."
            size="small"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(0);
            }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Search size={16} color="#6366F1" />
                </InputAdornment>
              ),
            }}
            sx={{ flex: 1, minWidth: { xs: '100%', sm: 260 } }}
          />

          {/* Folder filter */}
          <FormControl size="small" sx={{ minWidth: 150 }}>
            <InputLabel>Folder</InputLabel>
            <Select
              value={folderId}
              label="Folder"
              onChange={(e) => {
                setFolderId(e.target.value);
                setPage(0);
              }}
            >
              <MenuItem value="">All Folders</MenuItem>
              {folders.map((f) => (
                <MenuItem key={f.id} value={f.id}>
                  {f.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          {/* Campaign filter */}
          <FormControl size="small" sx={{ minWidth: 150 }}>
            <InputLabel>Campaign</InputLabel>
            <Select
              value={campaignId}
              label="Campaign"
              onChange={(e) => {
                setCampaignId(e.target.value);
                setPage(0);
              }}
            >
              <MenuItem value="">All Campaigns</MenuItem>
              {campaigns.map((c) => (
                <MenuItem key={c.id} value={c.id}>
                  {c.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          {/* Sort By */}
          <FormControl size="small" sx={{ minWidth: 140 }}>
            <InputLabel>Sort By</InputLabel>
            <Select
              value={sortBy}
              label="Sort By"
              onChange={(e) => setSortBy(e.target.value)}
            >
              <MenuItem value="createdAt">Date Created</MenuItem>
              <MenuItem value="clickCount">Click Volume</MenuItem>
              <MenuItem value="title">Alphabetical</MenuItem>
            </Select>
          </FormControl>
        </Box>

        {/* Status filter chips */}
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
          {statusFilters.map((f) => {
            const Icon = f.icon;
            const isSelected = status === f.value;
            return (
              <Chip
                key={f.value}
                icon={Icon ? <Icon size={14} /> : undefined}
                label={f.label}
                clickable
                color={isSelected ? 'primary' : 'default'}
                variant={isSelected ? 'filled' : 'outlined'}
                onClick={() => {
                  setStatus(f.value);
                  setPage(0);
                }}
                sx={{ fontWeight: 600, fontSize: '0.75rem', height: 28 }}
              />
            );
          })}
        </Box>
      </Paper>

      {/* Links List */}
      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
          <CircularProgress color="primary" />
        </Box>
      ) : links.length > 0 ? (
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          {links.map((link) => (
            <LinkCard
              key={link.id}
              link={link}
              onUpdated={fetchLinks}
              onDeleted={fetchLinks}
            />
          ))}

          {/* Pagination */}
          {totalPages > 1 && (
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3 }}>
              <Pagination
                count={totalPages}
                page={page + 1}
                onChange={(e, val) => setPage(val - 1)}
                color="primary"
                shape="rounded"
              />
            </Box>
          )}
        </Box>
      ) : (
        <Paper
          elevation={0}
          sx={{
            p: 6,
            textAlign: 'center',
            borderRadius: 3,
            border: `1px dashed ${theme.palette.divider}`,
            bgcolor: 'background.paper',
          }}
        >
          <Layers size={48} color="#6366F1" style={{ opacity: 0.5, marginBottom: 16 }} />
          <Typography variant="h6" sx={{ fontWeight: 700, mb: 1 }}>
            No links found
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ maxWidth: 420, mx: 'auto', mb: 3 }}>
            {search || folderId || campaignId || status !== 'all'
              ? 'No links match your current filter parameters. Try clearing your search or status filters.'
              : 'You have not shortened any destination URLs yet. Create your first branded short link in seconds!'}
          </Typography>
          <Button
            variant="contained"
            color="primary"
            startIcon={<Plus size={16} />}
            onClick={() => setCreateModalOpen(true)}
          >
            Create Your First Link
          </Button>
        </Paper>
      )}

      <CreateLinkModal
        open={createModalOpen}
        onClose={() => setCreateModalOpen(false)}
        onCreated={fetchLinks}
      />
    </Box>
  );
};
