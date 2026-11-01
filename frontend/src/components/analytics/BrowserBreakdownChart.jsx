import React from 'react';
import { Box, Typography, LinearProgress, useTheme } from '@mui/material';

const BROWSER_COLORS = {
  Chrome: '#38BDF8',
  Firefox: '#F97316',
  Safari: '#6366F1',
  Edge: '#10B981',
  Opera: '#EF4444',
  'Samsung Internet': '#8B5CF6',
  Other: '#9CA3AF',
};

export const BrowserBreakdownChart = ({ data = [] }) => {
  const theme = useTheme();

  if (!data || data.length === 0) {
    return (
      <Box sx={{ p: 4, textAlign: 'center' }}>
        <Typography variant="body2" color="text.secondary">
          No browser data collected yet.
        </Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, py: 1 }}>
      {data.map((item) => {
        const color = BROWSER_COLORS[item.name] || '#6366F1';

        return (
          <Box key={item.name}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 0.75 }}>
              <Typography variant="body2" sx={{ fontWeight: 600 }}>
                {item.name}
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Typography variant="caption" color="text.secondary">
                  {item.count.toLocaleString()} clicks
                </Typography>
                <Typography variant="caption" sx={{ fontWeight: 700, minWidth: 40, textAlign: 'right' }}>
                  {item.percentage}%
                </Typography>
              </Box>
            </Box>
            <LinearProgress
              variant="determinate"
              value={item.percentage}
              sx={{
                height: 8,
                borderRadius: 4,
                bgcolor: theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.06)',
                '& .MuiLinearProgress-bar': {
                  borderRadius: 4,
                  bgcolor: color,
                },
              }}
            />
          </Box>
        );
      })}
    </Box>
  );
};
