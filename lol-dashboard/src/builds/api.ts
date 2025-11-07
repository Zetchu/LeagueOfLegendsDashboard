import axios from 'axios';
import type { ItemDto } from './types';
import { getLatestVersion } from '../champions/api';

const CDN = 'https://ddragon.leagueoflegends.com';

export async function fetchItems(
  version?: string
): Promise<{ version: string; items: ItemDto[] }> {
  const v = version ?? (await getLatestVersion());
  const { data } = await axios.get(`${CDN}/cdn/${v}/data/en_US/item.json`);

  const items: ItemDto[] = Object.entries<any>(data.data)
    .map(([id, it]) => ({
      id,
      name: it.name,
      plaintext: it.plaintext,
      gold: it.gold,
      image: it.image,
      stats: it.stats,
      tags: it.tags,
    }))

    .filter((it) => it.gold?.purchasable !== false);

  return { version: v, items };
}

export function itemIcon(version: string, image?: { full: string }) {
  return image ? `${CDN}/cdn/${version}/img/item/${image.full}` : '';
}

export function aggregateStats(
  itemStats: Array<Record<string, number> | undefined>
) {
  const totals: Record<string, number> = {};
  for (const s of itemStats) {
    if (!s) continue;
    for (const [k, v] of Object.entries(s)) {
      if (typeof v !== 'number') continue;
      totals[k] = (totals[k] ?? 0) + v;
    }
  }
  return totals;
}

export function prettyStatKey(key: string): string {
  const map: Record<string, string> = {
    FlatHPPoolMod: 'HP',
    FlatMPPoolMod: 'Mana',
    FlatArmorMod: 'Armor',
    FlatSpellBlockMod: 'MR',
    FlatPhysicalDamageMod: 'AD',
    FlatMagicDamageMod: 'AP',
    PercentAttackSpeedMod: 'Attack Speed %',
    FlatCritChanceMod: 'Crit Chance',
    FlatHPRegenMod: 'HP Regen',
    FlatMPRegenMod: 'Mana Regen',
    FlatMovementSpeedMod: 'Move Speed',
    PercentMovementSpeedMod: 'Move Speed %',
    PercentLifeStealMod: 'Life Steal %',
    PercentSpellVampMod: 'Spell Vamp %',
    FlatArmorPenetrationMod: 'Lethality',
    PercentArmorPenetrationMod: 'Armor Pen %',
    PercentMagicPenetrationMod: 'Magic Pen %',
    FlatMagicPenetrationMod: 'Flat Magic Pen',
  };
  return map[key] ?? key;
}
