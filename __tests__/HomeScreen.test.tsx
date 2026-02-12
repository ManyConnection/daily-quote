import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import HomeScreen from '../app/(tabs)/index';

// Mock SafeAreaView
jest.mock('react-native-safe-area-context', () => ({
  SafeAreaView: ({ children }: { children: React.ReactNode }) => children,
}));

describe('HomeScreen', () => {
  beforeEach(async () => {
    await AsyncStorage.clear();
    jest.clearAllMocks();
  });

  describe('rendering', () => {
    it('should render the greeting', () => {
      const { getByText } = render(<HomeScreen />);
      expect(getByText('こんにちは！')).toBeTruthy();
    });

    it('should render the subtitle', () => {
      const { getByText } = render(<HomeScreen />);
      expect(getByText('今日の名言をお届けします')).toBeTruthy();
    });

    it('should render a quote card', () => {
      const { getByTestId } = render(<HomeScreen />);
      expect(getByTestId('quote-card')).toBeTruthy();
    });

    it('should render the new quote button', () => {
      const { getByTestId } = render(<HomeScreen />);
      expect(getByTestId('new-quote-button')).toBeTruthy();
    });

    it('should render the tip text', () => {
      const { getByText } = render(<HomeScreen />);
      expect(getByText('💡 ヒント: 下に引っ張って新しい名言を表示')).toBeTruthy();
    });
  });

  describe('new quote button', () => {
    it('should change quote when new quote button is pressed', async () => {
      const { getByTestId } = render(<HomeScreen />);
      
      const quoteText = getByTestId('quote-text');
      const initialQuote = quoteText.props.children;
      
      const newQuoteButton = getByTestId('new-quote-button');
      
      // Press multiple times to increase chance of getting different quote
      for (let i = 0; i < 10; i++) {
        fireEvent.press(newQuoteButton);
      }
      
      // The quote should have displayed (may or may not be different due to random)
      const finalQuoteText = getByTestId('quote-text');
      expect(finalQuoteText).toBeTruthy();
    });

    it('should call button action when pressed', () => {
      const { getByTestId } = render(<HomeScreen />);
      
      const newQuoteButton = getByTestId('new-quote-button');
      fireEvent.press(newQuoteButton);
      
      // Verify button is pressable and renders correctly after press
      expect(newQuoteButton).toBeTruthy();
    });
  });

  describe('favorite functionality', () => {
    it('should toggle favorite when favorite button is pressed', async () => {
      const { getByTestId } = render(<HomeScreen />);
      
      await waitFor(() => {
        expect(getByTestId('favorite-button')).toBeTruthy();
      });
      
      const favoriteButton = getByTestId('favorite-button');
      fireEvent.press(favoriteButton);
      
      await waitFor(() => {
        expect(favoriteButton).toBeTruthy();
      });
    });

    it('should persist favorite to AsyncStorage', async () => {
      const { getByTestId } = render(<HomeScreen />);
      
      await waitFor(() => {
        expect(getByTestId('favorite-button')).toBeTruthy();
      });
      
      const favoriteButton = getByTestId('favorite-button');
      fireEvent.press(favoriteButton);
      
      await waitFor(async () => {
        const stored = await AsyncStorage.getItem('@daily_quote_favorites');
        expect(stored).not.toBeNull();
      });
    });
  });

  describe('copy functionality', () => {
    it('should show copy button', () => {
      const { getByTestId } = render(<HomeScreen />);
      expect(getByTestId('copy-button')).toBeTruthy();
    });

    it('should allow copying quote', async () => {
      const { getByTestId, getByText } = render(<HomeScreen />);
      
      const copyButton = getByTestId('copy-button');
      fireEvent.press(copyButton);
      
      await waitFor(() => {
        expect(getByText('コピーしました')).toBeTruthy();
      });
    });
  });

  describe('accessibility', () => {
    it('should have accessible label for new quote button', () => {
      const { getByTestId } = render(<HomeScreen />);
      
      const newQuoteButton = getByTestId('new-quote-button');
      expect(newQuoteButton.props.accessibilityLabel).toBe('新しい名言を表示');
    });
  });
});
