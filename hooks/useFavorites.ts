import { useState, useEffect, useCallback } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Quote } from '@/data/quotes';

const FAVORITES_KEY = '@daily_quote_favorites';

export interface UseFavoritesResult {
  favorites: number[];
  isLoading: boolean;
  error: string | null;
  addFavorite: (quoteId: number) => Promise<void>;
  removeFavorite: (quoteId: number) => Promise<void>;
  isFavorite: (quoteId: number) => boolean;
  toggleFavorite: (quoteId: number) => Promise<void>;
  clearFavorites: () => Promise<void>;
}

export const useFavorites = (): UseFavoritesResult => {
  const [favorites, setFavorites] = useState<number[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadFavorites = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const stored = await AsyncStorage.getItem(FAVORITES_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed)) {
          setFavorites(parsed);
        }
      }
    } catch (e) {
      setError('お気に入りの読み込みに失敗しました');
      console.error('Failed to load favorites:', e);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadFavorites();
  }, [loadFavorites]);

  const saveFavorites = async (newFavorites: number[]) => {
    try {
      await AsyncStorage.setItem(FAVORITES_KEY, JSON.stringify(newFavorites));
      setFavorites(newFavorites);
      setError(null);
    } catch (e) {
      setError('お気に入りの保存に失敗しました');
      console.error('Failed to save favorites:', e);
      throw e;
    }
  };

  const addFavorite = useCallback(async (quoteId: number) => {
    if (!favorites.includes(quoteId)) {
      await saveFavorites([...favorites, quoteId]);
    }
  }, [favorites]);

  const removeFavorite = useCallback(async (quoteId: number) => {
    await saveFavorites(favorites.filter((id) => id !== quoteId));
  }, [favorites]);

  const isFavorite = useCallback((quoteId: number): boolean => {
    return favorites.includes(quoteId);
  }, [favorites]);

  const toggleFavorite = useCallback(async (quoteId: number) => {
    if (isFavorite(quoteId)) {
      await removeFavorite(quoteId);
    } else {
      await addFavorite(quoteId);
    }
  }, [isFavorite, removeFavorite, addFavorite]);

  const clearFavorites = useCallback(async () => {
    try {
      await AsyncStorage.removeItem(FAVORITES_KEY);
      setFavorites([]);
      setError(null);
    } catch (e) {
      setError('お気に入りの削除に失敗しました');
      console.error('Failed to clear favorites:', e);
      throw e;
    }
  }, []);

  return {
    favorites,
    isLoading,
    error,
    addFavorite,
    removeFavorite,
    isFavorite,
    toggleFavorite,
    clearFavorites,
  };
};
