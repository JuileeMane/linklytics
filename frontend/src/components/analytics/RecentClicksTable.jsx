import React from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
  Chip,
  Box,
  useTheme,
} from '@mui/material';
import { Monitor, Smartphone, Tablet, Clock, MapPin, Globe } from 'lucide-react';

export const RecentClicksTable = ({ clicks = [] }) => {
  const theme = useTheme();

  if (!clicks || clicks.length === 0) {
    return (
      <Box sx={{ p: 4, textAlign: 'center' }}>
        <Typography variant="body2" color="text.secondary">
          No click events logged yet. Once visitors click your links, detailed records appear here in real time.
        </Typography>
      </Box>
    );
  }

  const formatTimestamp = (ts) => {
    try {
      const d = new Date(ts);
      return d.toLocaleString('en-US', {
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      });
    } catch (e) {
      return ts;
    }
  };

  const getDeviceIcon = (device) => {
    switch (device?.toLowerCase()) {
      case 'mobile':
        return <Smartphone size={13} />;
      case 'tablet':
        return <Tablet size={13} />;
      default:
        return <Monitor size={13} />;
    }
  };

  return (
    <TableContainer
      component={Paper}
      elevation={0}
      sx={{
        borderRadius: 2,
        bgcolor: 'transparent',
        border: `1px solid ${theme.palette.divider}`,
      }}
    >
      <Table size="small">
        <TableHead sx={{ bgcolor: theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.02)' : 'rgba(0,0,0,0.02)' }}>
          <TableRow>
            <TableCell sx={{ fontWeight: 700, fontSize: '0.75rem', textTransform: 'uppercase', py: 1.5 }}>
              Timestamp
            </TableCell>
            <TableCell sx={{ fontWeight: 700, fontSize: '0.75rem', textTransform: 'uppercase' }}>
              Link
            </TableCell>
            <TableCell sx={{ fontWeight: 700, fontSize: '0.75rem', textTransform: 'uppercase' }}>
              Device &amp; OS
            </TableCell>
            <TableCell sx={{ fontWeight: 700, fontSize: '0.75rem', textTransform: 'uppercase' }}>
              Browser
            </TableCell>
            <TableCell sx={{ fontWeight: 700, fontSize: '0.75rem', textTransform: 'uppercase' }}>
              Referrer
            </TableCell>
            <TableCell sx={{ fontWeight: 700, fontSize: '0.75rem', textTransform: 'uppercase' }}>
              Location
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {clicks.map((click) => (
            <TableRow
              key={click.id}
              hover
              sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
            >
              <TableCell sx={{ color: 'text.secondary', fontSize: '0.8rem', whiteSpace: 'nowrap' }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75 }}>
                  <Clock size={12} />
                  {formatTimestamp(click.clickedAt)}
                </Box>
              </TableCell>

              <TableCell>
                <Typography variant="body2" sx={{ fontWeight: 600, fontSize: '0.85rem' }}>
                  {click.linkTitle || click.shortCode}
                </Typography>
                {click.shortCode && (
                  <Typography variant="caption" className="font-mono" color="primary.main">
                    /r/{click.shortCode}
                  </Typography>
                )}
              </TableCell>

              <TableCell>
                <Chip
                  icon={getDeviceIcon(click.deviceType)}
                  label={`${click.deviceType} • ${click.operatingSystem}`}
                  size="small"
                  variant="outlined"
                  sx={{ fontSize: '0.75rem', height: 24 }}
                />
              </TableCell>

              <TableCell sx={{ fontSize: '0.85rem', fontWeight: 500 }}>
                {click.browser}
              </TableCell>

              <TableCell sx={{ fontSize: '0.85rem', color: 'text.secondary' }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                  <Globe size={12} />
                  {click.referrer || 'Direct'}
                </Box>
              </TableCell>

              <TableCell sx={{ fontSize: '0.85rem', color: 'text.secondary' }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                  <MapPin size={12} color="#10B981" />
                  {click.country || 'Unknown'}
                </Box>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};
