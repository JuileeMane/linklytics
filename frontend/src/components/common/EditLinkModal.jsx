import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormControlLabel,
  Switch,
  Box,
  Typography,
  IconButton,
  Alert,
} from '@mui/material';
import { X, Lock, Calendar, Folder, Target } from 'lucide-react';
import { linkService } from '../../services/linkService';
import { folderService } from '../../services/folderTagService';
import { campaignService } from '../../services/campaignService';

export const EditLinkModal = ({ open, onClose, link, onUpdated }) => {
  const [title, setTitle] = useState('');
  const [originalUrl, setOriginalUrl] = useState('');
  const [folderId, setFolderId] = useState('');
  const [campaignId, setCampaignId] = useState('');
  const [tagInput, setTagInput] = useState('');
  const [expirationDate, setExpirationDate] = useState('');
  const [password, setPassword] = useState('');
  const [removePassword, setRemovePassword] = useState(false);
  const [active, setActive] = useState(true);

  const [folders, setFolders] = useState([]);
  const [campaigns, setCampaigns] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (open && link) {
      setTitle(link.title || '');
      setOriginalUrl(link.originalUrl || '');
      setFolderId(link.folder?.id || '');
      setCampaignId(link.campaign?.id || '');
      setTagInput(link.tags ? link.tags.map((t) => t.name).join(', ') : '');
      setExpirationDate(link.expirationDate ? link.expirationDate.substring(0, 16) : '');
      setActive(link.active);
      setPassword('');
      setRemovePassword(false);
      setError('');
      loadOptions();
    }
  }, [open, link]);

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

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      setError('');

      const tagsArray = tagInput
        .split(',')
        .map((t) => t.trim())
        .filter(Boolean);

      const payload = {
        title,
        originalUrl,
        folderId: folderId ? Number(folderId) : 0,
        campaignId: campaignId ? Number(campaignId) : 0,
        tagNames: tagsArray,
        expirationDate: expirationDate ? expirationDate : null,
        active,
      };

      if (removePassword) {
        payload.removePassword = true;
      } else if (password.trim()) {
        payload.password = password.trim();
      }

      await linkService.updateLink(link.id, payload);
      if (onUpdated) onUpdated();
      onClose();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update link.');
    } finally {
      setLoading(false);
    }
  };

  if (!link) return null;

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth PaperProps={{ sx: { borderRadius: 3, p: 1 } }}>
      <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="h6" sx={{ fontWeight: 700 }}>
          Edit Short Link
        </Typography>
        <IconButton onClick={onClose} size="small">
          <X size={18} />
        </IconButton>
      </DialogTitle>

      <form onSubmit={handleSubmit}>
        <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
          {error && <Alert severity="error">{error}</Alert>}

          <TextField
            label="Link Title"
            fullWidth
            size="small"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />

          <TextField
            label="Destination URL"
            fullWidth
            size="small"
            required
            value={originalUrl}
            onChange={(e) => setOriginalUrl(e.target.value)}
          />

          <Box sx={{ display: 'flex', gap: 2 }}>
            <FormControl fullWidth size="small">
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

            <FormControl fullWidth size="small">
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
          </Box>

          <TextField
            label="Tags (comma-separated)"
            placeholder="marketing, twitter, dev"
            fullWidth
            size="small"
            value={tagInput}
            onChange={(e) => setTagInput(e.target.value)}
          />

          <TextField
            label="Expiration Date &amp; Time"
            type="datetime-local"
            fullWidth
            size="small"
            InputLabelProps={{ shrink: true }}
            value={expirationDate}
            onChange={(e) => setExpirationDate(e.target.value)}
          />

          <Box sx={{ p: 2, borderRadius: 2, bgcolor: 'background.subtle', border: '1px solid', borderColor: 'divider' }}>
            <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 1, display: 'flex', alignItems: 'center', gap: 1 }}>
              <Lock size={15} /> Password Protection
            </Typography>
            {link.passwordProtected ? (
              <FormControlLabel
                control={<Switch checked={removePassword} onChange={(e) => setRemovePassword(e.target.checked)} color="error" />}
                label="Remove existing password protection"
              />
            ) : (
              <TextField
                label="Set New Password (optional)"
                type="password"
                size="small"
                fullWidth
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            )}
          </Box>

          <FormControlLabel
            control={<Switch checked={active} onChange={(e) => setActive(e.target.checked)} color="primary" />}
            label="Active Link (Accept redirects)"
          />
        </DialogContent>

        <DialogActions sx={{ p: 2 }}>
          <Button onClick={onClose} color="inherit">
            Cancel
          </Button>
          <Button type="submit" variant="contained" color="primary" disabled={loading}>
            {loading ? 'Saving...' : 'Save Changes'}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};
