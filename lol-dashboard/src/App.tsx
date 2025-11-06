import { Container } from '@mui/material';
import { ChampionGrid } from './champions';
import NavBar from './app/Navbar';

export default function App() {
  return (
    <>
      <NavBar />

      <Container sx={{ py: 3 }}>
        <ChampionGrid />
      </Container>
    </>
  );
}
