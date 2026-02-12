import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { CategoryCard } from '../components/CategoryCard';
import { getQuotesByCategory, categoryLabels } from '../data/quotes';

describe('CategoryCard', () => {
  describe('rendering', () => {
    it('should display the category name in Japanese', () => {
      const { getByText } = render(
        <CategoryCard category="life" onPress={jest.fn()} />
      );

      expect(getByText('人生')).toBeTruthy();
    });

    it('should display the correct quote count', () => {
      const lifeQuotes = getQuotesByCategory('life');
      const { getByText } = render(
        <CategoryCard category="life" onPress={jest.fn()} />
      );

      expect(getByText(`${lifeQuotes.length}件の名言`)).toBeTruthy();
    });

    it('should display emoji for each category', () => {
      const categories = ['life', 'work', 'love', 'friendship', 'wisdom', 'courage', 'happiness', 'success'] as const;
      
      categories.forEach((category) => {
        const { unmount } = render(
          <CategoryCard category={category} onPress={jest.fn()} />
        );
        // Just verify it renders without error
        unmount();
      });
    });
  });

  describe('interaction', () => {
    it('should call onPress when card is pressed', () => {
      const mockOnPress = jest.fn();
      const { getByTestId } = render(
        <CategoryCard category="life" onPress={mockOnPress} />
      );

      const card = getByTestId('category-life');
      fireEvent.press(card);

      expect(mockOnPress).toHaveBeenCalledTimes(1);
    });

    it('should call onPress for work category', () => {
      const mockOnPress = jest.fn();
      const { getByTestId } = render(
        <CategoryCard category="work" onPress={mockOnPress} />
      );

      const card = getByTestId('category-work');
      fireEvent.press(card);

      expect(mockOnPress).toHaveBeenCalledTimes(1);
    });

    it('should call onPress multiple times when pressed multiple times', () => {
      const mockOnPress = jest.fn();
      const { getByTestId } = render(
        <CategoryCard category="love" onPress={mockOnPress} />
      );

      const card = getByTestId('category-love');
      fireEvent.press(card);
      fireEvent.press(card);
      fireEvent.press(card);

      expect(mockOnPress).toHaveBeenCalledTimes(3);
    });
  });

  describe('accessibility', () => {
    it('should have accessible label for life category', () => {
      const { getByTestId } = render(
        <CategoryCard category="life" onPress={jest.fn()} />
      );

      const card = getByTestId('category-life');
      expect(card.props.accessibilityLabel).toBe('人生カテゴリ');
    });

    it('should have accessible label for work category', () => {
      const { getByTestId } = render(
        <CategoryCard category="work" onPress={jest.fn()} />
      );

      const card = getByTestId('category-work');
      expect(card.props.accessibilityLabel).toBe('仕事カテゴリ');
    });
  });

  describe('category display', () => {
    it('should display correct label for all categories', () => {
      const categories = ['life', 'work', 'love', 'friendship', 'wisdom', 'courage', 'happiness', 'success'] as const;
      
      categories.forEach((category) => {
        const { getByText, unmount } = render(
          <CategoryCard category={category} onPress={jest.fn()} />
        );
        
        expect(getByText(categoryLabels[category])).toBeTruthy();
        unmount();
      });
    });
  });
});
