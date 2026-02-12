import { useState, useEffect, useCallback } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const CUSTOM_QUOTES_KEY = '@daily_quote_custom';

export interface CustomQuote {
  id: string;
  text: string;
  author: string;
  createdAt: number;
}

export interface UseCustomQuotesResult {
  customQuotes: CustomQuote[];
  isLoading: boolean;
  error: string | null;
  addCustomQuote: (text: string, author: string) => Promise<CustomQuote>;
  removeCustomQuote: (id: string) => Promise<void>;
  updateCustomQuote: (id: string, text: string, author: string) => Promise<void>;
  clearCustomQuotes: () => Promise<void>;
  getCustomQuoteById: (id: string) => CustomQuote | undefined;
}

export const generateQuoteId = (): string => {
  return `custom_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
};

export const useCustomQuotes = (): UseCustomQuotesResult => {
  const [customQuotes, setCustomQuotes] = useState<CustomQuote[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadCustomQuotes = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const stored = await AsyncStorage.getItem(CUSTOM_QUOTES_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed)) {
          setCustomQuotes(parsed);
        }
      }
    } catch (e) {
      setError('カスタム名言の読み込みに失敗しました');
      console.error('Failed to load custom quotes:', e);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadCustomQuotes();
  }, [loadCustomQuotes]);

  const saveCustomQuotes = async (quotes: CustomQuote[]) => {
    try {
      await AsyncStorage.setItem(CUSTOM_QUOTES_KEY, JSON.stringify(quotes));
      setCustomQuotes(quotes);
      setError(null);
    } catch (e) {
      setError('カスタム名言の保存に失敗しました');
      console.error('Failed to save custom quotes:', e);
      throw e;
    }
  };

  const addCustomQuote = useCallback(async (text: string, author: string): Promise<CustomQuote> => {
    if (!text.trim()) {
      throw new Error('名言のテキストは必須です');
    }
    const newQuote: CustomQuote = {
      id: generateQuoteId(),
      text: text.trim(),
      author: author.trim() || '自分',
      createdAt: Date.now(),
    };
    await saveCustomQuotes([...customQuotes, newQuote]);
    return newQuote;
  }, [customQuotes]);

  const removeCustomQuote = useCallback(async (id: string) => {
    const filtered = customQuotes.filter((q) => q.id !== id);
    await saveCustomQuotes(filtered);
  }, [customQuotes]);

  const updateCustomQuote = useCallback(async (id: string, text: string, author: string) => {
    if (!text.trim()) {
      throw new Error('名言のテキストは必須です');
    }
    const updated = customQuotes.map((q) => {
      if (q.id === id) {
        return { ...q, text: text.trim(), author: author.trim() || '自分' };
      }
      return q;
    });
    await saveCustomQuotes(updated);
  }, [customQuotes]);

  const clearCustomQuotes = useCallback(async () => {
    try {
      await AsyncStorage.removeItem(CUSTOM_QUOTES_KEY);
      setCustomQuotes([]);
      setError(null);
    } catch (e) {
      setError('カスタム名言の削除に失敗しました');
      console.error('Failed to clear custom quotes:', e);
      throw e;
    }
  }, []);

  const getCustomQuoteById = useCallback((id: string): CustomQuote | undefined => {
    return customQuotes.find((q) => q.id === id);
  }, [customQuotes]);

  return {
    customQuotes,
    isLoading,
    error,
    addCustomQuote,
    removeCustomQuote,
    updateCustomQuote,
    clearCustomQuotes,
    getCustomQuoteById,
  };
};
