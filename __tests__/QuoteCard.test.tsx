import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import * as Clipboard from 'expo-clipboard';
import { QuoteCard } from '../components/QuoteCard';
import { Quote } from '../data/quotes';

const mockQuote: Quote = {
  id: 1,
  text: 'テスト用の名言です',
  author: 'テスト作者',
  category: 'life',
};

describe('QuoteCard', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('rendering', () => {
    it('should display the quote text', () => {
      const { getByTestId } = render(
        <QuoteCard quote={mockQuote} isFavorite={false} onToggleFavorite={jest.fn()} />
      );

      const quoteText = getByTestId('quote-text');
      expect(quoteText).toBeTruthy();
      expect(quoteText.props.children).toContain('テスト用の名言です');
    });

    it('should display the author', () => {
      const { getByTestId } = render(
        <QuoteCard quote={mockQuote} isFavorite={false} onToggleFavorite={jest.fn()} />
      );

      const authorText = getByTestId('quote-author');
      expect(authorText).toBeTruthy();
      expect(authorText.props.children).toContain('テスト作者');
    });

    it('should display category badge by default', () => {
      const { getByText } = render(
        <QuoteCard quote={mockQuote} isFavorite={false} onToggleFavorite={jest.fn()} />
      );

      expect(getByText('人生')).toBeTruthy();
    });

    it('should hide category badge when showCategory is false', () => {
      const { queryByText } = render(
        <QuoteCard quote={mockQuote} isFavorite={false} onToggleFavorite={jest.fn()} showCategory={false} />
      );

      expect(queryByText('人生')).toBeNull();
    });
  });

  describe('favorite button', () => {
    it('should display empty heart when not favorited', () => {
      const { getByTestId } = render(
        <QuoteCard quote={mockQuote} isFavorite={false} onToggleFavorite={jest.fn()} />
      );

      const favoriteButton = getByTestId('favorite-button');
      expect(favoriteButton).toBeTruthy();
    });

    it('should display filled heart when favorited', () => {
      const { getByTestId } = render(
        <QuoteCard quote={mockQuote} isFavorite={true} onToggleFavorite={jest.fn()} />
      );

      const favoriteButton = getByTestId('favorite-button');
      expect(favoriteButton).toBeTruthy();
    });

    it('should call onToggleFavorite when favorite button is pressed', () => {
      const mockToggle = jest.fn();
      const { getByTestId } = render(
        <QuoteCard quote={mockQuote} isFavorite={false} onToggleFavorite={mockToggle} />
      );

      const favoriteButton = getByTestId('favorite-button');
      fireEvent.press(favoriteButton);

      expect(mockToggle).toHaveBeenCalledTimes(1);
    });

    it('should toggle favorite state when button is pressed multiple times', () => {
      const mockToggle = jest.fn();
      const { getByTestId } = render(
        <QuoteCard quote={mockQuote} isFavorite={false} onToggleFavorite={mockToggle} />
      );

      const favoriteButton = getByTestId('favorite-button');
      
      fireEvent.press(favoriteButton);
      fireEvent.press(favoriteButton);
      fireEvent.press(favoriteButton);

      expect(mockToggle).toHaveBeenCalledTimes(3);
    });
  });

  describe('copy button', () => {
    it('should copy quote to clipboard when copy button is pressed', async () => {
      const { getByTestId } = render(
        <QuoteCard quote={mockQuote} isFavorite={false} onToggleFavorite={jest.fn()} />
      );

      const copyButton = getByTestId('copy-button');
      fireEvent.press(copyButton);

      await waitFor(() => {
        expect(Clipboard.setStringAsync).toHaveBeenCalledWith(
          `「${mockQuote.text}」\n— ${mockQuote.author}`
        );
      });
    });

    it('should show copied state after pressing copy button', async () => {
      const { getByTestId, getByText } = render(
        <QuoteCard quote={mockQuote} isFavorite={false} onToggleFavorite={jest.fn()} />
      );

      const copyButton = getByTestId('copy-button');
      fireEvent.press(copyButton);

      await waitFor(() => {
        expect(getByText('コピーしました')).toBeTruthy();
      });
    });
  });

  describe('accessibility', () => {
    it('should have accessible label for favorite button when not favorited', () => {
      const { getByTestId } = render(
        <QuoteCard quote={mockQuote} isFavorite={false} onToggleFavorite={jest.fn()} />
      );

      const favoriteButton = getByTestId('favorite-button');
      expect(favoriteButton.props.accessibilityLabel).toBe('お気に入りに追加');
    });

    it('should have accessible label for favorite button when favorited', () => {
      const { getByTestId } = render(
        <QuoteCard quote={mockQuote} isFavorite={true} onToggleFavorite={jest.fn()} />
      );

      const favoriteButton = getByTestId('favorite-button');
      expect(favoriteButton.props.accessibilityLabel).toBe('お気に入りから削除');
    });

    it('should have accessible label for copy button', () => {
      const { getByTestId } = render(
        <QuoteCard quote={mockQuote} isFavorite={false} onToggleFavorite={jest.fn()} />
      );

      const copyButton = getByTestId('copy-button');
      expect(copyButton.props.accessibilityLabel).toBe('コピー');
    });
  });
});
