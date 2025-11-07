import * as React from 'react';
import {
  AppBar,
  Box,
  Toolbar,
  IconButton,
  Typography,
  Button,
  Stack,
  Drawer,
  List,
  ListItemButton,
  ListItemText,
  Divider,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import { NavLink, useNavigate } from 'react-router-dom';

const NAV_LINKS = [
  { to: '/', label: 'Champions' },
  { to: '/builds', label: 'Build Planner' },
];

function ActiveLinkButton({
  to,
  label,
  onClick,
}: {
  to: string;
  label: string;
  onClick?: () => void;
}) {
  return (
    <Button
      component={NavLink}
      to={to}
      onClick={onClick}
      color='inherit'
      sx={{
        px: 1.5,
        '&.active': {
          fontWeight: 700,
          color: 'primary.main',
          '&::after': {
            content: '""',
            display: 'block',
            height: 2,
            bgcolor: 'primary.main',
            borderRadius: 1,
            mt: 0.5,
          },
        },
      }}
      endIcon={null}
    >
      {label}
    </Button>
  );
}

export default function NavBar() {
  const [open, setOpen] = React.useState(false);
  const theme = useTheme();
  const isMdUp = useMediaQuery(theme.breakpoints.up('md'));
  const navigate = useNavigate();

  const toggle = (val: boolean) => () => setOpen(val);

  return (
    <>
      <AppBar
        position='sticky'
        color='transparent'
        elevation={0}
      >
        <Toolbar sx={{ gap: 2 }}>
          {!isMdUp && (
            <IconButton
              edge='start'
              color='inherit'
              onClick={toggle(true)}
              aria-label='menu'
            >
              <MenuIcon />
            </IconButton>
          )}

          <Typography
            variant='h6'
            sx={{ fontWeight: 800, letterSpacing: '.03em', cursor: 'pointer' }}
            onClick={() => navigate('/')}
          >
            LoL Dashboard
          </Typography>

          {isMdUp && (
            <Stack
              direction='row'
              spacing={0.5}
              sx={{ ml: 2 }}
            >
              {NAV_LINKS.map((l) => (
                <ActiveLinkButton
                  key={l.to}
                  to={l.to}
                  label={l.label}
                />
              ))}
            </Stack>
          )}
        </Toolbar>
        <Divider sx={{ opacity: 0.2 }} />
      </AppBar>

      <Drawer
        anchor='left'
        open={open}
        onClose={toggle(false)}
      >
        <Box
          sx={{
            width: 260,
            bgcolor: 'background.default',
            height: '100%',
          }}
          role='presentation'
          onClick={toggle(false)}
          onKeyDown={toggle(false)}
        >
          <Typography
            variant='h6'
            sx={{ px: 2, py: 2, fontWeight: 800 }}
          >
            LoL Dashboard
          </Typography>
          <Divider />
          <List>
            {NAV_LINKS.map((l) => (
              <ListItemButton
                key={l.to}
                component={NavLink}
                to={l.to}
                sx={{
                  '&.active .MuiListItemText-primary': {
                    color: 'primary.main',
                    fontWeight: 700,
                  },
                }}
              >
                <ListItemText primary={l.label} />
              </ListItemButton>
            ))}
          </List>
        </Box>
      </Drawer>
    </>
  );
}
