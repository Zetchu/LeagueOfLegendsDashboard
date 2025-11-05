import { useEffect, useState } from 'react';
import { getChampions, getLatestVersion } from './api';
import type { ChampionSummary } from './types';

export function useChampionBootstrap() {
  const [version, setVersion] = useState<string | null>(null);
  const [list, setList] = useState<ChampionSummary[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<unknown>(null);

  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        const v = await getLatestVersion();
        if (!alive) return;
        setVersion(v);

        const champs = await getChampions(v);
        if (!alive) return;
        setList(champs);
      } catch (e) {
        if (alive) setError(e);
      } finally {
        if (alive) setLoading(false);
      }
    })();
    return () => {
      alive = false;
    };
  }, []);

  return { version, list, loading, error };
}
