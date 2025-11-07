import { useEffect, useMemo, useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  IconButton,
  Box,
  Typography,
  Chip,
  Tabs,
  Tab,
  Stack,
  Grid,
  CircularProgress,
  Divider,
  Tooltip,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import type { ChampionDetail } from '../types';
import { getChampionDetail } from '../api';

type Props = {
  open: boolean;
  onClose: () => void;
  version: string;
  championId: string;
};

export function ChampionDialog({ open, onClose, version, championId }: Props) {
  const [data, setData] = useState<ChampionDetail | null>(null);
  const [loading, setLoading] = useState(false);
  const [tab, setTab] = useState(0);

  useEffect(() => {
    if (!open) return;
    let alive = true;
    setLoading(true);
    setData(null);
    getChampionDetail(version, championId)
      .then((d) => alive && setData(d))
      .finally(() => alive && setLoading(false));
    return () => {
      alive = false;
    };
  }, [open, version, championId]);

  const splash = useMemo(() => {
    const num = data?.skins?.[0]?.num ?? 0;
    return `https://ddragon.leagueoflegends.com/cdn/img/champion/splash/${championId}_${num}.jpg`;
  }, [data, championId]);

  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullWidth
      maxWidth='md'
      scroll='paper'
    >
      <DialogTitle sx={{ pr: 6 }}>
        <Typography
          variant='h5'
          fontWeight={800}
        >
          {data?.name ?? championId}
        </Typography>
        <Typography
          variant='body2'
          color='text.secondary'
        >
          {data?.title}
        </Typography>
        <IconButton
          aria-label='close'
          onClick={onClose}
          sx={{ position: 'absolute', right: 8, top: 8 }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent
        dividers
        sx={{ p: 0 }}
      >
        {loading ? (
          <Box sx={{ display: 'grid', placeItems: 'center', py: 6 }}>
            <CircularProgress />
          </Box>
        ) : data ? (
          <>
            {/* Splash */}
            <Box
              sx={{
                height: 240,
                backgroundImage: `url(${splash})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                position: 'relative',
              }}
            >
              <Box
                sx={{
                  position: 'absolute',
                  inset: 0,
                  background:
                    'linear-gradient(to bottom, rgba(0,0,0,0.4) 0%, rgba(0,0,0,0.7) 60%, rgba(0,0,0,0.9) 100%)',
                }}
              />
            </Box>

            <Box sx={{ px: 3 }}>
              <Tabs
                value={tab}
                onChange={(_, v) => setTab(v)}
                variant='scrollable'
                allowScrollButtonsMobile
              >
                <Tab label='Overview' />
                <Tab label='Abilities' />
                <Tab label='Stats' />
                <Tab label='Skins' />
              </Tabs>
              <Divider />
            </Box>

            <Box sx={{ p: 3 }}>
              {tab === 0 && (
                <Box>
                  <Stack
                    direction='row'
                    spacing={1}
                    sx={{ mb: 1 }}
                  >
                    {data.tags.map((t) => (
                      <Chip
                        key={t}
                        size='small'
                        label={t}
                      />
                    ))}
                    <Chip
                      size='small'
                      label={data.partype}
                      variant='outlined'
                    />
                  </Stack>
                  <Typography
                    variant='body1'
                    sx={{ whiteSpace: 'pre-wrap' }}
                  >
                    {data.lore}
                  </Typography>
                </Box>
              )}

              {tab === 1 && (
                <Grid
                  container
                  spacing={2}
                >
                  <Grid size={{ xs: 6, md: 4 }}>
                    <Stack
                      direction='row'
                      spacing={2}
                    >
                      <img
                        width={56}
                        height={56}
                        src={`https://ddragon.leagueoflegends.com/cdn/${version}/img/passive/${data.passive.image.full}`}
                        alt={data.passive.name}
                        style={{ borderRadius: 8 }}
                      />
                      <Box>
                        <Typography
                          variant='subtitle1'
                          fontWeight={700}
                        >
                          Passive — {data.passive.name}
                        </Typography>
                        <Typography
                          variant='body2'
                          color='text.secondary'
                        >
                          {stripHtml(data.passive.description)}
                        </Typography>
                      </Box>
                    </Stack>
                  </Grid>

                  {['Q', 'W', 'E', 'R'].map((key, i) => {
                    const s = data.spells[i];
                    if (!s) return null;
                    return (
                      <Grid
                        key={s.id}
                        size={{ xs: 12, md: 6 }}
                      >
                        <Stack
                          direction='row'
                          spacing={2}
                        >
                          <img
                            width={56}
                            height={56}
                            src={`https://ddragon.leagueoflegends.com/cdn/${version}/img/spell/${s.image.full}`}
                            alt={s.name}
                            style={{ borderRadius: 8 }}
                          />
                          <Box>
                            <Typography
                              variant='subtitle1'
                              fontWeight={700}
                            >
                              {key} — {s.name}
                            </Typography>
                            <Typography
                              variant='caption'
                              color='text.secondary'
                            >
                              CD: {s.cooldownBurn} • Cost: {s.costBurn}
                            </Typography>
                            <Typography
                              variant='body2'
                              color='text.secondary'
                            >
                              {stripHtml(s.description)}
                            </Typography>
                          </Box>
                        </Stack>
                      </Grid>
                    );
                  })}
                </Grid>
              )}

              {tab === 2 && (
                <Grid
                  container
                  spacing={2}
                >
                  {importantStats(data.stats).map(([k, v]) => (
                    <Grid
                      key={k}
                      size={{ xs: 6, md: 4 }}
                    >
                      <StatRow
                        label={prettyStat(k)}
                        value={v}
                      />
                    </Grid>
                  ))}
                </Grid>
              )}

              {tab === 3 && (
                <Grid
                  container
                  spacing={1}
                >
                  {data.skins.map((sk) => (
                    <Grid
                      key={sk.id}
                      size={{ xs: 6, md: 4 }}
                    >
                      <Tooltip
                        title={sk.name === 'default' ? data.name : sk.name}
                      >
                        <Box
                          sx={{
                            height: 160,
                            backgroundImage: `url(https://ddragon.leagueoflegends.com/cdn/img/champion/splash/${data.id}_${sk.num}.jpg)`,
                            backgroundSize: 'cover',
                            backgroundPosition: 'center',
                            borderRadius: 2,
                          }}
                        />
                      </Tooltip>
                    </Grid>
                  ))}
                </Grid>
              )}
            </Box>
          </>
        ) : (
          <Box sx={{ p: 3 }}>No data.</Box>
        )}
      </DialogContent>
    </Dialog>
  );
}

function StatRow({ label, value }: { label: string; value: number }) {
  return (
    <Stack
      direction='row'
      justifyContent='space-between'
      sx={{ p: 1.25, bgcolor: 'rgba(255,255,255,.04)', borderRadius: 1 }}
    >
      <Typography variant='body2'>{label}</Typography>
      <Typography
        variant='body2'
        fontWeight={700}
      >
        {value}
      </Typography>
    </Stack>
  );
}

function prettyStat(key: string) {
  const map: Record<string, string> = {
    hp: 'HP',
    hpperlevel: 'HP/level',
    mp: 'Resource',
    mpperlevel: 'Resource/level',
    movespeed: 'Move Speed',
    armor: 'Armor',
    armorperlevel: 'Armor/level',
    spellblock: 'MR',
    spellblockperlevel: 'MR/level',
    attackrange: 'Range',
    hpregen: 'HP Regen',
    hpregenperlevel: 'HP Regen/level',
    mpregen: 'Res Regen',
    mpregenperlevel: 'Res Regen/level',
    crit: 'Crit',
    critperlevel: 'Crit/level',
    attackdamage: 'AD',
    attackdamageperlevel: 'AD/level',
    attackspeed: 'AS Base',
    attackspeedperlevel: 'AS/level',
  };
  return map[key] ?? key;
}
function importantStats(all: Record<string, number>) {
  const keys = [
    'hp',
    'hpperlevel',
    'attackdamage',
    'attackdamageperlevel',
    'armor',
    'armorperlevel',
    'spellblock',
    'spellblockperlevel',
    'movespeed',
    'attackrange',
    'attackspeed',
    'attackspeedperlevel',
  ];
  return keys.filter((k) => k in all).map((k) => [k, all[k]] as const);
}

function stripHtml(html: string) {
  const tmp = document.createElement('div');
  tmp.innerHTML = html;
  return tmp.textContent || tmp.innerText || '';
}
