import { useMemo, useState } from 'react';
import {
  Alert,
  Box,
  CircularProgress,
  Typography,
  Stack,
  ToggleButtonGroup,
  ToggleButton,
  TextField,
  InputAdornment,
  Switch,
  FormControlLabel,
  Grid,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';

import { useChampionBootstrap } from '../hooks';
import { ChampionCard } from './ChampionCard';
import type { ChampionTag } from '../types';
import { useFavorites } from '../../favorites'; // <-- import the modlet

const CLASSES: ChampionTag[] = [
  'Assassin',
  'Fighter',
  'Mage',
  'Marksman',
  'Support',
  'Tank',
];

export default function ChampionGrid() {
  const { version, list, loading, error } = useChampionBootstrap();
  const [selected, setSelected] = useState<ChampionTag | 'All' | null>(null);
  const [query, setQuery] = useState('');
  const [onlyFavs, setOnlyFavs] = useState(false);
  const { ids: favIds, isFavorite, toggleFavorite } = useFavorites();

  const filtered = useMemo(() => {
    if (!list) return [];
    let out = list;
    if (selected && selected !== 'All')
      out = out.filter((c) => c.tags.includes(selected));
    if (query.trim()) {
      const q = query.toLowerCase();
      out = out.filter((c) => c.name.toLowerCase().includes(q));
    }
    if (onlyFavs) {
      out = out.filter((c) => isFavorite(c.id));
    }
    return out;
  }, [list, selected, query, onlyFavs, isFavorite]);

  if (loading)
    return (
      <Box sx={{ display: 'grid', placeItems: 'center', py: 6 }}>
        <CircularProgress />
      </Box>
    );
  if (error) return <Alert severity='error'>Failed to load champions.</Alert>;
  if (!version || !list) return null;

  return (
    <Box>
      {/* Top bar */}
      <Stack
        direction={{ xs: 'column', sm: 'row' }}
        alignItems={{ xs: 'stretch', sm: 'center' }}
        justifyContent='space-between'
        spacing={2}
        sx={{ mb: 2 }}
      >
        {selected !== null ? (
          <Box
            sx={{
              width: '100%',
              overflowX: 'auto',
              scrollbarWidth: 'none',
              msOverflowStyle: 'none',
              '&::-webkit-scrollbar': { display: 'none' },
            }}
          >
            <ToggleButtonGroup
              value={selected ?? ''}
              exclusive
              onChange={(_, val: ChampionTag | 'All' | null) => {
                if (val !== null) setSelected(val); // don't allow null deselect
              }}
              size='small'
              color='primary'
              sx={{
                flexWrap: 'nowrap',
                '& .MuiToggleButton-root': { flex: '0 0 auto', px: 1.25 },
              }}
            >
              <ToggleButton value='All'>All</ToggleButton>
              {CLASSES.map((c) => (
                <ToggleButton
                  key={c}
                  value={c}
                >
                  {c}
                </ToggleButton>
              ))}
            </ToggleButtonGroup>
          </Box>
        ) : (
          <span />
        )}

        <Stack
          direction='row'
          spacing={2}
          alignItems='center'
          sx={{ width: { xs: '100%', sm: 'auto' } }}
        >
          <FormControlLabel
            control={
              <Switch
                checked={onlyFavs}
                onChange={(e) => setOnlyFavs(e.target.checked)}
              />
            }
            label='Favorites only'
            sx={{ m: 0 }}
          />
          <TextField
            size='small'
            placeholder='Search champions…'
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position='start'>
                  <SearchIcon fontSize='small' />
                </InputAdornment>
              ),
            }}
            sx={{ width: { xs: '100%', sm: 280 } }}
          />
        </Stack>
      </Stack>

      {/* First-time prompt */}
      {selected === null ? (
        <Box sx={{ textAlign: 'center', py: 6 }}>
          <Typography
            variant='h5'
            gutterBottom
          >
            Choose a class to get started
          </Typography>
          <Stack
            direction='row'
            spacing={1}
            justifyContent='center'
            flexWrap='wrap'
            sx={{ mt: 1 }}
          >
            <ToggleButton
              value='All'
              onClick={() => setSelected('All')}
              size='small'
            >
              All
            </ToggleButton>
            {CLASSES.map((c) => (
              <ToggleButton
                key={c}
                value={c}
                onClick={() => setSelected(c)}
                size='small'
              >
                {c}
              </ToggleButton>
            ))}
          </Stack>
          {favIds.length > 0 && (
            <Typography
              variant='body2'
              sx={{ mt: 2 }}
              color='text.secondary'
            >
              You have {favIds.length} favorite{favIds.length === 1 ? '' : 's'}{' '}
              saved.
            </Typography>
          )}
        </Box>
      ) : (
        <>
          <Typography
            variant='h6'
            sx={{ mb: 1 }}
          >
            Patch {version} • {filtered.length}{' '}
            {onlyFavs
              ? 'favorite champions'
              : selected === 'All'
              ? 'champions'
              : `${selected}s`}
          </Typography>

          <Grid
            container
            spacing={2}
            padding={{ md: 3, xs: 0.5 }}
          >
            {filtered.map((ch) => (
              <Grid
                key={ch.key}
                size={{ xs: 6, sm: 4, md: 4, lg: 3 }}
              >
                <ChampionCard
                  champion={ch}
                  version={version}
                  isFavorite={isFavorite(ch.id)}
                  onToggleFavorite={() => toggleFavorite(ch.id)}
                />
              </Grid>
            ))}
          </Grid>
        </>
      )}
    </Box>
  );
}
