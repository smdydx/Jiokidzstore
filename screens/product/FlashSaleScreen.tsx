import React from 'react';
import { View, StyleSheet } from 'react-native';
import { ScreenFlatList } from '@/components/ScreenFlatList';
import { ThemedText } from '@/components/ThemedText';
import { ProductCard } from '@/components/ProductCard';
import { Colors, Spacing } from '@/constants/theme';
import { PRODUCTS } from '@/data/mockData';

export default function FlashSaleScreen() {
  return (
    <ScreenFlatList
      ListHeaderComponent={
        <View style={styles.header}>
          <ThemedText type="h2" style={styles.title}>Flash Sale</ThemedText>
          <ThemedText style={styles.subtitle}>Up to 60% OFF - Limited Time!</ThemedText>
        </View>
      }
      data={PRODUCTS}
      numColumns={2}
      keyExtractor={(item) => item.id}
      contentContainerStyle={styles.grid}
      renderItem={({ item }) => (
        <View style={styles.productItem}>
          <ProductCard product={item} onPress={() => {}} onWishlistPress={() => {}} />
        </View>
      )}
    />
  );
}

const styles = StyleSheet.create({
  header: { padding: Spacing.lg },
  title: { color: Colors.light.primary },
  subtitle: { color: Colors.light.textGray, marginTop: 4 },
  grid: { padding: Spacing.sm },
  productItem: { width: '50%' },
});
