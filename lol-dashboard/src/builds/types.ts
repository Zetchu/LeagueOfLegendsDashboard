export interface ItemDto {
  id: string;
  name: string;
  plaintext?: string;
  gold: { total?: number; base?: number; purchasable?: boolean };
  image?: { full: string };
  stats?: Record<string, number>;
  tags?: string[];
}

export interface Build {
  id: string;
  version: string;
  championId: string;
  itemIds: string[];
  name: string;
  createdAt: number;
}

export type StatTotals = Record<string, number>;
