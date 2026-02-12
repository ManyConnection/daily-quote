import React from 'react';
import { render, fireEvent, waitFor, act } from '@testing-library/react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Clipboard from 'expo-clipboard';
import { Alert } from 'react-native';
import MyQuotesScreen from '../app/(tabs)/myquotes';

// Mock dependencies
jest.mock('@react-native-async-storage/async-storage', () => ({
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
}));

jest.mock('expo-clipboard', () => ({
  setStringAsync: jest.fn(),
}));

jest.mock('react-native-safe-area-context', () => ({
  SafeAreaView: ({ children }: { children: React.ReactNode }) => children,
}));

const mockedAsyncStorage = AsyncStorage as jest.Mocked<typeof AsyncStorage>;
const mockedClipboard = Clipboard as jest.Mocked<typeof Clipboard>;

describe('MyQuotesScreen', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockedAsyncStorage.getItem.mockResolvedValue(null);
    mockedAsyncStorage.setItem.mockResolvedValue(undefined);
    mockedAsyncStorage.removeItem.mockResolvedValue(undefined);
    mockedClipboard.setStringAsync.mockResolvedValue(true);
  });

  describe('rendering', () => {
    it('renders loading state initially', () => {
      mockedAsyncStorage.getItem.mockImplementation(() => new Promise(() => {}));
      const { getByText } = render(<MyQuotesScreen />);
      expect(getByText('読み込み中...')).toBeTruthy();
    });

    it('renders empty state when no quotes', async () => {
      const { getByText } = render(<MyQuotesScreen />);

      await waitFor(() => {
        expect(getByText('まだ名言がありません')).toBeTruthy();
      });
    });

    it('renders add button', async () => {
      const { getByTestId } = render(<MyQuotesScreen />);

      await waitFor(() => {
        expect(getByTestId('add-quote-button')).toBeTruthy();
      });
    });

    it('renders custom quotes from storage', async () => {
      const quotes = [
        { id: 'test_1', text: 'Test quote 1', author: '自分', createdAt: 1 },
        { id: 'test_2', text: 'Test quote 2', author: 'Author', createdAt: 2 },
      ];
      mockedAsyncStorage.getItem.mockResolvedValue(JSON.stringify(quotes));

      const { getByText } = render(<MyQuotesScreen />);

      await waitFor(() => {
        expect(getByText('「Test quote 1」')).toBeTruthy();
        expect(getByText('「Test quote 2」')).toBeTruthy();
      });
    });

    it('shows error message when load fails', async () => {
      jest.spyOn(console, 'error').mockImplementation(() => {});
      mockedAsyncStorage.getItem.mockRejectedValue(new Error('Load error'));

      const { getByText } = render(<MyQuotesScreen />);

      await waitFor(() => {
        expect(getByText('カスタム名言の読み込みに失敗しました')).toBeTruthy();
      });
    });
  });

  describe('add quote modal', () => {
    it('opens modal when add button pressed', async () => {
      const { getByTestId, getByText } = render(<MyQuotesScreen />);

      await waitFor(() => {
        expect(getByTestId('add-quote-button')).toBeTruthy();
      });

      fireEvent.press(getByTestId('add-quote-button'));

      expect(getByText('新しい名言')).toBeTruthy();
    });

    it('shows text and author inputs', async () => {
      const { getByTestId } = render(<MyQuotesScreen />);

      await waitFor(() => {
        expect(getByTestId('add-quote-button')).toBeTruthy();
      });

      fireEvent.press(getByTestId('add-quote-button'));

      expect(getByTestId('quote-text-input')).toBeTruthy();
      expect(getByTestId('quote-author-input')).toBeTruthy();
    });

    it('shows cancel and save buttons', async () => {
      const { getByTestId } = render(<MyQuotesScreen />);

      await waitFor(() => {
        expect(getByTestId('add-quote-button')).toBeTruthy();
      });

      fireEvent.press(getByTestId('add-quote-button'));

      expect(getByTestId('cancel-button')).toBeTruthy();
      expect(getByTestId('save-button')).toBeTruthy();
    });

    it('closes modal on cancel', async () => {
      const { getByTestId, queryByText } = render(<MyQuotesScreen />);

      await waitFor(() => {
        expect(getByTestId('add-quote-button')).toBeTruthy();
      });

      fireEvent.press(getByTestId('add-quote-button'));
      fireEvent.press(getByTestId('cancel-button'));

      await waitFor(() => {
        expect(queryByText('新しい名言')).toBeNull();
      });
    });
  });

  describe('adding quotes', () => {
    it('shows alert when saving empty quote', async () => {
      const alertSpy = jest.spyOn(Alert, 'alert');
      const { getByTestId } = render(<MyQuotesScreen />);

      await waitFor(() => {
        expect(getByTestId('add-quote-button')).toBeTruthy();
      });

      fireEvent.press(getByTestId('add-quote-button'));
      fireEvent.press(getByTestId('save-button'));

      expect(alertSpy).toHaveBeenCalledWith('エラー', '名言を入力してください');
    });

    it('saves quote with text and author', async () => {
      const { getByTestId, queryByText } = render(<MyQuotesScreen />);

      await waitFor(() => {
        expect(getByTestId('add-quote-button')).toBeTruthy();
      });

      fireEvent.press(getByTestId('add-quote-button'));
      fireEvent.changeText(getByTestId('quote-text-input'), 'New quote');
      fireEvent.changeText(getByTestId('quote-author-input'), 'New author');
      fireEvent.press(getByTestId('save-button'));

      await waitFor(() => {
        expect(mockedAsyncStorage.setItem).toHaveBeenCalled();
      });
    });

    it('closes modal after saving', async () => {
      const { getByTestId, queryByText } = render(<MyQuotesScreen />);

      await waitFor(() => {
        expect(getByTestId('add-quote-button')).toBeTruthy();
      });

      fireEvent.press(getByTestId('add-quote-button'));
      fireEvent.changeText(getByTestId('quote-text-input'), 'New quote');
      fireEvent.press(getByTestId('save-button'));

      await waitFor(() => {
        expect(queryByText('新しい名言')).toBeNull();
      });
    });
  });

  describe('editing quotes', () => {
    it('opens edit modal with existing data', async () => {
      const quotes = [{ id: 'test_1', text: 'Original text', author: 'Original author', createdAt: 1 }];
      mockedAsyncStorage.getItem.mockResolvedValue(JSON.stringify(quotes));

      const { getByTestId, getByText, getByDisplayValue } = render(<MyQuotesScreen />);

      await waitFor(() => {
        expect(getByText('「Original text」')).toBeTruthy();
      });

      fireEvent.press(getByTestId('edit-test_1'));

      expect(getByText('名言を編集')).toBeTruthy();
      expect(getByDisplayValue('Original text')).toBeTruthy();
      expect(getByDisplayValue('Original author')).toBeTruthy();
    });

    it('updates quote on save', async () => {
      const quotes = [{ id: 'test_1', text: 'Original text', author: 'Original author', createdAt: 1 }];
      mockedAsyncStorage.getItem.mockResolvedValue(JSON.stringify(quotes));

      const { getByTestId, getByText } = render(<MyQuotesScreen />);

      await waitFor(() => {
        expect(getByText('「Original text」')).toBeTruthy();
      });

      fireEvent.press(getByTestId('edit-test_1'));
      fireEvent.changeText(getByTestId('quote-text-input'), 'Updated text');
      fireEvent.press(getByTestId('save-button'));

      await waitFor(() => {
        expect(mockedAsyncStorage.setItem).toHaveBeenCalled();
      });
    });
  });

  describe('deleting quotes', () => {
    it('shows confirmation alert', async () => {
      const alertSpy = jest.spyOn(Alert, 'alert');
      const quotes = [{ id: 'test_1', text: 'Quote to delete', author: 'Author', createdAt: 1 }];
      mockedAsyncStorage.getItem.mockResolvedValue(JSON.stringify(quotes));

      const { getByTestId, getByText } = render(<MyQuotesScreen />);

      await waitFor(() => {
        expect(getByText('「Quote to delete」')).toBeTruthy();
      });

      fireEvent.press(getByTestId('delete-test_1'));

      expect(alertSpy).toHaveBeenCalledWith(
        '削除確認',
        'この名言を削除しますか？',
        expect.arrayContaining([
          expect.objectContaining({ text: 'キャンセル' }),
          expect.objectContaining({ text: '削除' }),
        ])
      );
    });
  });

  describe('copying quotes', () => {
    it('copies quote to clipboard', async () => {
      const quotes = [{ id: 'test_1', text: 'Quote to copy', author: 'Author', createdAt: 1 }];
      mockedAsyncStorage.getItem.mockResolvedValue(JSON.stringify(quotes));

      const { getByTestId, getByText } = render(<MyQuotesScreen />);

      await waitFor(() => {
        expect(getByText('「Quote to copy」')).toBeTruthy();
      });

      fireEvent.press(getByTestId('copy-test_1'));

      await waitFor(() => {
        expect(mockedClipboard.setStringAsync).toHaveBeenCalledWith(
          '「Quote to copy」\n— Author'
        );
      });
    });

    it('shows copy confirmation icon', async () => {
      jest.useFakeTimers();
      const quotes = [{ id: 'test_1', text: 'Quote', author: 'Author', createdAt: 1 }];
      mockedAsyncStorage.getItem.mockResolvedValue(JSON.stringify(quotes));

      const { getByTestId, getByText } = render(<MyQuotesScreen />);

      await waitFor(() => {
        expect(getByText('「Quote」')).toBeTruthy();
      });

      fireEvent.press(getByTestId('copy-test_1'));

      await waitFor(() => {
        expect(getByText('✓')).toBeTruthy();
      });

      jest.useRealTimers();
    });
  });

  describe('accessibility', () => {
    it('has accessible add button', async () => {
      const { getByLabelText } = render(<MyQuotesScreen />);

      await waitFor(() => {
        expect(getByLabelText('名言を追加')).toBeTruthy();
      });
    });

    it('has accessible copy button', async () => {
      const quotes = [{ id: 'test_1', text: 'Quote', author: 'Author', createdAt: 1 }];
      mockedAsyncStorage.getItem.mockResolvedValue(JSON.stringify(quotes));

      const { getByLabelText } = render(<MyQuotesScreen />);

      await waitFor(() => {
        expect(getByLabelText('コピー')).toBeTruthy();
      });
    });

    it('has accessible edit button', async () => {
      const quotes = [{ id: 'test_1', text: 'Quote', author: 'Author', createdAt: 1 }];
      mockedAsyncStorage.getItem.mockResolvedValue(JSON.stringify(quotes));

      const { getByLabelText } = render(<MyQuotesScreen />);

      await waitFor(() => {
        expect(getByLabelText('編集')).toBeTruthy();
      });
    });

    it('has accessible delete button', async () => {
      const quotes = [{ id: 'test_1', text: 'Quote', author: 'Author', createdAt: 1 }];
      mockedAsyncStorage.getItem.mockResolvedValue(JSON.stringify(quotes));

      const { getByLabelText } = render(<MyQuotesScreen />);

      await waitFor(() => {
        expect(getByLabelText('削除')).toBeTruthy();
      });
    });
  });

  describe('quote display', () => {
    it('displays quote with quotes around text', async () => {
      const quotes = [{ id: 'test_1', text: 'Test text', author: 'Author', createdAt: 1 }];
      mockedAsyncStorage.getItem.mockResolvedValue(JSON.stringify(quotes));

      const { getByText } = render(<MyQuotesScreen />);

      await waitFor(() => {
        expect(getByText('「Test text」')).toBeTruthy();
      });
    });

    it('displays author with dash prefix', async () => {
      const quotes = [{ id: 'test_1', text: 'Test', author: 'Test Author', createdAt: 1 }];
      mockedAsyncStorage.getItem.mockResolvedValue(JSON.stringify(quotes));

      const { getByText } = render(<MyQuotesScreen />);

      await waitFor(() => {
        expect(getByText('— Test Author')).toBeTruthy();
      });
    });

    it('renders multiple quotes', async () => {
      const quotes = [
        { id: 'test_1', text: 'First', author: 'Author1', createdAt: 1 },
        { id: 'test_2', text: 'Second', author: 'Author2', createdAt: 2 },
        { id: 'test_3', text: 'Third', author: 'Author3', createdAt: 3 },
      ];
      mockedAsyncStorage.getItem.mockResolvedValue(JSON.stringify(quotes));

      const { getByText } = render(<MyQuotesScreen />);

      await waitFor(() => {
        expect(getByText('「First」')).toBeTruthy();
        expect(getByText('「Second」')).toBeTruthy();
        expect(getByText('「Third」')).toBeTruthy();
      });
    });
  });
});
