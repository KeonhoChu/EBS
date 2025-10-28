import { createTheme } from '@mui/material/styles';

// NotebookLM-inspired dark theme
const darkTheme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#8ab4f8', // Lighter Google Blue for dark mode
      light: '#aecbfa',
      dark: '#669df6',
      50: '#1a2a3a',
      100: '#263447',
      200: '#344559',
    },
    secondary: {
      main: '#9aa0a6',
      light: '#bdc1c6',
      dark: '#80868b',
    },
    success: {
      main: '#81c995', // Lighter Google Green
      light: '#a8dab5',
      dark: '#5bb974',
      50: '#1e3a28',
    },
    error: {
      main: '#f28b82', // Lighter Google Red
      light: '#f5aea8',
      dark: '#ee675c',
    },
    warning: {
      main: '#fdd663', // Lighter Google Yellow
      light: '#fde293',
      dark: '#fcc934',
    },
    background: {
      default: '#1f1f1f',
      paper: '#292929',
    },
    text: {
      primary: '#e8eaed',
      secondary: '#9aa0a6',
    },
    divider: '#3c4043',
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
    '0px 1px 2px rgba(0, 0, 0, 0.3), 0px 1px 3px rgba(0, 0, 0, 0.15)',
    '0px 1px 2px rgba(0, 0, 0, 0.3), 0px 2px 6px rgba(0, 0, 0, 0.15)',
    '0px 1px 3px rgba(0, 0, 0, 0.3), 0px 4px 8px rgba(0, 0, 0, 0.15)',
    '0px 2px 3px rgba(0, 0, 0, 0.3), 0px 6px 10px rgba(0, 0, 0, 0.15)',
    '0px 4px 4px rgba(0, 0, 0, 0.3), 0px 8px 12px rgba(0, 0, 0, 0.15)',
    '0px 6px 10px rgba(0, 0, 0, 0.3), 0px 10px 14px rgba(0, 0, 0, 0.15)',
    '0px 8px 10px rgba(0, 0, 0, 0.3), 0px 12px 16px rgba(0, 0, 0, 0.15)',
    '0px 10px 14px rgba(0, 0, 0, 0.3), 0px 14px 18px rgba(0, 0, 0, 0.15)',
    '0px 12px 16px rgba(0, 0, 0, 0.3), 0px 16px 20px rgba(0, 0, 0, 0.15)',
    '0px 14px 18px rgba(0, 0, 0, 0.3), 0px 18px 22px rgba(0, 0, 0, 0.15)',
    '0px 16px 20px rgba(0, 0, 0, 0.3), 0px 20px 24px rgba(0, 0, 0, 0.15)',
    '0px 18px 22px rgba(0, 0, 0, 0.3), 0px 22px 26px rgba(0, 0, 0, 0.15)',
    '0px 20px 24px rgba(0, 0, 0, 0.3), 0px 24px 28px rgba(0, 0, 0, 0.15)',
    '0px 22px 26px rgba(0, 0, 0, 0.3), 0px 26px 30px rgba(0, 0, 0, 0.15)',
    '0px 24px 28px rgba(0, 0, 0, 0.3), 0px 28px 32px rgba(0, 0, 0, 0.15)',
    '0px 26px 30px rgba(0, 0, 0, 0.3), 0px 30px 34px rgba(0, 0, 0, 0.15)',
    '0px 28px 32px rgba(0, 0, 0, 0.3), 0px 32px 36px rgba(0, 0, 0, 0.15)',
    '0px 30px 34px rgba(0, 0, 0, 0.3), 0px 34px 38px rgba(0, 0, 0, 0.15)',
    '0px 32px 36px rgba(0, 0, 0, 0.3), 0px 36px 40px rgba(0, 0, 0, 0.15)',
    '0px 34px 38px rgba(0, 0, 0, 0.3), 0px 38px 42px rgba(0, 0, 0, 0.15)',
    '0px 36px 40px rgba(0, 0, 0, 0.3), 0px 40px 44px rgba(0, 0, 0, 0.15)',
    '0px 38px 42px rgba(0, 0, 0, 0.3), 0px 42px 46px rgba(0, 0, 0, 0.15)',
    '0px 40px 44px rgba(0, 0, 0, 0.3), 0px 44px 48px rgba(0, 0, 0, 0.15)',
    '0px 42px 46px rgba(0, 0, 0, 0.3), 0px 46px 50px rgba(0, 0, 0, 0.15)',
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
            boxShadow: '0px 1px 2px rgba(0, 0, 0, 0.3), 0px 1px 3px rgba(0, 0, 0, 0.15)',
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          boxShadow: '0px 1px 2px rgba(0, 0, 0, 0.3), 0px 1px 3px rgba(0, 0, 0, 0.15)',
          backgroundImage: 'none',
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          backgroundImage: 'none',
        },
        elevation1: {
          boxShadow: '0px 1px 2px rgba(0, 0, 0, 0.3), 0px 1px 3px rgba(0, 0, 0, 0.15)',
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

export default darkTheme;
