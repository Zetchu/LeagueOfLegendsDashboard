import { useEffect, useState } from 'react';
import type { FavoriteChampionId } from './types';

const STORAGE_KEY = 'lol:favorites:champions:v1';

function readIds(): FavoriteChampionId[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? (parsed as FavoriteChampionId[]) : [];
  } catch {
    return [];
  }
}

function writeIds(ids: FavoriteChampionId[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(ids));
}

export function useFavorites() {
  const [ids, setIds] = useState<FavoriteChampionId[]>(() => readIds());

  useEffect(() => {
    writeIds(ids);
  }, [ids]);

  const isFavorite = (id: FavoriteChampionId) => ids.includes(id);

  const toggleFavorite = (id: FavoriteChampionId) =>
    setIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );

  const clearFavorites = () => setIds([]);

  return { ids, isFavorite, toggleFavorite, clearFavorites };
}
