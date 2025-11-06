import { createTheme } from '@mui/material/styles';

export const theme = createTheme({
  palette: {
    mode: 'dark',
    primary: { main: '#0AC8B9' },
    secondary: { main: '#C89B3C' },
    background: { default: '#0b0f14', paper: '#121821' },
  },
  shape: { borderRadius: 10 },
  typography: {
    fontFamily: `"Inter", system-ui, -apple-system, Segoe UI, Roboto, Arial, sans-serif`,
    h1: {
      fontFamily: `"Cinzel", serif`,
      fontWeight: 700,
      letterSpacing: '.02em',
    },
    h2: {
      fontFamily: `"Cinzel", serif`,
      fontWeight: 700,
      letterSpacing: '.02em',
    },
    h3: {
      fontFamily: `"Cinzel", serif`,
      fontWeight: 600,
      letterSpacing: '.01em',
    },

    button: {
      textTransform: 'uppercase',
      letterSpacing: '.06em',
      fontWeight: 700,
    },
  },
});
