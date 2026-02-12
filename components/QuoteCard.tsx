import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Dimensions } from 'react-native';
import * as Clipboard from 'expo-clipboard';
import { Quote, categoryLabels } from '@/data/quotes';

interface QuoteCardProps {
  quote: Quote;
  isFavorite: boolean;
  onToggleFavorite: () => void;
  showCategory?: boolean;
}

export const QuoteCard: React.FC<QuoteCardProps> = ({
  quote,
  isFavorite,
  onToggleFavorite,
  showCategory = true,
}) => {
  const [copied, setCopied] = React.useState(false);

  const handleCopy = async () => {
    try {
      const text = `「${quote.text}」\n— ${quote.author}`;
      await Clipboard.setStringAsync(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error('Failed to copy:', error);
    }
  };

  return (
    <View style={styles.card} testID="quote-card">
      {showCategory && (
        <View style={styles.categoryBadge}>
          <Text style={styles.categoryText}>{categoryLabels[quote.category]}</Text>
        </View>
      )}
      <Text style={styles.quoteText} testID="quote-text">
        「{quote.text}」
      </Text>
      <Text style={styles.authorText} testID="quote-author">
        — {quote.author}
      </Text>
      <View style={styles.actions}>
        <TouchableOpacity
          style={[styles.actionButton, isFavorite && styles.favoriteActive]}
          onPress={onToggleFavorite}
          testID="favorite-button"
          accessibilityLabel={isFavorite ? 'お気に入りから削除' : 'お気に入りに追加'}
        >
          <Text style={[styles.actionIcon, isFavorite && styles.favoriteIconActive]}>
            {isFavorite ? '❤️' : '🤍'}
          </Text>
          <Text style={[styles.actionText, isFavorite && styles.favoriteTextActive]}>
            {isFavorite ? 'お気に入り済み' : 'お気に入り'}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.actionButton, copied && styles.copiedActive]}
          onPress={handleCopy}
          testID="copy-button"
          accessibilityLabel="コピー"
        >
          <Text style={styles.actionIcon}>{copied ? '✓' : '📋'}</Text>
          <Text style={[styles.actionText, copied && styles.copiedText]}>
            {copied ? 'コピーしました' : 'コピー'}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const { width } = Dimensions.get('window');

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 24,
    marginHorizontal: 16,
    marginVertical: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  categoryBadge: {
    backgroundColor: '#4A90D9',
    alignSelf: 'flex-start',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
    marginBottom: 16,
  },
  categoryText: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: '600',
  },
  quoteText: {
    fontSize: 18,
    lineHeight: 28,
    color: '#333333',
    marginBottom: 16,
  },
  authorText: {
    fontSize: 14,
    color: '#666666',
    fontStyle: 'italic',
    textAlign: 'right',
    marginBottom: 20,
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
    paddingTop: 16,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    backgroundColor: '#f5f5f5',
  },
  favoriteActive: {
    backgroundColor: '#fff0f0',
  },
  copiedActive: {
    backgroundColor: '#f0fff0',
  },
  actionIcon: {
    fontSize: 16,
    marginRight: 6,
  },
  favoriteIconActive: {
    color: '#ff4444',
  },
  actionText: {
    fontSize: 14,
    color: '#666666',
  },
  favoriteTextActive: {
    color: '#ff4444',
  },
  copiedText: {
    color: '#44aa44',
  },
});
