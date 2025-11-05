import {
  AppBar,
  Toolbar,
  Typography,
  Container,
  Button,
  Stack,
} from '@mui/material';
import { ChampionGrid } from './champions';

export default function App() {
  return (
    <>
      <AppBar
        position='static'
        color='transparent'
        elevation={0}
      >
        <Toolbar>
          <Typography
            variant='h6'
            sx={{ flexGrow: 1, fontWeight: 700 }}
          >
            LoL Dashboard
          </Typography>
          <Stack
            direction='row'
            spacing={1}
          >
            <Button color='inherit'>Champions</Button>
            <Button color='inherit'>Items</Button>
            <Button color='inherit'>Runes</Button>
          </Stack>
        </Toolbar>
      </AppBar>

      <Container sx={{ py: 3 }}>
        <ChampionGrid />
      </Container>
    </>
  );
}
