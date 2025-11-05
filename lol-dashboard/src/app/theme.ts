import { createTheme } from '@mui/material/styles';

export const theme = createTheme({
  palette: {
    mode: 'dark',
    primary: { main: '#0AC8B9' }, // LoL teal vibe
    secondary: { main: '#C89B3C' }, // LoL gold
    background: { default: '#0b0f14', paper: '#121821' },
  },
  shape: { borderRadius: 10 },
});
