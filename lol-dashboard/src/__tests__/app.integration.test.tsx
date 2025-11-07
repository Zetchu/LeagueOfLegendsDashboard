import { describe, it, expect, vi } from 'vitest';
import { render, screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ThemeProvider, CssBaseline } from '@mui/material';
import { MemoryRouter } from 'react-router-dom';
import App from '../App';
import { theme } from '../app/theme';

vi.mock('../champions/api', async () => {
  return {
    getLatestVersion: vi.fn().mockResolvedValue('15.22.1'),
    getChampions: vi.fn().mockResolvedValue([
      {
        id: 'Ahri',
        key: '103',
        name: 'Ahri',
        title: 'the Nine-Tailed Fox',
        tags: ['Mage'],
        image: { full: 'Ahri.png' },
        info: { attack: 3, defense: 4, magic: 8, difficulty: 5 },
      },
      {
        id: 'Darius',
        key: '122',
        name: 'Darius',
        title: 'the Hand of Noxus',
        tags: ['Fighter'],
        image: { full: 'Darius.png' },
        info: { attack: 9, defense: 5, magic: 1, difficulty: 2 },
      },
    ]),
    getChampionDetail: vi.fn().mockResolvedValue({
      id: 'Ahri',
      key: '103',
      name: 'Ahri',
      title: 'the Nine-Tailed Fox',
      lore: 'A vastaya with a fox-like appearance...',
      blurb: '',
      tags: ['Mage'],
      partype: 'Mana',
      stats: {
        hp: 590,
        hpperlevel: 92,
        attackdamage: 53,
        armor: 20,
        movespeed: 330,
        attackrange: 550,
        attackspeed: 0.668,
      },
      passive: {
        name: 'Essence Theft',
        description: '<i>Heals</i> on spell hits.',
        image: { full: 'Ahri_P.png' },
      },
      spells: [
        {
          id: 'AhriQ',
          name: 'Orb of Deception',
          description: 'Throws an orb...',
          tooltip: '',
          cooldownBurn: '7',
          costBurn: '65',
          image: { full: 'AhriQ.png' },
        },
        {
          id: 'AhriW',
          name: 'Fox-Fire',
          description: 'Releases flames...',
          tooltip: '',
          cooldownBurn: '9',
          costBurn: '30',
          image: { full: 'AhriW.png' },
        },
        {
          id: 'AhriE',
          name: 'Charm',
          description: 'Charms enemies...',
          tooltip: '',
          cooldownBurn: '12',
          costBurn: '60',
          image: { full: 'AhriE.png' },
        },
        {
          id: 'AhriR',
          name: 'Spirit Rush',
          description: 'Dashes forward...',
          tooltip: '',
          cooldownBurn: '130',
          costBurn: '100',
          image: { full: 'AhriR.png' },
        },
      ],
      skins: [
        { id: '103000', num: 0, name: 'default', chromas: false },
        { id: '103001', num: 1, name: 'Dynasty Ahri', chromas: false },
      ],
    }),
  };
});

vi.mock('../builds/api', async (importOriginal) => {
  const actual = await importOriginal<any>();
  return {
    ...actual,
    fetchItems: vi.fn().mockResolvedValue({
      version: '15.22.1',
      items: [
        {
          id: '1001',
          name: 'Boots',
          plaintext: 'Slightly increases Movement Speed',
          gold: { total: 300, base: 300, purchasable: true },
          image: { full: '1001.png' },
          stats: { FlatMovementSpeedMod: 25 },
        },
        {
          id: '1056',
          name: "Doran's Ring",
          plaintext: 'Health, Ability Power and Mana restore',
          gold: { total: 400, base: 400, purchasable: true },
          image: { full: '1056.png' },
          stats: { FlatHPPoolMod: 70, FlatMagicDamageMod: 18 },
        },
      ],
    }),
  };
});

function renderApp(path: string = '/') {
  return render(
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <MemoryRouter initialEntries={[path]}>
        <App />
      </MemoryRouter>
    </ThemeProvider>
  );
}

describe('App integration', () => {
  it('browses champions, opens dialog, toggles favorite, and saves a build', async () => {
    const user = userEvent.setup();

    renderApp('/');

    await screen.findByText(/Choose a class to get started/i);

    await user.click(screen.getByRole('button', { name: /Mage/i }));
    await screen.findByText(/Patch 15\.22\.1/i);
    expect(screen.getByText('Ahri')).toBeInTheDocument();

    await user.type(screen.getByPlaceholderText(/Search champions/i), 'Darius');
    await waitFor(() => {
      expect(screen.queryByText('Ahri')).not.toBeInTheDocument();
    });

    await user.clear(screen.getByPlaceholderText(/Search champions/i));
    await user.click(screen.getByRole('button', { name: /^All$/i }));
    await screen.findByText('Ahri');
    await user.click(screen.getByText('Ahri'));

    await screen.findByRole('dialog');
    expect(screen.getByRole('tab', { name: /Overview/i })).toBeInTheDocument();
    expect(screen.getByRole('tab', { name: /Abilities/i })).toBeInTheDocument();
    expect(screen.getByText(/A vastaya/i)).toBeInTheDocument();

    await user.click(screen.getByRole('tab', { name: /Skins/i }));

    await user.click(screen.getByRole('button', { name: /close/i }));
  });
});
