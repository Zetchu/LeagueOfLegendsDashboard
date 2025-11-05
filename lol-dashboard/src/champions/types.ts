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
