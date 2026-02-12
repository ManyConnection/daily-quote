import { renderHook, act, waitFor } from '@testing-library/react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useCustomQuotes, generateQuoteId, CustomQuote } from '../hooks/useCustomQuotes';

// Mock AsyncStorage
jest.mock('@react-native-async-storage/async-storage', () => ({
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
}));

const mockedAsyncStorage = AsyncStorage as jest.Mocked<typeof AsyncStorage>;

describe('useCustomQuotes', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockedAsyncStorage.getItem.mockResolvedValue(null);
    mockedAsyncStorage.setItem.mockResolvedValue(undefined);
    mockedAsyncStorage.removeItem.mockResolvedValue(undefined);
  });

  describe('generateQuoteId', () => {
    it('generates unique IDs', () => {
      const id1 = generateQuoteId();
      const id2 = generateQuoteId();
      expect(id1).not.toBe(id2);
    });

    it('generates IDs with custom prefix', () => {
      const id = generateQuoteId();
      expect(id.startsWith('custom_')).toBe(true);
    });

    it('generates IDs with timestamp component', () => {
      const id = generateQuoteId();
      const parts = id.split('_');
      expect(parts.length).toBe(3);
      expect(!isNaN(Number(parts[1]))).toBe(true);
    });
  });

  describe('initialization', () => {
    it('starts with empty custom quotes', async () => {
      const { result } = renderHook(() => useCustomQuotes());

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      expect(result.current.customQuotes).toEqual([]);
    });

    it('sets isLoading to true initially', () => {
      const { result } = renderHook(() => useCustomQuotes());
      expect(result.current.isLoading).toBe(true);
    });

    it('loads stored custom quotes on mount', async () => {
      const storedQuotes: CustomQuote[] = [
        { id: 'test_1', text: 'Test quote', author: '自分', createdAt: Date.now() },
      ];
      mockedAsyncStorage.getItem.mockResolvedValue(JSON.stringify(storedQuotes));

      const { result } = renderHook(() => useCustomQuotes());

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      expect(result.current.customQuotes).toEqual(storedQuotes);
    });

    it('handles invalid JSON in storage', async () => {
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
      mockedAsyncStorage.getItem.mockResolvedValue('invalid-json');

      const { result } = renderHook(() => useCustomQuotes());

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      expect(result.current.error).toBe('カスタム名言の読み込みに失敗しました');
      consoleSpy.mockRestore();
    });

    it('handles non-array data in storage', async () => {
      mockedAsyncStorage.getItem.mockResolvedValue(JSON.stringify({ not: 'array' }));

      const { result } = renderHook(() => useCustomQuotes());

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      expect(result.current.customQuotes).toEqual([]);
    });
  });

  describe('addCustomQuote', () => {
    it('adds a new custom quote', async () => {
      const { result } = renderHook(() => useCustomQuotes());

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      await act(async () => {
        await result.current.addCustomQuote('New quote text', 'Test Author');
      });

      expect(result.current.customQuotes.length).toBe(1);
      expect(result.current.customQuotes[0].text).toBe('New quote text');
      expect(result.current.customQuotes[0].author).toBe('Test Author');
    });

    it('trims whitespace from text and author', async () => {
      const { result } = renderHook(() => useCustomQuotes());

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      await act(async () => {
        await result.current.addCustomQuote('  Quote with spaces  ', '  Author  ');
      });

      expect(result.current.customQuotes[0].text).toBe('Quote with spaces');
      expect(result.current.customQuotes[0].author).toBe('Author');
    });

    it('uses default author when empty', async () => {
      const { result } = renderHook(() => useCustomQuotes());

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      await act(async () => {
        await result.current.addCustomQuote('Quote', '');
      });

      expect(result.current.customQuotes[0].author).toBe('自分');
    });

    it('throws error when text is empty', async () => {
      const { result } = renderHook(() => useCustomQuotes());

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      await expect(
        act(async () => {
          await result.current.addCustomQuote('', 'Author');
        })
      ).rejects.toThrow('名言のテキストは必須です');
    });

    it('throws error when text is only whitespace', async () => {
      const { result } = renderHook(() => useCustomQuotes());

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      await expect(
        act(async () => {
          await result.current.addCustomQuote('   ', 'Author');
        })
      ).rejects.toThrow('名言のテキストは必須です');
    });

    it('returns the new quote', async () => {
      const { result } = renderHook(() => useCustomQuotes());

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      let newQuote: CustomQuote | undefined;
      await act(async () => {
        newQuote = await result.current.addCustomQuote('Test', 'Author');
      });

      expect(newQuote?.text).toBe('Test');
      expect(newQuote?.author).toBe('Author');
      expect(newQuote?.id).toBeDefined();
      expect(newQuote?.createdAt).toBeDefined();
    });

    it('saves to AsyncStorage', async () => {
      const { result } = renderHook(() => useCustomQuotes());

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      await act(async () => {
        await result.current.addCustomQuote('Test', 'Author');
      });

      expect(mockedAsyncStorage.setItem).toHaveBeenCalledWith(
        '@daily_quote_custom',
        expect.stringContaining('Test')
      );
    });
  });

  describe('removeCustomQuote', () => {
    it('removes a quote by ID', async () => {
      const storedQuotes: CustomQuote[] = [
        { id: 'test_1', text: 'Quote 1', author: 'Author', createdAt: 1 },
        { id: 'test_2', text: 'Quote 2', author: 'Author', createdAt: 2 },
      ];
      mockedAsyncStorage.getItem.mockResolvedValue(JSON.stringify(storedQuotes));

      const { result } = renderHook(() => useCustomQuotes());

      await waitFor(() => {
        expect(result.current.customQuotes.length).toBe(2);
      });

      await act(async () => {
        await result.current.removeCustomQuote('test_1');
      });

      expect(result.current.customQuotes.length).toBe(1);
      expect(result.current.customQuotes[0].id).toBe('test_2');
    });

    it('handles removing non-existent quote', async () => {
      const storedQuotes: CustomQuote[] = [
        { id: 'test_1', text: 'Quote 1', author: 'Author', createdAt: 1 },
      ];
      mockedAsyncStorage.getItem.mockResolvedValue(JSON.stringify(storedQuotes));

      const { result } = renderHook(() => useCustomQuotes());

      await waitFor(() => {
        expect(result.current.customQuotes.length).toBe(1);
      });

      await act(async () => {
        await result.current.removeCustomQuote('non_existent');
      });

      expect(result.current.customQuotes.length).toBe(1);
    });
  });

  describe('updateCustomQuote', () => {
    it('updates text and author', async () => {
      const storedQuotes: CustomQuote[] = [
        { id: 'test_1', text: 'Old text', author: 'Old author', createdAt: 1 },
      ];
      mockedAsyncStorage.getItem.mockResolvedValue(JSON.stringify(storedQuotes));

      const { result } = renderHook(() => useCustomQuotes());

      await waitFor(() => {
        expect(result.current.customQuotes.length).toBe(1);
      });

      await act(async () => {
        await result.current.updateCustomQuote('test_1', 'New text', 'New author');
      });

      expect(result.current.customQuotes[0].text).toBe('New text');
      expect(result.current.customQuotes[0].author).toBe('New author');
    });

    it('uses default author when empty', async () => {
      const storedQuotes: CustomQuote[] = [
        { id: 'test_1', text: 'Text', author: 'Author', createdAt: 1 },
      ];
      mockedAsyncStorage.getItem.mockResolvedValue(JSON.stringify(storedQuotes));

      const { result } = renderHook(() => useCustomQuotes());

      await waitFor(() => {
        expect(result.current.customQuotes.length).toBe(1);
      });

      await act(async () => {
        await result.current.updateCustomQuote('test_1', 'Updated', '');
      });

      expect(result.current.customQuotes[0].author).toBe('自分');
    });

    it('throws error when text is empty', async () => {
      const storedQuotes: CustomQuote[] = [
        { id: 'test_1', text: 'Text', author: 'Author', createdAt: 1 },
      ];
      mockedAsyncStorage.getItem.mockResolvedValue(JSON.stringify(storedQuotes));

      const { result } = renderHook(() => useCustomQuotes());

      await waitFor(() => {
        expect(result.current.customQuotes.length).toBe(1);
      });

      await expect(
        act(async () => {
          await result.current.updateCustomQuote('test_1', '', 'Author');
        })
      ).rejects.toThrow('名言のテキストは必須です');
    });
  });

  describe('clearCustomQuotes', () => {
    it('removes all custom quotes', async () => {
      const storedQuotes: CustomQuote[] = [
        { id: 'test_1', text: 'Quote 1', author: 'Author', createdAt: 1 },
        { id: 'test_2', text: 'Quote 2', author: 'Author', createdAt: 2 },
      ];
      mockedAsyncStorage.getItem.mockResolvedValue(JSON.stringify(storedQuotes));

      const { result } = renderHook(() => useCustomQuotes());

      await waitFor(() => {
        expect(result.current.customQuotes.length).toBe(2);
      });

      await act(async () => {
        await result.current.clearCustomQuotes();
      });

      expect(result.current.customQuotes).toEqual([]);
    });

    it('calls AsyncStorage.removeItem', async () => {
      const { result } = renderHook(() => useCustomQuotes());

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      await act(async () => {
        await result.current.clearCustomQuotes();
      });

      expect(mockedAsyncStorage.removeItem).toHaveBeenCalledWith('@daily_quote_custom');
    });
  });

  describe('getCustomQuoteById', () => {
    it('returns quote by ID', async () => {
      const storedQuotes: CustomQuote[] = [
        { id: 'test_1', text: 'Quote 1', author: 'Author', createdAt: 1 },
        { id: 'test_2', text: 'Quote 2', author: 'Author', createdAt: 2 },
      ];
      mockedAsyncStorage.getItem.mockResolvedValue(JSON.stringify(storedQuotes));

      const { result } = renderHook(() => useCustomQuotes());

      await waitFor(() => {
        expect(result.current.customQuotes.length).toBe(2);
      });

      const quote = result.current.getCustomQuoteById('test_2');
      expect(quote?.text).toBe('Quote 2');
    });

    it('returns undefined for non-existent ID', async () => {
      const storedQuotes: CustomQuote[] = [
        { id: 'test_1', text: 'Quote 1', author: 'Author', createdAt: 1 },
      ];
      mockedAsyncStorage.getItem.mockResolvedValue(JSON.stringify(storedQuotes));

      const { result } = renderHook(() => useCustomQuotes());

      await waitFor(() => {
        expect(result.current.customQuotes.length).toBe(1);
      });

      const quote = result.current.getCustomQuoteById('non_existent');
      expect(quote).toBeUndefined();
    });
  });

  describe('error handling', () => {
    it('sets error on load failure', async () => {
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
      mockedAsyncStorage.getItem.mockRejectedValue(new Error('Storage error'));

      const { result } = renderHook(() => useCustomQuotes());

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      expect(result.current.error).toBe('カスタム名言の読み込みに失敗しました');
      consoleSpy.mockRestore();
    });

    it('throws on save failure', async () => {
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
      const { result } = renderHook(() => useCustomQuotes());

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      mockedAsyncStorage.setItem.mockRejectedValue(new Error('Storage error'));

      await expect(
        act(async () => {
          await result.current.addCustomQuote('Test', 'Author');
        })
      ).rejects.toThrow('Storage error');

      consoleSpy.mockRestore();
    });

    it('throws on clear failure', async () => {
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
      const { result } = renderHook(() => useCustomQuotes());

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      mockedAsyncStorage.removeItem.mockRejectedValue(new Error('Storage error'));

      await expect(
        act(async () => {
          await result.current.clearCustomQuotes();
        })
      ).rejects.toThrow('Storage error');

      consoleSpy.mockRestore();
    });
  });
});
