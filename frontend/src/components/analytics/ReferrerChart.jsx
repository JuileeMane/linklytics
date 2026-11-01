import React from 'react';
import { Box, Typography, Chip, Paper, useTheme } from '@mui/material';
import { Globe, ArrowUpRight } from 'lucide-react';

export const ReferrerChart = ({ data = [] }) => {
  const theme = useTheme();

  if (!data || data.length === 0) {
    return (
      <Box sx={{ p: 4, textAlign: 'center' }}>
        <Typography variant="body2" color="text.secondary">
          No traffic sources recorded yet.
        </Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5, py: 1 }}>
      {data.map((item) => (
        <Paper
          key={item.name}
          elevation={0}
          sx={{
            p: 1.5,
            borderRadius: 2,
            bgcolor: theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.03)' : 'rgba(0, 0, 0, 0.02)',
            border: `1px solid ${theme.palette.divider}`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
            <Box
              sx={{
                width: 32,
                height: 32,
                borderRadius: 1.5,
                bgcolor: 'primary.main',
                color: '#FFFFFF',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Globe size={16} />
            </Box>
            <Box>
              <Typography variant="body2" sx={{ fontWeight: 700 }}>
                {item.name}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                Referral traffic source
              </Typography>
            </Box>
          </Box>

          <Box sx={{ textAlign: 'right' }}>
            <Typography variant="body2" sx={{ fontWeight: 800 }}>
              {item.count.toLocaleString()}
            </Typography>
            <Typography variant="caption" color="primary.main" sx={{ fontWeight: 700 }}>
              {item.percentage}%
            </Typography>
          </Box>
        </Paper>
      ))}
    </Box>
  );
};
