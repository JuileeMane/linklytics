import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  CardHeader,
  Grid,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
  Slider,
  Paper,
  CircularProgress,
  Tooltip,
  IconButton,
  Divider,
  useTheme,
} from '@mui/material';
import {
  QrCode,
  Download,
  Copy,
  Check,
  ExternalLink,
  Sparkles,
  Link as LinkIcon,
} from 'lucide-react';
import { linkService } from '../services/linkService';
import api from '../services/api';

export const QrStudioPage = () => {
  const theme = useTheme();

  const [links, setLinks] = useState([]);
  const [selectedLinkId, setSelectedLinkId] = useState('');
  const [customText, setCustomText] = useState('');
  const [size, setSize] = useState(300);
  const [qrBase64, setQrBase64] = useState('');
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    loadLinks();
  }, []);

  const loadLinks = async () => {
    try {
      const data = await linkService.getLinks({ size: 50 });
      const items = data.content || [];
      setLinks(items);
      if (items.length > 0) {
        setSelectedLinkId(items[0].id);
        setCustomText(items[0].shortUrl);
      }
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    if (customText) {
      generateQr();
    }
  }, [customText, size]);

  const handleSelectLink = (e) => {
    const id = e.target.value;
    setSelectedLinkId(id);
    const found = links.find((l) => l.id === id);
    if (found) {
      setCustomText(found.shortUrl);
    }
  };

  const generateQr = async () => {
    if (!customText.trim()) return;
    try {
      setLoading(true);
      // If selected link matches an existing link ID, use link's QR endpoint
      if (selectedLinkId) {
        const data = await linkService.getQrCode(selectedLinkId, size, 'base64');
        setQrBase64(data.qrBase64);
      } else {
        // Fallback or custom text
        const res = await api.get('/api/links/1/qr', { params: { size, format: 'base64' } });
        setQrBase64(res.data.qrBase64);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(customText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = async () => {
    if (selectedLinkId) {
      const found = links.find((l) => l.id === selectedLinkId);
      await linkService.downloadQrPng(selectedLinkId, found ? found.shortCode : 'linklytics-qr', size);
    }
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
      <Box>
        <Typography variant="h4" sx={{ fontWeight: 800 }}>
          QR Code Studio
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Generate, customize, and export high-definition QR codes powered by local ZXing engine.
        </Typography>
      </Box>

      <Grid container spacing={3}>
        {/* Controls Column */}
        <Grid item xs={12} md={6}>
          <Card sx={{ height: '100%' }}>
            <CardHeader
              title={<Typography variant="h6" sx={{ fontWeight: 700 }}>QR Configuration</Typography>}
              subheader="Select one of your existing short links or enter custom URL"
            />
            <Divider />
            <CardContent sx={{ p: 3, display: 'flex', flexDirection: 'column', gap: 3 }}>
              {links.length > 0 && (
                <FormControl fullWidth size="small">
                  <InputLabel>Select from Existing Short Links</InputLabel>
                  <Select
                    value={selectedLinkId}
                    label="Select from Existing Short Links"
                    onChange={handleSelectLink}
                  >
                    {links.map((link) => (
                      <MenuItem key={link.id} value={link.id}>
                        {link.title || link.shortCode} ({link.shortUrl})
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              )}

              <TextField
                label="Target URL encoded in QR"
                fullWidth
                size="small"
                value={customText}
                onChange={(e) => {
                  setCustomText(e.target.value);
                  setSelectedLinkId('');
                }}
              />

              <Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                  <Typography variant="body2" sx={{ fontWeight: 600 }}>
                    Image Resolution
                  </Typography>
                  <Typography variant="body2" sx={{ fontWeight: 700 }}>
                    {size} x {size} px
                  </Typography>
                </Box>
                <Slider
                  value={size}
                  min={200}
                  max={600}
                  step={50}
                  onChange={(e, val) => setSize(val)}
                />
              </Box>

              <Box sx={{ display: 'flex', gap: 2, mt: 1 }}>
                <Button
                  variant="contained"
                  color="primary"
                  fullWidth
                  startIcon={<Download size={16} />}
                  onClick={handleDownload}
                  disabled={!selectedLinkId}
                >
                  Download PNG
                </Button>
                <Button
                  variant="outlined"
                  color="inherit"
                  fullWidth
                  startIcon={copied ? <Check size={16} /> : <Copy size={16} />}
                  onClick={handleCopy}
                >
                  {copied ? 'Copied' : 'Copy URL'}
                </Button>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Live Preview Column */}
        <Grid item xs={12} md={6}>
          <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
            <CardHeader
              title={<Typography variant="h6" sx={{ fontWeight: 700 }}>Live Preview</Typography>}
              subheader="Scan directly with phone camera to test instant redirect"
            />
            <Divider />
            <CardContent
              sx={{
                flex: 1,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                p: 4,
              }}
            >
              <Box
                sx={{
                  p: 3,
                  bgcolor: '#FFFFFF',
                  borderRadius: 3.5,
                  boxShadow: '0 12px 40px rgba(0,0,0,0.15)',
                  minWidth: 260,
                  minHeight: 260,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  mb: 3,
                }}
              >
                {loading ? (
                  <CircularProgress size={44} />
                ) : qrBase64 ? (
                  <Box
                    component="img"
                    src={qrBase64}
                    alt="Generated QR Code"
                    sx={{ width: 240, height: 240, display: 'block' }}
                  />
                ) : (
                  <Typography variant="body2" color="text.secondary">
                    No QR code generated
                  </Typography>
                )}
              </Box>

              <Typography variant="caption" className="font-mono" color="text.secondary" sx={{ textAlign: 'center', wordBreak: 'break-all' }}>
                {customText}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};
