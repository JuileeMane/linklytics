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
  Box,
  Typography,
  IconButton,
  Alert,
  Collapse,
  InputAdornment,
  Paper,
  Tooltip,
} from '@mui/material';
import {
  X,
  Plus,
  Sparkles,
  Lock,
  Calendar,
  Folder,
  Target,
  Sliders,
  Copy,
  Check,
  QrCode,
  ExternalLink,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { linkService } from '../../services/linkService';
import { folderService } from '../../services/folderTagService';
import { campaignService } from '../../services/campaignService';
import { QrModal } from '../common/QrModal';

export const CreateLinkModal = ({ open, onClose, onCreated }) => {
  const [originalUrl, setOriginalUrl] = useState('');
  const [title, setTitle] = useState('');
  const [customAlias, setCustomAlias] = useState('');
  const [folderId, setFolderId] = useState('');
  const [campaignId, setCampaignId] = useState('');
  const [tagInput, setTagInput] = useState('');
  const [expirationDate, setExpirationDate] = useState('');
  const [password, setPassword] = useState('');

  const [showAdvanced, setShowAdvanced] = useState(false);
  const [folders, setFolders] = useState([]);
  const [campaigns, setCampaigns] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Result state after creation
  const [createdLink, setCreatedLink] = useState(null);
  const [copied, setCopied] = useState(false);
  const [qrOpen, setQrOpen] = useState(false);

  useEffect(() => {
    if (open) {
      resetForm();
      loadOptions();
    }
  }, [open]);

  const resetForm = () => {
    setOriginalUrl('');
    setTitle('');
    setCustomAlias('');
    setFolderId('');
    setCampaignId('');
    setTagInput('');
    setExpirationDate('');
    setPassword('');
    setShowAdvanced(false);
    setError('');
    setCreatedLink(null);
    setCopied(false);
  };

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
        originalUrl: originalUrl.trim(),
        title: title.trim() || undefined,
        customAlias: customAlias.trim() || undefined,
        folderId: folderId ? Number(folderId) : undefined,
        campaignId: campaignId ? Number(campaignId) : undefined,
        tagNames: tagsArray.length > 0 ? tagsArray : undefined,
        expirationDate: expirationDate || undefined,
        password: password.trim() || undefined,
      };

      const result = await linkService.createLink(payload);
      setCreatedLink(result);

      // Trigger delightful celebratory confetti
      confetti({
        particleCount: 80,
        spread: 60,
        origin: { y: 0.6 },
      });

      if (onCreated) onCreated(result);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create short link.');
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = () => {
    if (createdLink) {
      navigator.clipboard.writeText(createdLink.shortUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <>
      <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth PaperProps={{ sx: { borderRadius: 3, p: 1 } }}>
        <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Sparkles size={18} color="#6366F1" />
            <Typography variant="h6" sx={{ fontWeight: 700 }}>
              {createdLink ? 'Link Created Successfully!' : 'Create New Short Link'}
            </Typography>
          </Box>
          <IconButton onClick={onClose} size="small">
            <X size={18} />
          </IconButton>
        </DialogTitle>

        {createdLink ? (
          // Success State
          <DialogContent sx={{ py: 2 }}>
            <Paper
              elevation={0}
              sx={{
                p: 3,
                borderRadius: 2.5,
                bgcolor: 'rgba(99, 102, 241, 0.08)',
                border: '1px solid rgba(99, 102, 241, 0.25)',
                mb: 3,
              }}
            >
              <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 600 }}>
                YOUR SHORT LINK
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mt: 0.5, gap: 1 }}>
                <Typography variant="h6" className="font-mono" sx={{ fontWeight: 800, color: 'primary.main', wordBreak: 'break-all' }}>
                  {createdLink.shortUrl}
                </Typography>
                <Tooltip title={copied ? 'Copied!' : 'Copy to Clipboard'}>
                  <Button
                    variant="contained"
                    color={copied ? 'success' : 'primary'}
                    size="small"
                    startIcon={copied ? <Check size={16} /> : <Copy size={16} />}
                    onClick={handleCopy}
                    sx={{ minWidth: 100 }}
                  >
                    {copied ? 'Copied' : 'Copy'}
                  </Button>
                </Tooltip>
              </Box>
            </Paper>

            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
              <Typography variant="caption" color="text.secondary">
                ORIGINAL DESTINATION
              </Typography>
              <Typography variant="body2" sx={{ wordBreak: 'break-all', fontWeight: 500 }}>
                {createdLink.originalUrl}
              </Typography>
            </Box>

            <Box sx={{ display: 'flex', gap: 1.5, mt: 3 }}>
              <Button
                variant="outlined"
                color="inherit"
                fullWidth
                startIcon={<QrCode size={16} />}
                onClick={() => setQrOpen(true)}
              >
                View QR Code
              </Button>
              <Button
                variant="outlined"
                color="primary"
                fullWidth
                startIcon={<ExternalLink size={16} />}
                component="a"
                href={createdLink.shortUrl}
                target="_blank"
                rel="noreferrer"
              >
                Test Redirect
              </Button>
            </Box>
          </DialogContent>
        ) : (
          // Creation Form
          <form onSubmit={handleSubmit}>
            <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 2.5, py: 1 }}>
              {error && <Alert severity="error">{error}</Alert>}

              <TextField
                label="Destination URL *"
                placeholder="https://example.com/very-long-url-path"
                fullWidth
                required
                autoFocus
                value={originalUrl}
                onChange={(e) => setOriginalUrl(e.target.value)}
              />

              <TextField
                label="Custom Alias (optional)"
                placeholder="e.g. spring-boot-demo"
                fullWidth
                size="small"
                helperText="Leave blank for an automatically generated 7-character code"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Typography variant="caption" className="font-mono" color="text.secondary">
                        /r/
                      </Typography>
                    </InputAdornment>
                  ),
                }}
                value={customAlias}
                onChange={(e) => setCustomAlias(e.target.value)}
              />

              <TextField
                label="Title (optional)"
                placeholder="e.g. My Portfolio Website"
                fullWidth
                size="small"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />

              {/* Advanced Settings Toggle */}
              <Button
                variant="text"
                color="inherit"
                size="small"
                startIcon={<Sliders size={15} />}
                onClick={() => setShowAdvanced(!showAdvanced)}
                sx={{ alignSelf: 'flex-start', color: 'text.secondary' }}
              >
                {showAdvanced ? 'Hide Advanced Options' : 'Show Advanced Options (Folder, Tags, Expiry, Password)'}
              </Button>

              <Collapse in={showAdvanced}>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 1 }}>
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
                    placeholder="react, showcase, portfolio"
                    fullWidth
                    size="small"
                    value={tagInput}
                    onChange={(e) => setTagInput(e.target.value)}
                  />

                  <TextField
                    label="Link Expiration Date &amp; Time"
                    type="datetime-local"
                    fullWidth
                    size="small"
                    InputLabelProps={{ shrink: true }}
                    value={expirationDate}
                    onChange={(e) => setExpirationDate(e.target.value)}
                  />

                  <TextField
                    label="Protect with Password"
                    placeholder="Leave blank for public access"
                    type="password"
                    fullWidth
                    size="small"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </Box>
              </Collapse>
            </DialogContent>

            <DialogActions sx={{ p: 2, pt: 1 }}>
              <Button onClick={onClose} color="inherit">
                Cancel
              </Button>
              <Button type="submit" variant="contained" color="primary" disabled={loading}>
                {loading ? 'Shortening...' : 'Create Link'}
              </Button>
            </DialogActions>
          </form>
        )}

        {createdLink && (
          <DialogActions sx={{ p: 2 }}>
            <Button onClick={resetForm} color="inherit">
              Create Another
            </Button>
            <Button onClick={onClose} variant="contained" color="primary">
              Done
            </Button>
          </DialogActions>
        )}
      </Dialog>

      {createdLink && (
        <QrModal
          open={qrOpen}
          onClose={() => setQrOpen(false)}
          link={createdLink}
        />
      )}
    </>
  );
};
