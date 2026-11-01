import { createTheme } from '@mui/material/styles';

export const getTheme = (mode = 'dark') => {
  const isDark = mode === 'dark';

  return createTheme({
    palette: {
      mode,
      primary: {
        main: isDark ? '#6366F1' : '#4F46E5',
        light: '#818CF8',
        dark: '#4338CA',
        contrastText: '#FFFFFF',
      },
      secondary: {
        main: isDark ? '#8B5CF6' : '#7C3AED',
        light: '#A78BFA',
        dark: '#6D28D9',
        contrastText: '#FFFFFF',
      },
      background: {
        default: isDark ? '#0A0E17' : '#F8FAFC',
        paper: isDark ? '#111827' : '#FFFFFF',
        subtle: isDark ? 'rgba(255, 255, 255, 0.03)' : 'rgba(0, 0, 0, 0.02)',
      },
      text: {
        primary: isDark ? '#F9FAFB' : '#0F172A',
        secondary: isDark ? '#9CA3AF' : '#64748B',
      },
      success: {
        main: '#10B981',
        light: '#34D399',
        dark: '#059669',
      },
      warning: {
        main: '#F59E0B',
        light: '#FBBF24',
        dark: '#D97706',
      },
      error: {
        main: '#EF4444',
        light: '#F87171',
        dark: '#DC2626',
      },
      info: {
        main: '#38BDF8',
        light: '#7DD3FC',
        dark: '#0284C7',
      },
      divider: isDark ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.08)',
    },
    typography: {
      fontFamily: '"Plus Jakarta Sans", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      h1: { fontWeight: 800, letterSpacing: '-0.025em' },
      h2: { fontWeight: 700, letterSpacing: '-0.02em' },
      h3: { fontWeight: 700, letterSpacing: '-0.015em' },
      h4: { fontWeight: 600, letterSpacing: '-0.01em' },
      h5: { fontWeight: 600 },
      h6: { fontWeight: 600 },
      subtitle1: { fontWeight: 500 },
      subtitle2: { fontWeight: 500 },
      button: {
        textTransform: 'none',
        fontWeight: 600,
        letterSpacing: '0.01em',
      },
    },
    shape: {
      borderRadius: 12,
    },
    components: {
      MuiButton: {
        styleOverrides: {
          root: {
            borderRadius: 10,
            padding: '8px 18px',
            boxShadow: 'none',
            '&:hover': {
              boxShadow: isDark
                ? '0 4px 20px -2px rgba(99, 102, 241, 0.35)'
                : '0 4px 20px -2px rgba(79, 70, 229, 0.25)',
            },
          },
          containedPrimary: {
            background: isDark
              ? 'linear-gradient(135deg, #6366F1 0%, #4F46E5 100%)'
              : 'linear-gradient(135deg, #4F46E5 0%, #4338CA 100%)',
          },
        },
      },
      MuiCard: {
        styleOverrides: {
          root: {
            borderRadius: 16,
            backgroundImage: 'none',
            border: isDark ? '1px solid rgba(255, 255, 255, 0.08)' : '1px solid rgba(0, 0, 0, 0.07)',
            boxShadow: isDark
              ? '0 4px 20px 0 rgba(0, 0, 0, 0.37)'
              : '0 4px 20px 0 rgba(0, 0, 0, 0.04)',
          },
        },
      },
      MuiPaper: {
        styleOverrides: {
          root: {
            backgroundImage: 'none',
          },
        },
      },
      MuiOutlinedInput: {
        styleOverrides: {
          root: {
            borderRadius: 10,
            '& fieldset': {
              borderColor: isDark ? 'rgba(255, 255, 255, 0.12)' : 'rgba(0, 0, 0, 0.15)',
            },
            '&:hover fieldset': {
              borderColor: isDark ? '#6366F1' : '#4F46E5',
            },
          },
        },
      },
      MuiChip: {
        styleOverrides: {
          root: {
            borderRadius: 8,
            fontWeight: 500,
          },
        },
      },
    },
  });
};
