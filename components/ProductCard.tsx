import React from 'react';
import { View, StyleSheet, Pressable, Image } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { ThemedText } from '@/components/ThemedText';
import { Product } from '@/data/types';
import { Colors, Spacing, BorderRadius, Shadows } from '@/constants/theme';

interface ProductCardProps {
  product: Product;
  onPress: () => void;
  onWishlistPress: () => void;
}

export function ProductCard({ product, onPress, onWishlistPress }: ProductCardProps) {
  return (
    <Pressable
      style={({ pressed }) => [
        styles.container,
        pressed && styles.pressed,
      ]}
      onPress={onPress}
    >
      <View style={styles.imageContainer}>
        <View style={styles.placeholder} />
        <Pressable style={styles.wishlistButton} onPress={onWishlistPress}>
          <Feather
            name={product.isWishlisted ? 'heart' : 'heart'}
            size={20}
            color={product.isWishlisted ? Colors.light.error : Colors.light.textGray}
            fill={product.isWishlisted ? Colors.light.error : 'transparent'}
          />
        </Pressable>
        {product.discount > 0 && (
          <View style={styles.discountBadge}>
            <ThemedText style={styles.discountText}>{product.discount}% OFF</ThemedText>
          </View>
        )}
      </View>

      <View style={styles.content}>
        <ThemedText type="caption" style={styles.brand}>
          {product.brand}
        </ThemedText>
        <ThemedText type="small" numberOfLines={2} style={styles.name}>
          {product.name}
        </ThemedText>
        
        <View style={styles.ratingContainer}>
          <Feather name="star" size={12} color={Colors.light.warning} fill={Colors.light.warning} />
          <ThemedText type="caption" style={styles.rating}>
            {product.rating} ({product.reviewCount})
          </ThemedText>
        </View>

        <View style={styles.priceContainer}>
          <ThemedText style={styles.price}>₹{product.price}</ThemedText>
          <ThemedText type="caption" style={styles.mrp}>₹{product.mrp}</ThemedText>
        </View>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    margin: Spacing.sm,
    backgroundColor: Colors.light.backgroundRoot,
    borderRadius: BorderRadius.sm,
    ...Shadows.small,
  },
  pressed: {
    opacity: 0.95,
    transform: [{ scale: 0.98 }],
  },
  imageContainer: {
    position: 'relative',
    aspectRatio: 1,
    borderTopLeftRadius: BorderRadius.sm,
    borderTopRightRadius: BorderRadius.sm,
    overflow: 'hidden',
  },
  placeholder: {
    width: '100%',
    height: '100%',
    backgroundColor: Colors.light.backgroundSecondary,
  },
  wishlistButton: {
    position: 'absolute',
    top: Spacing.sm,
    right: Spacing.sm,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: Colors.light.backgroundRoot,
    justifyContent: 'center',
    alignItems: 'center',
    ...Shadows.small,
  },
  discountBadge: {
    position: 'absolute',
    bottom: Spacing.sm,
    left: Spacing.sm,
    backgroundColor: Colors.light.success,
    paddingHorizontal: Spacing.sm,
    paddingVertical: 2,
    borderRadius: 4,
  },
  discountText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: '700',
  },
  content: {
    padding: Spacing.md,
  },
  brand: {
    color: Colors.light.textGray,
    marginBottom: 2,
  },
  name: {
    marginBottom: Spacing.xs,
    fontWeight: '500',
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.sm,
  },
  rating: {
    marginLeft: 4,
    color: Colors.light.textGray,
  },
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  price: {
    fontSize: 16,
    fontWeight: '700',
    color: Colors.light.text,
    marginRight: Spacing.sm,
  },
  mrp: {
    textDecorationLine: 'line-through',
    color: Colors.light.textGray,
  },
});
