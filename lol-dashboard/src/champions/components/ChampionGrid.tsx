import {
  Alert,
  Box,
  CircularProgress,
  List,
  ListItem,
  Typography,
} from '@mui/material';
import { useChampionBootstrap } from '../hooks';

export default function ChampionGrid() {
  const { version, list, loading, error } = useChampionBootstrap();

  if (loading) return <CircularProgress />;
  if (error) return <Alert severity='error'>Failed to load champions.</Alert>;
  if (!version || !list) return null;

  return (
    <Box>
      <Typography
        variant='h6'
        gutterBottom
      >
        Patch {version} • {list.length} champions
      </Typography>
      <List dense>
        {list.slice(0, 20).map((c) => (
          <ListItem key={c.key}>{c.name}</ListItem>
        ))}
      </List>
      <Typography
        variant='body2'
        color='text.secondary'
      >
        (Showing first 20 for now )
      </Typography>
    </Box>
  );
}
