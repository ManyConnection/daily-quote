import { Tabs } from 'expo-router';
import { Text, StyleSheet } from 'react-native';

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: '#4A90D9',
        tabBarInactiveTintColor: '#888888',
        tabBarStyle: {
          backgroundColor: '#ffffff',
          borderTopWidth: 1,
          borderTopColor: '#f0f0f0',
          paddingTop: 4,
          paddingBottom: 8,
          height: 60,
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '500',
        },
        headerStyle: {
          backgroundColor: '#4A90D9',
        },
        headerTintColor: '#ffffff',
        headerTitleStyle: {
          fontWeight: '600',
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: '今日の名言',
          tabBarIcon: ({ color }) => (
            <Text style={[styles.icon, { color }]}>📜</Text>
          ),
        }}
      />
      <Tabs.Screen
        name="categories"
        options={{
          title: 'カテゴリ',
          tabBarIcon: ({ color }) => (
            <Text style={[styles.icon, { color }]}>📂</Text>
          ),
        }}
      />
      <Tabs.Screen
        name="favorites"
        options={{
          title: 'お気に入り',
          tabBarIcon: ({ color }) => (
            <Text style={[styles.icon, { color }]}>❤️</Text>
          ),
        }}
      />
      <Tabs.Screen
        name="myquotes"
        options={{
          title: 'マイ名言',
          tabBarIcon: ({ color }) => (
            <Text style={[styles.icon, { color }]}>✍️</Text>
          ),
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  icon: {
    fontSize: 24,
  },
});
