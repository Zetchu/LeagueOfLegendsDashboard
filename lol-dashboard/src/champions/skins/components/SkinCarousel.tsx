import { Box, Tooltip } from '@mui/material';
import type { ChampionSkin } from '../types';
import { skinSplashUrl, displaySkinName } from '../api';

export function SkinCarousel({
  championId,
  championName,
  skins,
}: {
  championId: string;
  championName: string;
  skins: ChampionSkin[];
}) {
  if (!skins?.length) return null;

  return (
    <Box
      sx={{
        display: 'grid',
        gap: 1,
        gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' },
      }}
    >
      {skins.map((sk) => (
        <Tooltip
          key={sk.id}
          title={displaySkinName(championName, sk.name)}
        >
          <Box
            sx={{
              height: 160,
              backgroundImage: `url(${skinSplashUrl(championId, sk.num)})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              borderRadius: 2,
            }}
          />
        </Tooltip>
      ))}
    </Box>
  );
}
