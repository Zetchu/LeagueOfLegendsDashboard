import { http } from '../shared/http';
import type { ChampionSummary, ChampionDetail } from './types';

const CDN = 'https://ddragon.leagueoflegends.com';

export async function getLatestVersion(): Promise<string> {
  const { data } = await http.get<string[]>('/api/versions.json');
  return data[0];
}

export async function getChampions(
  version: string
): Promise<ChampionSummary[]> {
  const { data } = await http.get(
    `${CDN}/cdn/${version}/data/en_US/champion.json`
  );
  return Object.values<ChampionSummary>(data.data);
}

export async function getChampionDetail(
  version: string,
  champId: string
): Promise<ChampionDetail> {
  const { data } = await http.get(
    `${CDN}/cdn/${version}/data/en_US/champion/${champId}.json`
  );
  return Object.values<ChampionDetail>(data.data)[0];
}
