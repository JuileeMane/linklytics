import React, { useState, useEffect } from 'react';
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
  Chip,
  Paper,
  Divider,
  Alert,
  useTheme,
} from '@mui/material';
import {
  FolderKanban,
  Tag as TagIcon,
  Plus,
  Trash2,
  Folder,
  Edit2,
} from 'lucide-react';
import { folderService, tagService } from '../services/folderTagService';
import { DeleteConfirmModal } from '../components/common/DeleteConfirmModal';

const PALETTE = ['#6366F1', '#3B82F6', '#8B5CF6', '#EC4899', '#10B981', '#F59E0B', '#06B6D4'];

export const FoldersTagsPage = () => {
  const theme = useTheme();

  const [folders, setFolders] = useState([]);
  const [tags, setTags] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // New folder form
  const [newFolderName, setNewFolderName] = useState('');
  const [newFolderColor, setNewFolderColor] = useState(PALETTE[0]);

  // New tag form
  const [newTagName, setNewTagName] = useState('');
  const [newTagColor, setNewTagColor] = useState(PALETTE[1]);

  // Delete modal
  const [deleteTarget, setDeleteTarget] = useState(null); // { type: 'folder'|'tag', id, name }

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [fData, tData] = await Promise.all([
        folderService.getFolders(),
        tagService.getTags(),
      ]);
      setFolders(fData || []);
      setTags(tData || []);
    } catch (e) {
      console.error(e);
      setError('Failed to load folders and tags.');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateFolder = async (e) => {
    e.preventDefault();
    if (!newFolderName.trim()) return;
    try {
      await folderService.createFolder({ name: newFolderName.trim(), color: newFolderColor });
      setNewFolderName('');
      loadData();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create folder.');
    }
  };

  const handleCreateTag = async (e) => {
    e.preventDefault();
    if (!newTagName.trim()) return;
    try {
      await tagService.createTag({ name: newTagName.trim(), color: newTagColor });
      setNewTagName('');
      loadData();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create tag.');
    }
  };

  const confirmDelete = async () => {
    if (!deleteTarget) return;
    try {
      if (deleteTarget.type === 'folder') {
        await folderService.deleteFolder(deleteTarget.id);
      } else {
        await tagService.deleteTag(deleteTarget.id);
      }
      setDeleteTarget(null);
      loadData();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to delete item.');
    }
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
      <Box>
        <Typography variant="h4" sx={{ fontWeight: 800 }}>
          Folders &amp; Tags
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Organize your destination links into intuitive color-coded folders and searchable tags.
        </Typography>
      </Box>

      {error && <Alert severity="error" onClose={() => setError('')}>{error}</Alert>}

      <Grid container spacing={3}>
        {/* Folders Management Column */}
        <Grid item xs={12} md={6}>
          <Card sx={{ height: '100%' }}>
            <CardHeader
              avatar={<FolderKanban size={22} color="#6366F1" />}
              title={<Typography variant="h6" sx={{ fontWeight: 700 }}>Folders</Typography>}
              subheader="Group links into high-level directory buckets"
            />
            <Divider />
            <CardContent sx={{ p: 3, display: 'flex', flexDirection: 'column', gap: 3 }}>
              {/* Add folder form */}
              <Box component="form" onSubmit={handleCreateFolder} sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                <TextField
                  label="Folder Name"
                  placeholder="e.g. Social Media, Docs, Marketing"
                  size="small"
                  fullWidth
                  value={newFolderName}
                  onChange={(e) => setNewFolderName(e.target.value)}
                />
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <Box sx={{ display: 'flex', gap: 1 }}>
                    {PALETTE.map((c) => (
                      <Box
                        key={c}
                        onClick={() => setNewFolderColor(c)}
                        sx={{
                          width: 22,
                          height: 22,
                          borderRadius: '50%',
                          bgcolor: c,
                          cursor: 'pointer',
                          outline: newFolderColor === c ? '2px solid #FFFFFF' : 'none',
                          boxShadow: newFolderColor === c ? '0 0 0 2px #6366F1' : 'none',
                        }}
                      />
                    ))}
                  </Box>
                  <Button type="submit" variant="contained" size="small" startIcon={<Plus size={16} />} disabled={!newFolderName.trim()}>
                    Add Folder
                  </Button>
                </Box>
              </Box>

              <Divider />

              {/* Folders list */}
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
                {folders.length > 0 ? (
                  folders.map((f) => (
                    <Paper
                      key={f.id}
                      elevation={0}
                      sx={{
                        p: 1.75,
                        borderRadius: 2,
                        bgcolor: 'background.subtle',
                        border: `1px solid ${theme.palette.divider}`,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                      }}
                    >
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                        <Folder size={18} color={f.color} />
                        <Typography variant="body2" sx={{ fontWeight: 700 }}>
                          {f.name}
                        </Typography>
                        <Chip label={`${f.linkCount} links`} size="small" sx={{ height: 20, fontSize: '0.65rem' }} />
                      </Box>
                      <IconButton size="small" color="error" onClick={() => setDeleteTarget({ type: 'folder', id: f.id, name: f.name })}>
                        <Trash2 size={16} />
                      </IconButton>
                    </Paper>
                  ))
                ) : (
                  <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center', py: 3 }}>
                    No folders created yet.
                  </Typography>
                )}
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Tags Management Column */}
        <Grid item xs={12} md={6}>
          <Card sx={{ height: '100%' }}>
            <CardHeader
              avatar={<TagIcon size={22} color="#10B981" />}
              title={<Typography variant="h6" sx={{ fontWeight: 700 }}>Tags</Typography>}
              subheader="Tag links across folders with custom keywords"
            />
            <Divider />
            <CardContent sx={{ p: 3, display: 'flex', flexDirection: 'column', gap: 3 }}>
              {/* Add tag form */}
              <Box component="form" onSubmit={handleCreateTag} sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                <TextField
                  label="Tag Name"
                  placeholder="e.g. spring, react, 2026, release"
                  size="small"
                  fullWidth
                  value={newTagName}
                  onChange={(e) => setNewTagName(e.target.value)}
                />
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <Box sx={{ display: 'flex', gap: 1 }}>
                    {PALETTE.map((c) => (
                      <Box
                        key={c}
                        onClick={() => setNewTagColor(c)}
                        sx={{
                          width: 22,
                          height: 22,
                          borderRadius: '50%',
                          bgcolor: c,
                          cursor: 'pointer',
                          outline: newTagColor === c ? '2px solid #FFFFFF' : 'none',
                          boxShadow: newTagColor === c ? '0 0 0 2px #10B981' : 'none',
                        }}
                      />
                    ))}
                  </Box>
                  <Button type="submit" variant="contained" size="small" color="secondary" startIcon={<Plus size={16} />} disabled={!newTagName.trim()}>
                    Add Tag
                  </Button>
                </Box>
              </Box>

              <Divider />

              {/* Tags Cloud / List */}
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1.5, py: 1 }}>
                {tags.length > 0 ? (
                  tags.map((t) => (
                    <Chip
                      key={t.id}
                      label={`#${t.name}`}
                      onDelete={() => setDeleteTarget({ type: 'tag', id: t.id, name: t.name })}
                      sx={{
                        fontWeight: 600,
                        bgcolor: `${t.color}15`,
                        color: t.color,
                        borderColor: t.color,
                      }}
                    />
                  ))
                ) : (
                  <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center', py: 3, width: '100%' }}>
                    No tags created yet.
                  </Typography>
                )}
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <DeleteConfirmModal
        open={Boolean(deleteTarget)}
        onClose={() => setDeleteTarget(null)}
        onConfirm={confirmDelete}
        title={`Delete ${deleteTarget?.type === 'folder' ? 'Folder' : 'Tag'}`}
        message={`Are you sure you want to delete "${deleteTarget?.name}"? Linked short links will remain active without this ${deleteTarget?.type}.`}
      />
    </Box>
  );
};
