import {
  Card,
  CardActionArea,
  CardContent,
  CardMedia,
  Chip,
  Stack,
  Typography,
  Box,
  IconButton,
  Tooltip,
} from '@mui/material';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import FavoriteIcon from '@mui/icons-material/Favorite';
import type { ChampionSummary } from '../types';

type Props = {
  champion: ChampionSummary;
  version: string;
  onClick?: () => void;
  isFavorite?: boolean;
  onToggleFavorite?: () => void;
};

export function ChampionCard({
  champion,
  version,
  onClick,
  isFavorite,
  onToggleFavorite,
}: Props) {
  const img = `https://ddragon.leagueoflegends.com/cdn/${version}/img/champion/${champion.image.full}`;

  return (
    <Card
      data-testid={`champ-card-${champion.id}`}
      variant='outlined'
      sx={{
        position: 'relative',
        height: '100%',
        transition: 'transform .12s ease, box-shadow .12s ease',
        '&:hover': { transform: 'translateY(-2px)', boxShadow: 6 },
      }}
    >
      <CardActionArea
        onClick={onClick}
        sx={{ height: '100%' }}
      >
        <Box sx={{ position: 'relative' }}>
          <CardMedia
            component='img'
            height='200'
            image={img}
            alt={champion.name}
            loading='lazy'
          />

          <Chip
            label={
              champion.info.difficulty >= 7
                ? 'Hard'
                : champion.info.difficulty >= 4
                ? 'Med'
                : 'Easy'
            }
            size='small'
            sx={{
              position: 'absolute',
              top: 8,
              right: 8,
              bgcolor: 'rgba(0,0,0,.6)',
              color: 'white',
              border: '1px solid rgba(255,255,255,.2)',
            }}
          />
        </Box>

        <CardContent>
          <Typography
            variant='subtitle1'
            fontWeight={700}
            lineHeight={1.2}
          >
            {champion.name}
          </Typography>
          <Typography
            variant='body2'
            color='text.secondary'
            noWrap
          >
            {champion.title}
          </Typography>

          <Stack
            direction='row'
            spacing={1}
            sx={{ mt: 1, flexWrap: 'wrap' }}
          >
            {champion.tags.map((t) => (
              <Chip
                key={t}
                size='small'
                label={t}
              />
            ))}
          </Stack>
        </CardContent>
      </CardActionArea>

      {onToggleFavorite && (
        <Tooltip title={isFavorite ? 'Remove favorite' : 'Add to favorites'}>
          <IconButton
            size='small'
            onClick={(e) => {
              e.stopPropagation();
              onToggleFavorite();
            }}
            sx={{
              position: 'absolute',
              top: 8,
              left: 8,
              bgcolor: 'rgba(0,0,0,.5)',
              border: '1px solid rgba(255,255,255,.2)',
              '&:hover': { bgcolor: 'rgba(0,0,0,.65)' },
            }}
          >
            {isFavorite ? (
              <FavoriteIcon color='secondary' />
            ) : (
              <FavoriteBorderIcon />
            )}
          </IconButton>
        </Tooltip>
      )}
    </Card>
  );
}
