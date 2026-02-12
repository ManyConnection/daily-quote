import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Category, categoryLabels, getQuotesByCategory } from '@/data/quotes';

interface CategoryCardProps {
  category: Category;
  onPress: () => void;
}

const categoryEmojis: Record<Category, string> = {
  life: '🌱',
  work: '💼',
  love: '❤️',
  friendship: '🤝',
  wisdom: '📚',
  courage: '🦁',
  happiness: '😊',
  success: '🏆',
};

const categoryColors: Record<Category, string> = {
  life: '#4CAF50',
  work: '#2196F3',
  love: '#E91E63',
  friendship: '#FF9800',
  wisdom: '#9C27B0',
  courage: '#F44336',
  happiness: '#FFEB3B',
  success: '#00BCD4',
};

export const CategoryCard: React.FC<CategoryCardProps> = ({ category, onPress }) => {
  const quoteCount = getQuotesByCategory(category).length;

  return (
    <TouchableOpacity
      style={[styles.card, { borderLeftColor: categoryColors[category] }]}
      onPress={onPress}
      testID={`category-${category}`}
      accessibilityLabel={`${categoryLabels[category]}カテゴリ`}
    >
      <Text style={styles.emoji}>{categoryEmojis[category]}</Text>
      <View style={styles.content}>
        <Text style={styles.title}>{categoryLabels[category]}</Text>
        <Text style={styles.count}>{quoteCount}件の名言</Text>
      </View>
      <Text style={styles.arrow}>›</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 16,
    marginHorizontal: 16,
    marginVertical: 6,
    borderLeftWidth: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  emoji: {
    fontSize: 32,
    marginRight: 16,
  },
  content: {
    flex: 1,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333333',
    marginBottom: 4,
  },
  count: {
    fontSize: 14,
    color: '#888888',
  },
  arrow: {
    fontSize: 24,
    color: '#cccccc',
    fontWeight: '300',
  },
});
