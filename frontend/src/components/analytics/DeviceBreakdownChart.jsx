import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { Box, Typography, Paper, useTheme } from '@mui/material';
import { Monitor, Smartphone, Tablet } from 'lucide-react';

const COLORS = ['#6366F1', '#38BDF8', '#F59E0B', '#10B981', '#EC4899'];

export const DeviceBreakdownChart = ({ data = [], height = 240 }) => {
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';

  if (!data || data.length === 0) {
    return (
      <Box sx={{ p: 4, textAlign: 'center' }}>
        <Typography variant="body2" color="text.secondary">
          No device distribution data yet.
        </Typography>
      </Box>
    );
  }

  const getDeviceIcon = (name) => {
    switch (name.toLowerCase()) {
      case 'mobile':
        return <Smartphone size={14} />;
      case 'tablet':
        return <Tablet size={14} />;
      default:
        return <Monitor size={14} />;
    }
  };

  return (
    <Box sx={{ width: '100%', height }}>
      <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, alignItems: 'center', height: '100%' }}>
        <Box sx={{ flex: 1, height: '100%', minHeight: 180, width: '100%' }}>
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                innerRadius={50}
                outerRadius={75}
                paddingAngle={4}
                dataKey="count"
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip content={<CustomPieTooltip isDark={isDark} />} />
            </PieChart>
          </ResponsiveContainer>
        </Box>

        {/* Legend list with counts & percentage */}
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, minWidth: 150, pr: 2 }}>
          {data.map((item, index) => (
            <Box key={item.name} sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 1.5 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Box
                  sx={{
                    width: 10,
                    height: 10,
                    borderRadius: '50%',
                    bgcolor: COLORS[index % COLORS.length],
                  }}
                />
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, color: 'text.secondary' }}>
                  {getDeviceIcon(item.name)}
                  <Typography variant="caption" sx={{ fontWeight: 600, color: 'text.primary' }}>
                    {item.name}
                  </Typography>
                </Box>
              </Box>
              <Typography variant="caption" sx={{ fontWeight: 700 }}>
                {item.percentage}%
              </Typography>
            </Box>
          ))}
        </Box>
      </Box>
    </Box>
  );
};

const CustomPieTooltip = ({ active, payload, isDark }) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
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
        <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>
          {data.name}
        </Typography>
        <Typography variant="caption" color="text.secondary">
          {data.count.toLocaleString()} clicks ({data.percentage}%)
        </Typography>
      </Paper>
    );
  }
  return null;
};
