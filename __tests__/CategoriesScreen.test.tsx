import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import CategoriesScreen from '../app/(tabs)/categories';
import { quotes, categoryLabels } from '../data/quotes';

// Mock SafeAreaView
jest.mock('react-native-safe-area-context', () => ({
  SafeAreaView: ({ children }: { children: React.ReactNode }) => children,
}));

const mockPush = jest.fn();
jest.mock('expo-router', () => ({
  useRouter: () => ({
    push: mockPush,
    back: jest.fn(),
    replace: jest.fn(),
  }),
}));

describe('CategoriesScreen', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('rendering', () => {
    it('should render the title', () => {
      const { getByText } = render(<CategoriesScreen />);
      expect(getByText('カテゴリ別名言')).toBeTruthy();
    });

    it('should render the total quote count', () => {
      const { getByText } = render(<CategoriesScreen />);
      expect(getByText(`全${quotes.length}件の名言`)).toBeTruthy();
    });

    it('should render all category cards', () => {
      const { getByTestId } = render(<CategoriesScreen />);
      
      const categories = ['life', 'work', 'love', 'friendship', 'wisdom', 'courage', 'happiness', 'success'];
      categories.forEach((category) => {
        expect(getByTestId(`category-${category}`)).toBeTruthy();
      });
    });

    it('should render all category labels in Japanese', () => {
      const { getByText } = render(<CategoriesScreen />);
      
      expect(getByText('人生')).toBeTruthy();
      expect(getByText('仕事')).toBeTruthy();
      expect(getByText('愛')).toBeTruthy();
      expect(getByText('友情')).toBeTruthy();
      expect(getByText('知恵')).toBeTruthy();
      expect(getByText('勇気')).toBeTruthy();
      expect(getByText('幸福')).toBeTruthy();
      expect(getByText('成功')).toBeTruthy();
    });

    it('should render footer text', () => {
      const { getByText } = render(<CategoriesScreen />);
      expect(getByText('気になるカテゴリをタップしてください')).toBeTruthy();
    });
  });

  describe('navigation', () => {
    it('should navigate to life category when life card is pressed', () => {
      const { getByTestId } = render(<CategoriesScreen />);
      
      const lifeCard = getByTestId('category-life');
      fireEvent.press(lifeCard);
      
      expect(mockPush).toHaveBeenCalledWith('/category/life');
    });

    it('should navigate to work category when work card is pressed', () => {
      const { getByTestId } = render(<CategoriesScreen />);
      
      const workCard = getByTestId('category-work');
      fireEvent.press(workCard);
      
      expect(mockPush).toHaveBeenCalledWith('/category/work');
    });

    it('should navigate to love category when love card is pressed', () => {
      const { getByTestId } = render(<CategoriesScreen />);
      
      const loveCard = getByTestId('category-love');
      fireEvent.press(loveCard);
      
      expect(mockPush).toHaveBeenCalledWith('/category/love');
    });

    it('should navigate to friendship category when friendship card is pressed', () => {
      const { getByTestId } = render(<CategoriesScreen />);
      
      const card = getByTestId('category-friendship');
      fireEvent.press(card);
      
      expect(mockPush).toHaveBeenCalledWith('/category/friendship');
    });

    it('should navigate to wisdom category when wisdom card is pressed', () => {
      const { getByTestId } = render(<CategoriesScreen />);
      
      const card = getByTestId('category-wisdom');
      fireEvent.press(card);
      
      expect(mockPush).toHaveBeenCalledWith('/category/wisdom');
    });

    it('should navigate to courage category when courage card is pressed', () => {
      const { getByTestId } = render(<CategoriesScreen />);
      
      const card = getByTestId('category-courage');
      fireEvent.press(card);
      
      expect(mockPush).toHaveBeenCalledWith('/category/courage');
    });

    it('should navigate to happiness category when happiness card is pressed', () => {
      const { getByTestId } = render(<CategoriesScreen />);
      
      const card = getByTestId('category-happiness');
      fireEvent.press(card);
      
      expect(mockPush).toHaveBeenCalledWith('/category/happiness');
    });

    it('should navigate to success category when success card is pressed', () => {
      const { getByTestId } = render(<CategoriesScreen />);
      
      const card = getByTestId('category-success');
      fireEvent.press(card);
      
      expect(mockPush).toHaveBeenCalledWith('/category/success');
    });
  });
});
