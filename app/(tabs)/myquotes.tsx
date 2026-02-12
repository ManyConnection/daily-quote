import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  TextInput,
  Modal,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as Clipboard from 'expo-clipboard';
import { useCustomQuotes, CustomQuote } from '@/hooks/useCustomQuotes';

export default function MyQuotesScreen() {
  const { customQuotes, isLoading, error, addCustomQuote, removeCustomQuote, updateCustomQuote } =
    useCustomQuotes();
  const [modalVisible, setModalVisible] = useState(false);
  const [editingQuote, setEditingQuote] = useState<CustomQuote | null>(null);
  const [text, setText] = useState('');
  const [author, setAuthor] = useState('');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const handleOpenAdd = useCallback(() => {
    setEditingQuote(null);
    setText('');
    setAuthor('');
    setModalVisible(true);
  }, []);

  const handleOpenEdit = useCallback((quote: CustomQuote) => {
    setEditingQuote(quote);
    setText(quote.text);
    setAuthor(quote.author);
    setModalVisible(true);
  }, []);

  const handleSave = useCallback(async () => {
    if (!text.trim()) {
      Alert.alert('エラー', '名言を入力してください');
      return;
    }
    try {
      if (editingQuote) {
        await updateCustomQuote(editingQuote.id, text, author);
      } else {
        await addCustomQuote(text, author);
      }
      setModalVisible(false);
      setText('');
      setAuthor('');
      setEditingQuote(null);
    } catch (e) {
      Alert.alert('エラー', '保存に失敗しました');
    }
  }, [text, author, editingQuote, addCustomQuote, updateCustomQuote]);

  const handleDelete = useCallback(
    (quote: CustomQuote) => {
      Alert.alert('削除確認', 'この名言を削除しますか？', [
        { text: 'キャンセル', style: 'cancel' },
        {
          text: '削除',
          style: 'destructive',
          onPress: () => removeCustomQuote(quote.id),
        },
      ]);
    },
    [removeCustomQuote]
  );

  const handleCopy = useCallback(async (quote: CustomQuote) => {
    try {
      const copyText = `「${quote.text}」\n— ${quote.author}`;
      await Clipboard.setStringAsync(copyText);
      setCopiedId(quote.id);
      setTimeout(() => setCopiedId(null), 2000);
    } catch (e) {
      console.error('Failed to copy:', e);
    }
  }, []);

  const renderQuote = useCallback(
    ({ item }: { item: CustomQuote }) => (
      <View style={styles.quoteCard} testID={`custom-quote-${item.id}`}>
        <Text style={styles.quoteText}>「{item.text}」</Text>
        <Text style={styles.authorText}>— {item.author}</Text>
        <View style={styles.actions}>
          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => handleCopy(item)}
            testID={`copy-${item.id}`}
            accessibilityLabel="コピー"
          >
            <Text style={styles.actionIcon}>{copiedId === item.id ? '✓' : '📋'}</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => handleOpenEdit(item)}
            testID={`edit-${item.id}`}
            accessibilityLabel="編集"
          >
            <Text style={styles.actionIcon}>✏️</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.actionButton, styles.deleteButton]}
            onPress={() => handleDelete(item)}
            testID={`delete-${item.id}`}
            accessibilityLabel="削除"
          >
            <Text style={styles.actionIcon}>🗑️</Text>
          </TouchableOpacity>
        </View>
      </View>
    ),
    [handleCopy, handleOpenEdit, handleDelete, copiedId]
  );

  if (isLoading) {
    return (
      <SafeAreaView style={styles.container} edges={['bottom']}>
        <View style={styles.centerContent}>
          <Text style={styles.loadingText}>読み込み中...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={['bottom']}>
      {error && (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{error}</Text>
        </View>
      )}

      <FlatList
        data={customQuotes}
        keyExtractor={(item) => item.id}
        renderItem={renderQuote}
        contentContainerStyle={styles.list}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyEmoji}>✍️</Text>
            <Text style={styles.emptyTitle}>まだ名言がありません</Text>
            <Text style={styles.emptySubtitle}>
              下のボタンから{'\n'}自分だけの名言を追加しましょう
            </Text>
          </View>
        }
      />

      <TouchableOpacity
        style={styles.addButton}
        onPress={handleOpenAdd}
        testID="add-quote-button"
        accessibilityLabel="名言を追加"
      >
        <Text style={styles.addButtonText}>＋ 名言を追加</Text>
      </TouchableOpacity>

      <Modal
        visible={modalVisible}
        animationType="slide"
        transparent
        onRequestClose={() => setModalVisible(false)}
      >
        <KeyboardAvoidingView
          style={styles.modalOverlay}
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        >
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>
              {editingQuote ? '名言を編集' : '新しい名言'}
            </Text>

            <Text style={styles.inputLabel}>名言</Text>
            <TextInput
              style={styles.textArea}
              placeholder="心に響く言葉を入力..."
              placeholderTextColor="#999999"
              value={text}
              onChangeText={setText}
              multiline
              numberOfLines={4}
              testID="quote-text-input"
            />

            <Text style={styles.inputLabel}>著者（オプション）</Text>
            <TextInput
              style={styles.input}
              placeholder="著者名（空欄の場合は「自分」）"
              placeholderTextColor="#999999"
              value={author}
              onChangeText={setAuthor}
              testID="quote-author-input"
            />

            <View style={styles.modalActions}>
              <TouchableOpacity
                style={[styles.modalButton, styles.cancelButton]}
                onPress={() => setModalVisible(false)}
                testID="cancel-button"
              >
                <Text style={styles.cancelButtonText}>キャンセル</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalButton, styles.saveButton]}
                onPress={handleSave}
                testID="save-button"
              >
                <Text style={styles.saveButtonText}>保存</Text>
              </TouchableOpacity>
            </View>
          </View>
        </KeyboardAvoidingView>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  centerContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 16,
    color: '#888888',
  },
  errorContainer: {
    backgroundColor: '#ffebee',
    padding: 12,
    marginHorizontal: 16,
    marginTop: 8,
    borderRadius: 8,
  },
  errorText: {
    color: '#c62828',
    fontSize: 14,
    textAlign: 'center',
  },
  list: {
    padding: 16,
    paddingBottom: 100,
  },
  quoteCard: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  quoteText: {
    fontSize: 16,
    lineHeight: 24,
    color: '#333333',
    marginBottom: 8,
  },
  authorText: {
    fontSize: 14,
    color: '#666666',
    fontStyle: 'italic',
    textAlign: 'right',
    marginBottom: 12,
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
    paddingTop: 12,
    gap: 8,
  },
  actionButton: {
    padding: 8,
    borderRadius: 8,
    backgroundColor: '#f5f5f5',
  },
  deleteButton: {
    backgroundColor: '#ffebee',
  },
  actionIcon: {
    fontSize: 18,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 60,
  },
  emptyEmoji: {
    fontSize: 64,
    marginBottom: 16,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#333333',
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: 14,
    color: '#888888',
    textAlign: 'center',
    lineHeight: 20,
  },
  addButton: {
    position: 'absolute',
    bottom: 24,
    left: 16,
    right: 16,
    backgroundColor: '#4A90D9',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    shadowColor: '#4A90D9',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  addButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#ffffff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 24,
    paddingBottom: 40,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#333333',
    marginBottom: 20,
    textAlign: 'center',
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: '#666666',
    marginBottom: 8,
  },
  input: {
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    marginBottom: 16,
    color: '#333333',
  },
  textArea: {
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    marginBottom: 16,
    height: 100,
    textAlignVertical: 'top',
    color: '#333333',
  },
  modalActions: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 8,
  },
  modalButton: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
  },
  cancelButton: {
    backgroundColor: '#f5f5f5',
  },
  cancelButtonText: {
    color: '#666666',
    fontSize: 16,
    fontWeight: '500',
  },
  saveButton: {
    backgroundColor: '#4A90D9',
  },
  saveButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
});
