import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams, Stack } from 'expo-router';
import { QuoteCard } from '@/components/QuoteCard';
import { Category, categoryLabels, getQuotesByCategory } from '@/data/quotes';
import { useFavorites } from '@/hooks/useFavorites';

export default function CategoryScreen() {
  const { id } = useLocalSearchParams<{ id: Category }>();
  const { isFavorite, toggleFavorite, error } = useFavorites();

  const category = id as Category;
  const categoryQuotes = getQuotesByCategory(category);
  const categoryLabel = categoryLabels[category] || category;

  return (
    <>
      <Stack.Screen
        options={{
          title: categoryLabel,
        }}
      />
      <SafeAreaView style={styles.container} edges={['bottom']}>
        <ScrollView contentContainerStyle={styles.scrollContent}>
          <View style={styles.header}>
            <Text style={styles.title}>{categoryLabel}の名言</Text>
            <Text style={styles.subtitle}>{categoryQuotes.length}件</Text>
          </View>

          {error && (
            <View style={styles.errorContainer}>
              <Text style={styles.errorText}>{error}</Text>
            </View>
          )}

          {categoryQuotes.map((quote) => (
            <QuoteCard
              key={quote.id}
              quote={quote}
              isFavorite={isFavorite(quote.id)}
              onToggleFavorite={() => toggleFavorite(quote.id)}
              showCategory={false}
            />
          ))}
        </ScrollView>
      </SafeAreaView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  scrollContent: {
    flexGrow: 1,
    paddingVertical: 16,
  },
  header: {
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: '#333333',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    color: '#888888',
  },
  errorContainer: {
    backgroundColor: '#ffebee',
    padding: 12,
    marginHorizontal: 16,
    marginBottom: 8,
    borderRadius: 8,
  },
  errorText: {
    color: '#c62828',
    fontSize: 14,
    textAlign: 'center',
  },
});
