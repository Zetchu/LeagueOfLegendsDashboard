export type ChampionTag =
  | 'Assassin'
  | 'Fighter'
  | 'Mage'
  | 'Marksman'
  | 'Support'
  | 'Tank';

export interface ChampionSummary {
  id: string;
  key: string;
  name: string;
  title: string;
  tags: ChampionTag[];
  image: { full: string };
  info: { attack: number; defense: number; magic: number; difficulty: number };
}

export interface ChampionDetail {
  id: string;
  key: string;
  name: string;
  title: string;
  lore: string;
  blurb: string;
  tags: ChampionTag[];
  partype: string;
  stats: Record<string, number>;
  passive: {
    name: string;
    description: string;
    image: { full: string };
  };
  spells: Array<{
    id: string;
    name: string;
    description: string;
    tooltip: string;
    cooldownBurn: string;
    costBurn: string;
    image: { full: string };
  }>;
  skins: Array<{ id: string; num: number; name: string; chromas: boolean }>;
}
