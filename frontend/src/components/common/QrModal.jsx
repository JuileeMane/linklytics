import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Box,
  Typography,
  Slider,
  IconButton,
  CircularProgress,
  Tooltip,
  Snackbar,
  Alert,
} from '@mui/material';
import { X, Download, Copy, Check } from 'lucide-react';
import { linkService } from '../../services/linkService';

export const QrModal = ({ open, onClose, link }) => {
  const [size, setSize] = useState(300);
  const [qrBase64, setQrBase64] = useState('');
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (open && link) {
      loadQrCode();
    }
  }, [open, link, size]);

  const loadQrCode = async () => {
    try {
      setLoading(true);
      const data = await linkService.getQrCode(link.id, size, 'base64');
      setQrBase64(data.qrBase64);
    } catch (e) {
      console.error('Failed to load QR code:', e);
    } finally {
      setLoading(false);
    }
  };

  const handleCopyLink = () => {
    if (link) {
      navigator.clipboard.writeText(link.shortUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleDownloadPng = async () => {
    if (link) {
      await linkService.downloadQrPng(link.id, link.shortCode, size);
    }
  };

  if (!link) return null;

  return (
    <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth PaperProps={{ sx: { borderRadius: 3, p: 1 } }}>
      <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', pb: 1 }}>
        <Typography variant="h6" sx={{ fontWeight: 700 }}>
          QR Code Studio
        </Typography>
        <IconButton onClick={onClose} size="small">
          <X size={18} />
        </IconButton>
      </DialogTitle>

      <DialogContent sx={{ textAlign: 'center', py: 2 }}>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          Scan to visit <strong style={{ color: '#6366F1' }}>{link.shortCode}</strong>
        </Typography>

        <Box
          sx={{
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            p: 2,
            bgcolor: '#FFFFFF',
            borderRadius: 3,
            boxShadow: '0 8px 30px rgba(0,0,0,0.12)',
            minHeight: 220,
            minWidth: 220,
            mb: 2,
          }}
        >
          {loading ? (
            <CircularProgress size={36} />
          ) : qrBase64 ? (
            <Box
              component="img"
              src={qrBase64}
              alt="QR Code"
              sx={{ width: 200, height: 200, display: 'block' }}
            />
          ) : (
            <Typography variant="caption" color="text.secondary">
              Unable to load QR
            </Typography>
          )}
        </Box>

        {/* Short link copy chip */}
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 1,
            p: 1,
            bgcolor: 'background.subtle',
            borderRadius: 2,
            mb: 2,
          }}
        >
          <Typography variant="caption" className="font-mono" sx={{ fontWeight: 600 }}>
            {link.shortUrl}
          </Typography>
          <Tooltip title={copied ? 'Copied!' : 'Copy Link'}>
            <IconButton size="small" onClick={handleCopyLink} color={copied ? 'success' : 'default'}>
              {copied ? <Check size={14} /> : <Copy size={14} />}
            </IconButton>
          </Tooltip>
        </Box>

        {/* Size Slider */}
        <Box sx={{ px: 2 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
            <Typography variant="caption" color="text.secondary">
              Resolution
            </Typography>
            <Typography variant="caption" sx={{ fontWeight: 700 }}>
              {size} x {size} px
            </Typography>
          </Box>
          <Slider
            value={size}
            min={200}
            max={600}
            step={50}
            onChange={(e, val) => setSize(val)}
            size="small"
          />
        </Box>
      </DialogContent>

      <DialogActions sx={{ p: 2, pt: 0, justifyContent: 'space-between' }}>
        <Button onClick={onClose} color="inherit">
          Close
        </Button>
        <Button
          variant="contained"
          color="primary"
          startIcon={<Download size={16} />}
          onClick={handleDownloadPng}
        >
          Download PNG
        </Button>
      </DialogActions>
    </Dialog>
  );
};
