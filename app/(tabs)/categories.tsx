import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { CategoryCard } from '@/components/CategoryCard';
import { Category, categoryLabels, quotes } from '@/data/quotes';

const categories: Category[] = ['life', 'work', 'love', 'friendship', 'wisdom', 'courage', 'happiness', 'success'];

export default function CategoriesScreen() {
  const router = useRouter();

  const handleCategoryPress = (category: Category) => {
    router.push(`/category/${category}`);
  };

  return (
    <SafeAreaView style={styles.container} edges={['bottom']}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <Text style={styles.title}>カテゴリ別名言</Text>
          <Text style={styles.subtitle}>全{quotes.length}件の名言</Text>
        </View>

        {categories.map((category) => (
          <CategoryCard
            key={category}
            category={category}
            onPress={() => handleCategoryPress(category)}
          />
        ))}

        <View style={styles.footer}>
          <Text style={styles.footerText}>気になるカテゴリをタップしてください</Text>
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
  footer: {
    marginTop: 16,
    paddingHorizontal: 16,
    alignItems: 'center',
  },
  footerText: {
    fontSize: 14,
    color: '#888888',
  },
});
