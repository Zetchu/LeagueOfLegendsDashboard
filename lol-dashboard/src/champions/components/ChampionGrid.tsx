import { Alert, Box, CircularProgress, Typography, Grid } from '@mui/material';
import { useChampionBootstrap } from '../hooks';
import { ChampionCard } from './ChampionCard';

export default function ChampionGrid() {
  const { version, list, loading, error } = useChampionBootstrap();

  if (loading) {
    return (
      <Box sx={{ display: 'grid', placeItems: 'center', py: 6 }}>
        <CircularProgress />
      </Box>
    );
  }
  if (error) return <Alert severity='error'>Failed to load champions.</Alert>;
  if (!version || !list) return null;

  return (
    <Box>
      <Typography
        variant='h5'
        sx={{ mb: 2 }}
      >
        Patch {version} • {list.length} champions
      </Typography>

      <Grid
        container
        spacing={2}
      >
        {list.map((ch) => (
          <Grid
            key={ch.key}
            size={{ xs: 12, sm: 6, md: 4, lg: 3 }}
          >
            <ChampionCard
              champion={ch}
              version={version}
            />
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}
