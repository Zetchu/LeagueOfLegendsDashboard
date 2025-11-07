import { useEffect, useMemo, useState } from 'react';
import type { Build } from './types';
import { fetchItems } from './api';
import type { ItemDto } from './types';
import { getLatestVersion, getChampions } from '../champions/api';
import type { ChampionSummary } from '../champions/types';

const STORAGE_KEY = 'lol:builds:v1';

export function useItemsData() {
  const [version, setVersion] = useState<string>('');
  const [items, setItems] = useState<ItemDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<unknown>(null);

  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        const v = await getLatestVersion();
        const { items } = await fetchItems(v);
        if (!alive) return;
        setVersion(v);
        setItems(items);
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

  return { version, items, loading, error };
}

export function useChampionList() {
  const [version, setVersion] = useState<string>('');
  const [list, setList] = useState<ChampionSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<unknown>(null);

  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        const v = await getLatestVersion();
        const champs = await getChampions(v);
        if (!alive) return;
        setVersion(v);
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

function readBuilds(): Build[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as Build[]) : [];
  } catch {
    return [];
  }
}
function writeBuilds(list: Build[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
}

export function useBuilds() {
  const [builds, setBuilds] = useState<Build[]>(() => readBuilds());

  const save = (b: Build) => {
    setBuilds((prev) => {
      const next = [b, ...prev];
      writeBuilds(next);
      return next;
    });
  };
  const remove = (id: string) => {
    setBuilds((prev) => {
      const next = prev.filter((x) => x.id !== id);
      writeBuilds(next);
      return next;
    });
  };

  return { builds, save, remove };
}

export function useSelectedItems(items: ItemDto[], selectedIds: string[]) {
  return useMemo(
    () =>
      selectedIds
        .map((id) => items.find((i) => i.id === id))
        .filter(Boolean) as ItemDto[],
    [items, selectedIds]
  );
}
