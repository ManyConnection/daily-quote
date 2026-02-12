import {
  quotes,
  categoryLabels,
  getQuotesByCategory,
  getRandomQuote,
  getDailyQuote,
  getQuoteById,
  Category,
} from '../data/quotes';

describe('Quotes Data', () => {
  describe('quotes array', () => {
    it('should have at least 100 quotes', () => {
      expect(quotes.length).toBeGreaterThanOrEqual(100);
    });

    it('should have unique IDs for all quotes', () => {
      const ids = quotes.map((q) => q.id);
      const uniqueIds = new Set(ids);
      expect(uniqueIds.size).toBe(quotes.length);
    });

    it('should have valid categories for all quotes', () => {
      const validCategories = Object.keys(categoryLabels);
      quotes.forEach((quote) => {
        expect(validCategories).toContain(quote.category);
      });
    });

    it('should have non-empty text and author for all quotes', () => {
      quotes.forEach((quote) => {
        expect(quote.text.length).toBeGreaterThan(0);
        expect(quote.author.length).toBeGreaterThan(0);
      });
    });
  });

  describe('categoryLabels', () => {
    it('should have labels for all categories', () => {
      const expectedCategories: Category[] = ['life', 'work', 'love', 'friendship', 'wisdom', 'courage', 'happiness', 'success'];
      expectedCategories.forEach((category) => {
        expect(categoryLabels[category]).toBeDefined();
        expect(categoryLabels[category].length).toBeGreaterThan(0);
      });
    });

    it('should have Japanese labels', () => {
      expect(categoryLabels.life).toBe('人生');
      expect(categoryLabels.work).toBe('仕事');
      expect(categoryLabels.love).toBe('愛');
      expect(categoryLabels.friendship).toBe('友情');
    });
  });

  describe('getQuotesByCategory', () => {
    it('should return quotes filtered by category', () => {
      const lifeQuotes = getQuotesByCategory('life');
      expect(lifeQuotes.length).toBeGreaterThan(0);
      lifeQuotes.forEach((quote) => {
        expect(quote.category).toBe('life');
      });
    });

    it('should return quotes for all categories', () => {
      const categories: Category[] = ['life', 'work', 'love', 'friendship', 'wisdom', 'courage', 'happiness', 'success'];
      categories.forEach((category) => {
        const categoryQuotes = getQuotesByCategory(category);
        expect(categoryQuotes.length).toBeGreaterThan(0);
      });
    });
  });

  describe('getRandomQuote', () => {
    it('should return a valid quote', () => {
      const quote = getRandomQuote();
      expect(quote).toBeDefined();
      expect(quote.id).toBeDefined();
      expect(quote.text).toBeDefined();
      expect(quote.author).toBeDefined();
      expect(quote.category).toBeDefined();
    });

    it('should return quotes from the quotes array', () => {
      const quote = getRandomQuote();
      const found = quotes.find((q) => q.id === quote.id);
      expect(found).toBeDefined();
    });
  });

  describe('getDailyQuote', () => {
    it('should return a valid quote', () => {
      const quote = getDailyQuote();
      expect(quote).toBeDefined();
      expect(quote.id).toBeDefined();
      expect(quote.text).toBeDefined();
      expect(quote.author).toBeDefined();
      expect(quote.category).toBeDefined();
    });

    it('should return the same quote for the same day', () => {
      const quote1 = getDailyQuote();
      const quote2 = getDailyQuote();
      expect(quote1.id).toBe(quote2.id);
    });
  });

  describe('getQuoteById', () => {
    it('should return the correct quote for a valid ID', () => {
      const quote = getQuoteById(1);
      expect(quote).toBeDefined();
      expect(quote!.id).toBe(1);
    });

    it('should return undefined for an invalid ID', () => {
      const quote = getQuoteById(99999);
      expect(quote).toBeUndefined();
    });
  });
});
