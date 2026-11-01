import React from 'react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { Box, Typography, Paper, useTheme } from '@mui/material';

export const ClickTrendsChart = ({ data = [], height = 300 }) => {
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';

  if (!data || data.length === 0) {
    return (
      <Box sx={{ p: 4, textAlign: 'center' }}>
        <Typography variant="body2" color="text.secondary">
          No click data recorded yet. Share your short link to see live traffic trends!
        </Typography>
      </Box>
    );
  }

  // Format date display (e.g., '2026-11-01' -> 'Nov 1')
  const formattedData = data.map((item) => {
    try {
      const parts = item.date.split('-');
      const d = new Date(parts[0], parts[1] - 1, parts[2]);
      const formatted = d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
      return { ...item, displayDate: formatted };
    } catch (e) {
      return { ...item, displayDate: item.date };
    }
  });

  return (
    <Box sx={{ width: '100%', height }}>
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={formattedData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
          <defs>
            <linearGradient id="clicksGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#6366F1" stopOpacity={0.4} />
              <stop offset="95%" stopColor="#6366F1" stopOpacity={0.0} />
            </linearGradient>
            <linearGradient id="visitorsGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#38BDF8" stopOpacity={0.3} />
              <stop offset="95%" stopColor="#38BDF8" stopOpacity={0.0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke={isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.06)'} vertical={false} />
          <XAxis
            dataKey="displayDate"
            stroke={isDark ? '#6B7280' : '#9CA3AF'}
            fontSize={11}
            tickLine={false}
            axisLine={false}
          />
          <YAxis
            stroke={isDark ? '#6B7280' : '#9CA3AF'}
            fontSize={11}
            tickLine={false}
            axisLine={false}
            allowDecimals={false}
          />
          <Tooltip content={<CustomTooltip isDark={isDark} />} />
          <Area
            type="monotone"
            dataKey="clicks"
            name="Total Clicks"
            stroke="#6366F1"
            strokeWidth={2.5}
            fillOpacity={1}
            fill="url(#clicksGradient)"
          />
          <Area
            type="monotone"
            dataKey="uniqueVisitors"
            name="Unique Visitors"
            stroke="#38BDF8"
            strokeWidth={2}
            fillOpacity={1}
            fill="url(#visitorsGradient)"
          />
        </AreaChart>
      </ResponsiveContainer>
    </Box>
  );
};

const CustomTooltip = ({ active, payload, label, isDark }) => {
  if (active && payload && payload.length) {
    return (
      <Paper
        elevation={4}
        sx={{
          p: 1.5,
          borderRadius: 2,
          bgcolor: isDark ? '#1F2937' : '#FFFFFF',
          border: isDark ? '1px solid rgba(255,255,255,0.1)' : '1px solid rgba(0,0,0,0.1)',
        }}
      >
        <Typography variant="caption" sx={{ fontWeight: 700, display: 'block', mb: 0.5, color: 'text.secondary' }}>
          {label}
        </Typography>
        {payload.map((entry, index) => (
          <Box key={`item-${index}`} sx={{ display: 'flex', alignItems: 'center', gap: 1, my: 0.25 }}>
            <Box sx={{ width: 8, height: 8, borderRadius: '50%', bgcolor: entry.color }} />
            <Typography variant="body2" sx={{ fontSize: '0.8rem', fontWeight: 600 }}>
              {entry.name}: <span style={{ fontWeight: 800 }}>{entry.value.toLocaleString()}</span>
            </Typography>
          </Box>
        ))}
      </Paper>
    );
  }
  return null;
};
