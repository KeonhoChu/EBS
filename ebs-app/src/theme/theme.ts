import { createTheme } from '@mui/material/styles';

// NotebookLM-inspired theme
const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#1a73e8', // Google Blue
      light: '#4285f4',
      dark: '#1557b0',
      50: '#e8f0fe',
      100: '#d2e3fc',
      200: '#aecbfa',
    },
    secondary: {
      main: '#5f6368', // Google Gray
      light: '#80868b',
      dark: '#3c4043',
    },
    success: {
      main: '#34a853', // Google Green
      light: '#5bb974',
      dark: '#0d652d',
      50: '#e6f4ea',
    },
    error: {
      main: '#ea4335', // Google Red
      light: '#ee675c',
      dark: '#c5221f',
    },
    warning: {
      main: '#fbbc04', // Google Yellow
      light: '#fcc934',
      dark: '#f29900',
    },
    background: {
      default: '#f8f9fa',
      paper: '#ffffff',
    },
    text: {
      primary: '#202124',
      secondary: '#5f6368',
    },
    divider: '#e8eaed',
  },
  typography: {
    fontFamily: [
      'Google Sans',
      'Roboto',
      '-apple-system',
      'BlinkMacSystemFont',
      '"Segoe UI"',
      '"Helvetica Neue"',
      'Arial',
      'sans-serif',
    ].join(','),
    h1: {
      fontWeight: 500,
      fontSize: '2.5rem',
      letterSpacing: '-0.01em',
    },
    h2: {
      fontWeight: 500,
      fontSize: '2rem',
      letterSpacing: '-0.01em',
    },
    h3: {
      fontWeight: 500,
      fontSize: '1.75rem',
    },
    h4: {
      fontWeight: 500,
      fontSize: '1.5rem',
    },
    h5: {
      fontWeight: 500,
      fontSize: '1.25rem',
    },
    h6: {
      fontWeight: 500,
      fontSize: '1rem',
    },
    subtitle1: {
      fontWeight: 500,
      fontSize: '1rem',
    },
    subtitle2: {
      fontWeight: 500,
      fontSize: '0.875rem',
    },
    body1: {
      fontSize: '1rem',
      lineHeight: 1.6,
    },
    body2: {
      fontSize: '0.875rem',
      lineHeight: 1.5,
    },
    button: {
      textTransform: 'none',
      fontWeight: 500,
    },
  },
  shape: {
    borderRadius: 8,
  },
  shadows: [
    'none',
    '0px 1px 2px rgba(60, 64, 67, 0.3), 0px 1px 3px rgba(60, 64, 67, 0.15)',
    '0px 1px 2px rgba(60, 64, 67, 0.3), 0px 2px 6px rgba(60, 64, 67, 0.15)',
    '0px 1px 3px rgba(60, 64, 67, 0.3), 0px 4px 8px rgba(60, 64, 67, 0.15)',
    '0px 2px 3px rgba(60, 64, 67, 0.3), 0px 6px 10px rgba(60, 64, 67, 0.15)',
    '0px 4px 4px rgba(60, 64, 67, 0.3), 0px 8px 12px rgba(60, 64, 67, 0.15)',
    '0px 6px 10px rgba(60, 64, 67, 0.3), 0px 10px 14px rgba(60, 64, 67, 0.15)',
    '0px 8px 10px rgba(60, 64, 67, 0.3), 0px 12px 16px rgba(60, 64, 67, 0.15)',
    '0px 10px 14px rgba(60, 64, 67, 0.3), 0px 14px 18px rgba(60, 64, 67, 0.15)',
    '0px 12px 16px rgba(60, 64, 67, 0.3), 0px 16px 20px rgba(60, 64, 67, 0.15)',
    '0px 14px 18px rgba(60, 64, 67, 0.3), 0px 18px 22px rgba(60, 64, 67, 0.15)',
    '0px 16px 20px rgba(60, 64, 67, 0.3), 0px 20px 24px rgba(60, 64, 67, 0.15)',
    '0px 18px 22px rgba(60, 64, 67, 0.3), 0px 22px 26px rgba(60, 64, 67, 0.15)',
    '0px 20px 24px rgba(60, 64, 67, 0.3), 0px 24px 28px rgba(60, 64, 67, 0.15)',
    '0px 22px 26px rgba(60, 64, 67, 0.3), 0px 26px 30px rgba(60, 64, 67, 0.15)',
    '0px 24px 28px rgba(60, 64, 67, 0.3), 0px 28px 32px rgba(60, 64, 67, 0.15)',
    '0px 26px 30px rgba(60, 64, 67, 0.3), 0px 30px 34px rgba(60, 64, 67, 0.15)',
    '0px 28px 32px rgba(60, 64, 67, 0.3), 0px 32px 36px rgba(60, 64, 67, 0.15)',
    '0px 30px 34px rgba(60, 64, 67, 0.3), 0px 34px 38px rgba(60, 64, 67, 0.15)',
    '0px 32px 36px rgba(60, 64, 67, 0.3), 0px 36px 40px rgba(60, 64, 67, 0.15)',
    '0px 34px 38px rgba(60, 64, 67, 0.3), 0px 38px 42px rgba(60, 64, 67, 0.15)',
    '0px 36px 40px rgba(60, 64, 67, 0.3), 0px 40px 44px rgba(60, 64, 67, 0.15)',
    '0px 38px 42px rgba(60, 64, 67, 0.3), 0px 42px 46px rgba(60, 64, 67, 0.15)',
    '0px 40px 44px rgba(60, 64, 67, 0.3), 0px 44px 48px rgba(60, 64, 67, 0.15)',
    '0px 42px 46px rgba(60, 64, 67, 0.3), 0px 46px 50px rgba(60, 64, 67, 0.15)',
  ],
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          padding: '8px 16px',
          fontWeight: 500,
        },
        contained: {
          boxShadow: 'none',
          '&:hover': {
            boxShadow: '0px 1px 2px rgba(60, 64, 67, 0.3), 0px 1px 3px rgba(60, 64, 67, 0.15)',
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          boxShadow: '0px 1px 2px rgba(60, 64, 67, 0.3), 0px 1px 3px rgba(60, 64, 67, 0.15)',
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: 8,
        },
        elevation1: {
          boxShadow: '0px 1px 2px rgba(60, 64, 67, 0.3), 0px 1px 3px rgba(60, 64, 67, 0.15)',
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
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            borderRadius: 8,
          },
        },
      },
    },
    MuiIconButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
        },
      },
    },
  },
});

export default theme;
