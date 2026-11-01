import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Card,
  CardContent,
  Box,
  Typography,
  IconButton,
  Chip,
  Tooltip,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
  useTheme,
  Button,
} from '@mui/material';
import {
  Copy,
  Check,
  QrCode,
  BarChart2,
  MoreVertical,
  Edit2,
  Trash2,
  Star,
  Archive,
  Play,
  Pause,
  ExternalLink,
  Lock,
  Clock,
  Folder,
  Tag as TagIcon,
} from 'lucide-react';
import { linkService } from '../../services/linkService';
import { QrModal } from '../common/QrModal';
import { EditLinkModal } from '../common/EditLinkModal';
import { DeleteConfirmModal } from '../common/DeleteConfirmModal';

export const LinkCard = ({ link, onUpdated, onDeleted }) => {
  const theme = useTheme();
  const navigate = useNavigate();

  const [copied, setCopied] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const [qrOpen, setQrOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleMenuOpen = (e) => setAnchorEl(e.currentTarget);
  const handleMenuClose = () => setAnchorEl(null);

  const handleCopy = () => {
    navigator.clipboard.writeText(link.shortUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleToggleFavorite = async () => {
    handleMenuClose();
    try {
      await linkService.toggleFavorite(link.id);
      if (onUpdated) onUpdated();
    } catch (e) {
      console.error(e);
    }
  };

  const handleToggleActive = async () => {
    handleMenuClose();
    try {
      await linkService.toggleActive(link.id);
      if (onUpdated) onUpdated();
    } catch (e) {
      console.error(e);
    }
  };

  const handleToggleArchive = async () => {
    handleMenuClose();
    try {
      await linkService.toggleArchive(link.id);
      if (onUpdated) onUpdated();
    } catch (e) {
      console.error(e);
    }
  };

  const handleDelete = async () => {
    try {
      setIsDeleting(true);
      await linkService.deleteLink(link.id);
      setDeleteOpen(false);
      if (onDeleted) onDeleted(link.id);
    } catch (e) {
      console.error(e);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <>
      <Card
        sx={{
          transition: 'all 0.2s ease',
          '&:hover': {
            transform: 'translateY(-2px)',
            boxShadow: theme.palette.mode === 'dark'
              ? '0 8px 30px rgba(0,0,0,0.5)'
              : '0 8px 30px rgba(0,0,0,0.08)',
          },
        }}
      >
        <CardContent sx={{ p: 2.5 }}>
          {/* Top row: Title, Favorite Star, Actions */}
          <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 1, mb: 1 }}>
            <Box sx={{ minWidth: 0, flex: 1 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Typography variant="h6" noWrap sx={{ fontWeight: 700, fontSize: '1.05rem' }}>
                  {link.title || link.shortCode}
                </Typography>
                {link.favorite && (
                  <Tooltip title="Favorited Link">
                    <Star size={16} fill="#F59E0B" color="#F59E0B" />
                  </Tooltip>
                )}
                {link.passwordProtected && (
                  <Tooltip title="Password Protected">
                    <Lock size={15} color="#EC4899" />
                  </Tooltip>
                )}
                {link.expired && (
                  <Chip label="Expired" size="small" color="error" sx={{ height: 20, fontSize: '0.65rem' }} />
                )}
                {!link.active && !link.expired && (
                  <Chip label="Paused" size="small" sx={{ height: 20, fontSize: '0.65rem', bgcolor: 'warning.main', color: '#fff' }} />
                )}
              </Box>

              {/* Destination URL */}
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mt: 0.25 }}>
                <Typography
                  variant="caption"
                  color="text.secondary"
                  noWrap
                  sx={{ maxWidth: { xs: 240, sm: 380, md: 520 }, display: 'inline-block' }}
                >
                  {link.originalUrl}
                </Typography>
                <IconButton
                  component="a"
                  href={link.originalUrl}
                  target="_blank"
                  rel="noreferrer"
                  size="small"
                  sx={{ p: 0.25, color: 'text.secondary' }}
                >
                  <ExternalLink size={12} />
                </IconButton>
              </Box>
            </Box>

            {/* Top Right: Clicks Counter & Menu */}
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Box
                sx={{
                  px: 1.5,
                  py: 0.5,
                  borderRadius: 2,
                  bgcolor: 'rgba(99, 102, 241, 0.1)',
                  color: 'primary.main',
                  display: 'flex',
                  alignItems: 'baseline',
                  gap: 0.5,
                }}
              >
                <Typography variant="subtitle2" sx={{ fontWeight: 800 }}>
                  {link.clickCount.toLocaleString()}
                </Typography>
                <Typography variant="caption" sx={{ fontSize: '0.65rem', fontWeight: 600 }}>
                  clicks
                </Typography>
              </Box>

              <IconButton size="small" onClick={handleMenuOpen}>
                <MoreVertical size={18} />
              </IconButton>
            </Box>
          </Box>

          {/* Middle Row: Short Link bar & Quick Actions */}
          <Box
            sx={{
              display: 'flex',
              flexWrap: 'wrap',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: 1.5,
              mt: 2,
              p: 1.25,
              borderRadius: 2,
              bgcolor: 'background.subtle',
              border: `1px solid ${theme.palette.divider}`,
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, minWidth: 0 }}>
              <Typography
                variant="body2"
                className="font-mono"
                noWrap
                sx={{
                  fontWeight: 700,
                  color: 'primary.main',
                }}
              >
                {link.shortUrl}
              </Typography>
            </Box>

            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Button
                size="small"
                variant="contained"
                color={copied ? 'success' : 'primary'}
                startIcon={copied ? <Check size={14} /> : <Copy size={14} />}
                onClick={handleCopy}
                sx={{ py: 0.5, px: 1.5, fontSize: '0.75rem' }}
              >
                {copied ? 'Copied' : 'Copy'}
              </Button>

              <Tooltip title="View QR Code">
                <IconButton size="small" onClick={() => setQrOpen(true)}>
                  <QrCode size={16} />
                </IconButton>
              </Tooltip>

              <Tooltip title="View Link Analytics">
                <IconButton size="small" onClick={() => navigate(`/links/${link.id}/analytics`)}>
                  <BarChart2 size={16} color="#38BDF8" />
                </IconButton>
              </Tooltip>
            </Box>
          </Box>

          {/* Bottom Row: Folder, Tags, Creation Date */}
          <Box
            sx={{
              display: 'flex',
              flexWrap: 'wrap',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: 1,
              mt: 2,
              pt: 1,
            }}
          >
            <Box sx={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 0.75 }}>
              {link.folder && (
                <Chip
                  icon={<Folder size={12} color={link.folder.color} />}
                  label={link.folder.name}
                  size="small"
                  variant="outlined"
                  sx={{ height: 22, fontSize: '0.7rem', borderColor: `${link.folder.color}40` }}
                />
              )}

              {link.campaign && (
                <Chip
                  icon={<TagIcon size={12} color="#10B981" />}
                  label={link.campaign.name}
                  size="small"
                  variant="outlined"
                  sx={{ height: 22, fontSize: '0.7rem', color: '#10B981', borderColor: 'rgba(16, 185, 129, 0.4)' }}
                />
              )}

              {link.tags &&
                link.tags.map((tag) => (
                  <Chip
                    key={tag.id}
                    label={`#${tag.name}`}
                    size="small"
                    sx={{
                      height: 20,
                      fontSize: '0.65rem',
                      fontWeight: 600,
                      bgcolor: `${tag.color}15`,
                      color: tag.color,
                    }}
                  />
                ))}
            </Box>

            <Typography variant="caption" color="text.secondary" sx={{ fontSize: '0.7rem' }}>
              Created {new Date(link.createdAt).toLocaleDateString()}
            </Typography>
          </Box>
        </CardContent>
      </Card>

      {/* Action Dropdown Menu */}
      <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleMenuClose}>
        <MenuItem onClick={() => { handleMenuClose(); navigate(`/links/${link.id}/analytics`); }}>
          <ListItemIcon><BarChart2 size={16} color="#38BDF8" /></ListItemIcon>
          <ListItemText>Analytics</ListItemText>
        </MenuItem>
        <MenuItem onClick={() => { handleMenuClose(); setQrOpen(true); }}>
          <ListItemIcon><QrCode size={16} /></ListItemIcon>
          <ListItemText>QR Code</ListItemText>
        </MenuItem>
        <MenuItem onClick={() => { handleMenuClose(); setEditOpen(true); }}>
          <ListItemIcon><Edit2 size={16} /></ListItemIcon>
          <ListItemText>Edit</ListItemText>
        </MenuItem>
        <MenuItem onClick={handleToggleFavorite}>
          <ListItemIcon><Star size={16} color={link.favorite ? '#F59E0B' : 'inherit'} /></ListItemIcon>
          <ListItemText>{link.favorite ? 'Unfavorite' : 'Favorite'}</ListItemText>
        </MenuItem>
        <MenuItem onClick={handleToggleActive}>
          <ListItemIcon>{link.active ? <Pause size={16} color="#F59E0B" /> : <Play size={16} color="#10B981" />}</ListItemIcon>
          <ListItemText>{link.active ? 'Pause Link' : 'Activate Link'}</ListItemText>
        </MenuItem>
        <MenuItem onClick={handleToggleArchive}>
          <ListItemIcon><Archive size={16} /></ListItemIcon>
          <ListItemText>{link.archived ? 'Restore from Archive' : 'Archive Link'}</ListItemText>
        </MenuItem>
        <MenuItem onClick={() => { handleMenuClose(); setDeleteOpen(true); }} sx={{ color: 'error.main' }}>
          <ListItemIcon><Trash2 size={16} color={theme.palette.error.main} /></ListItemIcon>
          <ListItemText>Delete</ListItemText>
        </MenuItem>
      </Menu>

      <QrModal open={qrOpen} onClose={() => setQrOpen(false)} link={link} />
      <EditLinkModal open={editOpen} onClose={() => setEditOpen(false)} link={link} onUpdated={onUpdated} />
      <DeleteConfirmModal
        open={deleteOpen}
        onClose={() => setDeleteOpen(false)}
        onConfirm={handleDelete}
        loading={isDeleting}
        title="Delete Short Link"
        message={`Are you sure you want to delete "${link.title || link.shortCode}"? All redirect traffic and click statistics will be permanently removed.`}
      />
    </>
  );
};
