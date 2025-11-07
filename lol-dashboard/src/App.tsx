import { Container } from '@mui/material';
import { ChampionGrid } from './champions';
import NavBar from './app/Navbar';
import { Route, Routes } from 'react-router-dom';
import { BuildPlanner } from './builds';

export default function App() {
  return (
    <>
      <NavBar />

      <Container sx={{ py: 3 }}>
        <Routes>
          <Route
            path='/'
            element={<ChampionGrid />}
          />
          <Route
            path='/builds'
            element={<BuildPlanner />}
          />
        </Routes>
      </Container>
    </>
  );
}
