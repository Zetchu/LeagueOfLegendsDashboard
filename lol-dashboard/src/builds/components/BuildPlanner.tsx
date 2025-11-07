import { useMemo, useState } from 'react';
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  Stack,
  Autocomplete,
  TextField,
  Chip,
  Avatar,
  Button,
  Divider,
  IconButton,
  Tooltip,
  Alert,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';

import SaveIcon from '@mui/icons-material/Save';
import { nanoid } from 'nanoid';
import {
  useChampionList,
  useItemsData,
  useBuilds,
  useSelectedItems,
} from '../hooks';
import { itemIcon, aggregateStats, prettyStatKey } from '../api';
import type { ItemDto } from '../types';

export default function BuildPlanner() {
  const champs = useChampionList();
  const itemsQ = useItemsData();
  const { builds, save, remove } = useBuilds();

  const [championId, setChampionId] = useState<string | null>(null);
  const [championName, setChampionName] = useState<string>('');
  const [selected, setSelected] = useState<string[]>([]);
  const [buildName, setBuildName] = useState<string>('');

  const selectedItems = useSelectedItems(itemsQ.items, selected);
  const totalGold = useMemo(
    () => selectedItems.reduce((sum, it) => sum + (it.gold?.total ?? 0), 0),
    [selectedItems]
  );
  const totals = useMemo(
    () => aggregateStats(selectedItems.map((i) => i.stats)),
    [selectedItems]
  );

  const canSave =
    championId && selected.length > 0 && buildName.trim().length > 0;

  if (champs.loading || itemsQ.loading) {
    return <Alert severity='info'>Loading champions & items…</Alert>;
  }
  if (champs.error || itemsQ.error) {
    return <Alert severity='error'>Failed to load data.</Alert>;
  }

  return (
    <Box>
      <Typography
        variant='h5'
        sx={{ mb: 2 }}
      >
        Build Planner
      </Typography>

      <Grid
        container
        spacing={2}
      >
        <Grid size={{ xs: 12 }}>
          <Card variant='outlined'>
            <CardContent>
              <Typography
                variant='subtitle1'
                fontWeight={700}
                gutterBottom
              >
                1) Choose Champion
              </Typography>
              <Autocomplete
                options={champs.list}
                getOptionLabel={(o) => o.name}
                onChange={(_, v) => {
                  setChampionId(v?.id ?? null);
                  setChampionName(v?.name ?? '');
                }}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label='Champion'
                    size='small'
                  />
                )}
              />
              {championId && (
                <Box sx={{ mt: 1, color: 'text.secondary' }}>
                  Selected: <strong>{championName}</strong>
                </Box>
              )}
            </CardContent>
          </Card>
        </Grid>

        <Grid size={{ xs: 12, md: 8 }}>
          <Card variant='outlined'>
            <CardContent>
              <Typography
                variant='subtitle1'
                fontWeight={700}
                gutterBottom
              >
                2) Pick Items (max 6)
              </Typography>

              <ItemPicker
                version={itemsQ.version}
                items={itemsQ.items}
                selectedIds={selected}
                onAdd={(id) =>
                  setSelected((prev) =>
                    prev.length < 6 && !prev.includes(id) ? [...prev, id] : prev
                  )
                }
              />

              <Stack
                direction='row'
                spacing={1}
                sx={{ mt: 2 }}
                flexWrap='wrap'
              >
                {selectedItems.map((it) => (
                  <Chip
                    key={it.id}
                    avatar={
                      <Avatar
                        src={itemIcon(itemsQ.version, it.image)}
                        alt={it.name}
                      />
                    }
                    label={it.name}
                    onDelete={() =>
                      setSelected((prev) => prev.filter((x) => x !== it.id))
                    }
                  />
                ))}
              </Stack>
            </CardContent>
          </Card>
        </Grid>

        <Grid size={{ xs: 12, md: 4 }}>
          <Card variant='outlined'>
            <CardContent>
              <Typography
                variant='subtitle1'
                fontWeight={700}
                gutterBottom
              >
                3) Totals
              </Typography>
              <Typography
                variant='body2'
                sx={{ mb: 1 }}
              >
                Gold: <strong>{totalGold}</strong>
              </Typography>
              <Divider sx={{ mb: 1 }} />
              <StatList totals={totals} />
            </CardContent>
          </Card>

          <Grid
            size={{ xs: 12 }}
            mt={2}
          >
            <Card variant='outlined'>
              <CardContent>
                <Typography
                  variant='subtitle1'
                  fontWeight={700}
                  gutterBottom
                >
                  4) Save Build
                </Typography>
                <Stack
                  direction={{ xs: 'column', sm: 'row' }}
                  spacing={2}
                >
                  <TextField
                    label='Build name'
                    size='small'
                    value={buildName}
                    onChange={(e) => setBuildName(e.target.value)}
                    sx={{ flex: 1 }}
                  />
                  <Button
                    variant='contained'
                    startIcon={<SaveIcon />}
                    disabled={!canSave}
                    onClick={() => {
                      if (!canSave) return;
                      const b = {
                        id: nanoid(),
                        version: itemsQ.version,
                        championId: championId!,
                        championName,
                        itemIds: selected,
                        name: buildName.trim(),
                        createdAt: Date.now(),
                      };
                      save(b);
                      setBuildName('');
                    }}
                  >
                    Save build
                  </Button>
                </Stack>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Grid>

      <Typography
        variant='h6'
        sx={{ mt: 3, mb: 1 }}
      >
        My Builds
      </Typography>

      <Grid
        container
        spacing={2}
      >
        {builds.map((b) => {
          const champIcon = (version: string, champId: string) =>
            `https://ddragon.leagueoflegends.com/cdn/${version}/img/champion/${champId}.png`;

          return (
            <Grid
              key={b.id}
              size={{ xs: 12, md: 6, lg: 4 }}
            >
              <Card variant='outlined'>
                <CardContent>
                  <Stack
                    direction='row'
                    alignItems='center'
                    justifyContent='space-between'
                    sx={{ mb: 1 }}
                  >
                    <Stack
                      direction='row'
                      alignItems='center'
                      spacing={1}
                    >
                      <Avatar
                        src={champIcon(b.version, b.championId)}
                        alt={b.championId}
                        sx={{ width: 28, height: 28 }}
                      />
                      <Typography
                        variant='subtitle1'
                        fontWeight={700}
                      >
                        {b.name}
                      </Typography>
                    </Stack>

                    <Tooltip title='Delete'>
                      <IconButton
                        size='small'
                        onClick={() => remove(b.id)}
                      >
                        <DeleteIcon fontSize='small' />
                      </IconButton>
                    </Tooltip>
                  </Stack>

                  <Typography
                    variant='body2'
                    color='text.secondary'
                    sx={{ mb: 1 }}
                  >
                    {b.championId} • Patch {b.version}
                  </Typography>

                  <Stack
                    direction='row'
                    spacing={1}
                    flexWrap='wrap'
                  >
                    {b.itemIds.map((id) => {
                      const it = itemsQ.items.find((i) => i.id === id);
                      if (!it) return null;
                      return (
                        <Chip
                          key={id}
                          avatar={
                            <Avatar
                              src={itemIcon(b.version, it.image)}
                              alt={it.name}
                            />
                          }
                          label={it.name}
                          size='small'
                        />
                      );
                    })}
                  </Stack>
                </CardContent>
              </Card>
            </Grid>
          );
        })}

        {builds.length === 0 && (
          <Grid size={{ xs: 12 }}>
            <Alert severity='info'>No saved builds yet.</Alert>
          </Grid>
        )}
      </Grid>
    </Box>
  );
}

function ItemPicker({
  version,
  items,
  selectedIds,
  onAdd,
}: {
  version: string;
  items: ItemDto[];
  selectedIds: string[];
  onAdd: (id: string) => void;
}) {
  const [query, setQuery] = useState('');
  const filtered = useMemo(() => {
    const q = query.toLowerCase().trim();
    if (!q) return items.slice(0, 15);
    return items.filter(
      (i) =>
        i.name.toLowerCase().includes(q) ||
        i.plaintext?.toLowerCase().includes(q)
    );
  }, [items, query]);

  return (
    <Box>
      <TextField
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder='Search items…'
        size='small'
        sx={{ mb: 1, width: '100%' }}
      />
      <Stack
        direction='row'
        spacing={1}
        flexWrap='wrap'
        useFlexGap
      >
        {filtered.slice(0, 60).map((it) => (
          <Chip
            key={it.id}
            avatar={
              <Avatar
                src={itemIcon(version, it.image)}
                alt={it.name}
              />
            }
            label={it.name}
            onClick={() => onAdd(it.id)}
            variant={selectedIds.includes(it.id) ? 'filled' : 'outlined'}
            sx={{ mr: 1, mb: 1 }}
          />
        ))}
      </Stack>
    </Box>
  );
}

function StatList({ totals }: { totals: Record<string, number> }) {
  const entries = Object.entries(totals)
    .filter(([_, v]) => Math.abs(v) > 0.0001)
    .sort(([a], [b]) => a.localeCompare(b));

  if (entries.length === 0) {
    return (
      <Typography
        variant='body2'
        color='text.secondary'
      >
        No stats to show.
      </Typography>
    );
  }

  return (
    <Stack spacing={1}>
      {entries.map(([k, v]) => (
        <Stack
          key={k}
          direction='row'
          justifyContent='space-between'
        >
          <Typography variant='body2'>{prettyStatKey(k)}</Typography>
          <Typography
            variant='body2'
            fontWeight={700}
          >
            {formatStatValue(k, v)}
          </Typography>
        </Stack>
      ))}
    </Stack>
  );
}

function formatStatValue(key: string, v: number) {
  if (key.toLowerCase().includes('percent')) return `${Math.round(v * 100)}%`;

  if (key.startsWith('Percent')) return `${Math.round(v * 100)}%`;
  return Number.isInteger(v) ? v : Math.round(v * 100) / 100;
}
