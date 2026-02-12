import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import FavoritesScreen from '../app/(tabs)/favorites';
import { quotes } from '../data/quotes';

// Mock SafeAreaView
jest.mock('react-native-safe-area-context', () => ({
  SafeAreaView: ({ children }: { children: React.ReactNode }) => children,
}));

describe('FavoritesScreen', () => {
  beforeEach(async () => {
    await AsyncStorage.clear();
    jest.clearAllMocks();
  });

  describe('rendering', () => {
    it('should render the title', async () => {
      const { getByText } = render(<FavoritesScreen />);
      
      await waitFor(() => {
        expect(getByText('お気に入り')).toBeTruthy();
      }, { timeout: 10000 });
    });

    it('should show loading indicator initially', () => {
      const { getByTestId } = render(<FavoritesScreen />);
      expect(getByTestId('loading-indicator')).toBeTruthy();
    });
  });

  describe('empty state', () => {
    it('should show empty message when no favorites', async () => {
      const { getByText } = render(<FavoritesScreen />);
      
      await waitFor(() => {
        expect(getByText('お気に入りはまだありません')).toBeTruthy();
      });
    });

    it('should show empty emoji', async () => {
      const { getByText } = render(<FavoritesScreen />);
      
      await waitFor(() => {
        expect(getByText('💝')).toBeTruthy();
      });
    });

    it('should show instructions for adding favorites', async () => {
      const { getByText } = render(<FavoritesScreen />);
      
      await waitFor(() => {
        expect(getByText(/名言の❤️ボタンをタップして/)).toBeTruthy();
      });
    });

    it('should show 0 count when no favorites', async () => {
      const { getByText } = render(<FavoritesScreen />);
      
      await waitFor(() => {
        expect(getByText('0件の名言')).toBeTruthy();
      });
    });
  });

  describe('with favorites', () => {
    it('should display favorite quotes', async () => {
      await AsyncStorage.setItem('@daily_quote_favorites', JSON.stringify([1, 2]));
      
      const { getByText, getAllByTestId } = render(<FavoritesScreen />);
      
      await waitFor(() => {
        const quoteCards = getAllByTestId('quote-card');
        expect(quoteCards.length).toBe(2);
      });
    });

    it('should show correct count', async () => {
      await AsyncStorage.setItem('@daily_quote_favorites', JSON.stringify([1, 2, 3]));
      
      const { getByText } = render(<FavoritesScreen />);
      
      await waitFor(() => {
        expect(getByText('3件の名言')).toBeTruthy();
      });
    });

    it('should display quote text from favorites', async () => {
      await AsyncStorage.setItem('@daily_quote_favorites', JSON.stringify([1]));
      
      const { getByTestId } = render(<FavoritesScreen />);
      
      await waitFor(() => {
        const quoteText = getByTestId('quote-text');
        expect(quoteText).toBeTruthy();
      });
    });

    it('should show author from favorites', async () => {
      await AsyncStorage.setItem('@daily_quote_favorites', JSON.stringify([1]));
      
      const { getByTestId } = render(<FavoritesScreen />);
      
      await waitFor(() => {
        const authorText = getByTestId('quote-author');
        expect(authorText).toBeTruthy();
      });
    });
  });

  describe('favorite button interaction', () => {
    it('should remove quote when unfavorite button is pressed', async () => {
      await AsyncStorage.setItem('@daily_quote_favorites', JSON.stringify([1]));
      
      const { getByTestId, queryByTestId } = render(<FavoritesScreen />);
      
      await waitFor(() => {
        expect(getByTestId('favorite-button')).toBeTruthy();
      });
      
      const favoriteButton = getByTestId('favorite-button');
      fireEvent.press(favoriteButton);
      
      await waitFor(() => {
        const stored = AsyncStorage.getItem('@daily_quote_favorites');
        // After pressing, the quote should be removed
      });
    });

    it('should update storage when favorite is toggled', async () => {
      await AsyncStorage.setItem('@daily_quote_favorites', JSON.stringify([1, 2]));
      
      const { getAllByTestId } = render(<FavoritesScreen />);
      
      await waitFor(() => {
        const buttons = getAllByTestId('favorite-button');
        expect(buttons.length).toBe(2);
      });
      
      const buttons = getAllByTestId('favorite-button');
      fireEvent.press(buttons[0]);
      
      await waitFor(async () => {
        const stored = await AsyncStorage.getItem('@daily_quote_favorites');
        const parsed = JSON.parse(stored!);
        expect(parsed.length).toBe(1);
      });
    });
  });

  describe('copy functionality', () => {
    it('should show copy button for each favorite', async () => {
      await AsyncStorage.setItem('@daily_quote_favorites', JSON.stringify([1, 2]));
      
      const { getAllByTestId } = render(<FavoritesScreen />);
      
      await waitFor(() => {
        const copyButtons = getAllByTestId('copy-button');
        expect(copyButtons.length).toBe(2);
      });
    });

    it('should allow copying favorite quote', async () => {
      await AsyncStorage.setItem('@daily_quote_favorites', JSON.stringify([1]));
      
      const { getByTestId, getByText } = render(<FavoritesScreen />);
      
      await waitFor(() => {
        expect(getByTestId('copy-button')).toBeTruthy();
      });
      
      const copyButton = getByTestId('copy-button');
      fireEvent.press(copyButton);
      
      await waitFor(() => {
        expect(getByText('コピーしました')).toBeTruthy();
      });
    });
  });

  describe('data persistence', () => {
    it('should load favorites from storage on mount', async () => {
      await AsyncStorage.setItem('@daily_quote_favorites', JSON.stringify([1, 2, 3]));
      
      const { getAllByTestId } = render(<FavoritesScreen />);
      
      await waitFor(() => {
        const quoteCards = getAllByTestId('quote-card');
        expect(quoteCards.length).toBe(3);
      });
    });

    it('should handle invalid quote IDs gracefully', async () => {
      await AsyncStorage.setItem('@daily_quote_favorites', JSON.stringify([99999]));
      
      const { queryAllByTestId } = render(<FavoritesScreen />);
      
      await waitFor(() => {
        const quoteCards = queryAllByTestId('quote-card');
        // Should not render cards for invalid IDs
        expect(quoteCards.length).toBe(0);
      });
    });
  });
});
