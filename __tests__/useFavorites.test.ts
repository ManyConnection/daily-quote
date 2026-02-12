import { renderHook, act, waitFor } from '@testing-library/react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFavorites } from '../hooks/useFavorites';

describe('useFavorites', () => {
  beforeEach(async () => {
    await AsyncStorage.clear();
    jest.clearAllMocks();
  });

  describe('initial state', () => {
    it('should start with empty favorites', async () => {
      const { result } = renderHook(() => useFavorites());

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      expect(result.current.favorites).toEqual([]);
      expect(result.current.error).toBeNull();
    });

    it('should load existing favorites from AsyncStorage', async () => {
      await AsyncStorage.setItem('@daily_quote_favorites', JSON.stringify([1, 2, 3]));

      const { result } = renderHook(() => useFavorites());

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      expect(result.current.favorites).toEqual([1, 2, 3]);
    });
  });

  describe('addFavorite', () => {
    it('should add a quote to favorites', async () => {
      const { result } = renderHook(() => useFavorites());

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      await act(async () => {
        await result.current.addFavorite(5);
      });

      expect(result.current.favorites).toContain(5);
    });

    it('should persist favorite to AsyncStorage', async () => {
      const { result } = renderHook(() => useFavorites());

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      await act(async () => {
        await result.current.addFavorite(10);
      });

      const stored = await AsyncStorage.getItem('@daily_quote_favorites');
      expect(JSON.parse(stored!)).toContain(10);
    });

    it('should not add duplicate favorites', async () => {
      const { result } = renderHook(() => useFavorites());

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      await act(async () => {
        await result.current.addFavorite(5);
        await result.current.addFavorite(5);
      });

      const fiveCount = result.current.favorites.filter((id) => id === 5).length;
      expect(fiveCount).toBe(1);
    });
  });

  describe('removeFavorite', () => {
    it('should remove a quote from favorites', async () => {
      await AsyncStorage.setItem('@daily_quote_favorites', JSON.stringify([1, 2, 3]));

      const { result } = renderHook(() => useFavorites());

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      await act(async () => {
        await result.current.removeFavorite(2);
      });

      expect(result.current.favorites).not.toContain(2);
      expect(result.current.favorites).toEqual([1, 3]);
    });

    it('should update AsyncStorage when removing', async () => {
      await AsyncStorage.setItem('@daily_quote_favorites', JSON.stringify([1, 2, 3]));

      const { result } = renderHook(() => useFavorites());

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      await act(async () => {
        await result.current.removeFavorite(2);
      });

      const stored = await AsyncStorage.getItem('@daily_quote_favorites');
      expect(JSON.parse(stored!)).toEqual([1, 3]);
    });
  });

  describe('isFavorite', () => {
    it('should return true for favorited quotes', async () => {
      await AsyncStorage.setItem('@daily_quote_favorites', JSON.stringify([1, 2, 3]));

      const { result } = renderHook(() => useFavorites());

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      expect(result.current.isFavorite(2)).toBe(true);
    });

    it('should return false for non-favorited quotes', async () => {
      await AsyncStorage.setItem('@daily_quote_favorites', JSON.stringify([1, 2, 3]));

      const { result } = renderHook(() => useFavorites());

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      expect(result.current.isFavorite(99)).toBe(false);
    });
  });

  describe('toggleFavorite', () => {
    it('should add quote when not favorited', async () => {
      const { result } = renderHook(() => useFavorites());

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      await act(async () => {
        await result.current.toggleFavorite(5);
      });

      expect(result.current.favorites).toContain(5);
    });

    it('should remove quote when already favorited', async () => {
      await AsyncStorage.setItem('@daily_quote_favorites', JSON.stringify([5]));

      const { result } = renderHook(() => useFavorites());

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      await act(async () => {
        await result.current.toggleFavorite(5);
      });

      expect(result.current.favorites).not.toContain(5);
    });
  });

  describe('clearFavorites', () => {
    it('should remove all favorites', async () => {
      await AsyncStorage.setItem('@daily_quote_favorites', JSON.stringify([1, 2, 3]));

      const { result } = renderHook(() => useFavorites());

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      await act(async () => {
        await result.current.clearFavorites();
      });

      expect(result.current.favorites).toEqual([]);
    });

    it('should clear AsyncStorage', async () => {
      await AsyncStorage.setItem('@daily_quote_favorites', JSON.stringify([1, 2, 3]));

      const { result } = renderHook(() => useFavorites());

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      await act(async () => {
        await result.current.clearFavorites();
      });

      const stored = await AsyncStorage.getItem('@daily_quote_favorites');
      expect(stored).toBeNull();
    });
  });

  describe('error handling', () => {
    it('should handle malformed JSON in storage gracefully', async () => {
      await AsyncStorage.setItem('@daily_quote_favorites', 'not-valid-json');

      const { result } = renderHook(() => useFavorites());

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      expect(result.current.error).toBe('お気に入りの読み込みに失敗しました');
    });

    it('should handle non-array data in storage', async () => {
      await AsyncStorage.setItem('@daily_quote_favorites', JSON.stringify({ not: 'array' }));

      const { result } = renderHook(() => useFavorites());

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      expect(result.current.favorites).toEqual([]);
    });
  });
});
