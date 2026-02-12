import React, { useState, useCallback } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, RefreshControl } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { QuoteCard } from '@/components/QuoteCard';
import { getDailyQuote, getRandomQuote, Quote } from '@/data/quotes';
import { useFavorites } from '@/hooks/useFavorites';

export default function HomeScreen() {
  const [quote, setQuote] = useState<Quote>(getDailyQuote());
  const [refreshing, setRefreshing] = useState(false);
  const { isFavorite, toggleFavorite, error } = useFavorites();

  const handleNewQuote = useCallback(() => {
    setQuote(getRandomQuote());
  }, []);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    setQuote(getRandomQuote());
    setRefreshing(false);
  }, []);

  const handleToggleFavorite = useCallback(async () => {
    try {
      await toggleFavorite(quote.id);
    } catch (e) {
      console.error('Failed to toggle favorite:', e);
    }
  }, [quote.id, toggleFavorite]);

  return (
    <SafeAreaView style={styles.container} edges={['bottom']}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        <View style={styles.header}>
          <Text style={styles.greeting}>こんにちは！</Text>
          <Text style={styles.subtitle}>今日の名言をお届けします</Text>
        </View>

        {error && (
          <View style={styles.errorContainer}>
            <Text style={styles.errorText}>{error}</Text>
          </View>
        )}

        <QuoteCard
          quote={quote}
          isFavorite={isFavorite(quote.id)}
          onToggleFavorite={handleToggleFavorite}
        />

        <TouchableOpacity
          style={styles.newQuoteButton}
          onPress={handleNewQuote}
          testID="new-quote-button"
          accessibilityLabel="新しい名言を表示"
        >
          <Text style={styles.newQuoteButtonText}>🔄 新しい名言</Text>
        </TouchableOpacity>

        <View style={styles.tip}>
          <Text style={styles.tipText}>💡 ヒント: 下に引っ張って新しい名言を表示</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
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
  greeting: {
    fontSize: 28,
    fontWeight: '700',
    color: '#333333',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 16,
    color: '#666666',
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
  newQuoteButton: {
    backgroundColor: '#4A90D9',
    marginHorizontal: 16,
    marginTop: 16,
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
    shadowColor: '#4A90D9',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  newQuoteButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
  tip: {
    marginTop: 24,
    paddingHorizontal: 16,
    alignItems: 'center',
  },
  tipText: {
    fontSize: 14,
    color: '#888888',
  },
});
