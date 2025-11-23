import React from 'react';
import { View, StyleSheet } from 'react-native';
import { ScreenFlatList } from '@/components/ScreenFlatList';
import { ProductCard } from '@/components/ProductCard';
import { Colors, Spacing } from '@/constants/theme';
import { PRODUCTS } from '@/data/mockData';

export default function CategoryListingScreen() {
  return (
    <ScreenFlatList
      data={PRODUCTS}
      numColumns={2}
      keyExtractor={(item) => item.id}
      contentContainerStyle={styles.grid}
      renderItem={({ item }) => (
        <View style={styles.productItem}>
          <ProductCard
            product={item}
            onPress={() => {}}
            onWishlistPress={() => {}}
          />
        </View>
      )}
    />
  );
}

const styles = StyleSheet.create({
  grid: { padding: Spacing.sm },
  productItem: { width: '50%' },
});
