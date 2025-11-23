
import React from "react";
import { StyleSheet, Pressable, Image, View } from "react-native";
import { Feather } from "@expo/vector-icons";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";

import { ThemedText } from "@/components/ThemedText";
import { useTheme } from "@/hooks/useTheme";
import { useResponsive } from "@/hooks/useResponsive";
import { Product } from "@/data/types";
import { BorderRadius } from "@/constants/theme";

interface ProductCardProps {
  product: Product;
  onPress: () => void;
  onWishlistPress?: () => void;
  isWishlisted?: boolean;
}

export function ProductCard({
  product,
  onPress,
  onWishlistPress,
  isWishlisted = false,
}: ProductCardProps) {
  const { theme } = useTheme();
  const { width } = useResponsive();
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const handlePressIn = () => {
    scale.value = withSpring(0.97);
  };

  const handlePressOut = () => {
    scale.value = withSpring(1);
  };

  const cardWidth = width / 2;
  const imageHeight = cardWidth;

  const discount = Math.round(
    ((product.originalPrice - product.price) / product.originalPrice) * 100
  );

  return (
    <Animated.View style={[animatedStyle, { width: cardWidth }]}>
      <Pressable
        onPress={onPress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        style={styles.container}
      >
        <View style={[styles.imageContainer, { height: imageHeight }]}>
          <Image source={{ uri: product.image }} style={styles.image} />
          {discount > 0 && (
            <View style={styles.discountBadge}>
              <ThemedText style={styles.discountText}>{discount}% OFF</ThemedText>
            </View>
          )}
          {onWishlistPress && (
            <Pressable onPress={onWishlistPress} style={styles.wishlistButton}>
              <Feather
                name="heart"
                size={18}
                color={isWishlisted ? "#EF4444" : "#6B7280"}
                fill={isWishlisted ? "#EF4444" : "transparent"}
              />
            </Pressable>
          )}
        </View>

        <View style={styles.infoContainer}>
          <ThemedText style={styles.brandText} numberOfLines={1}>
            {product.brand}
          </ThemedText>
          <ThemedText style={styles.nameText} numberOfLines={2}>
            {product.name}
          </ThemedText>

          <View style={styles.priceRow}>
            <ThemedText style={styles.priceText}>₹{product.price}</ThemedText>
            {product.originalPrice > product.price && (
              <ThemedText style={styles.originalPriceText}>
                ₹{product.originalPrice}
              </ThemedText>
            )}
          </View>

          <View style={styles.ratingRow}>
            <Feather name="star" size={12} color="#F59E0B" fill="#F59E0B" />
            <ThemedText style={styles.ratingText}>
              {product.rating}
            </ThemedText>
            <ThemedText style={styles.reviewsText}>
              ({product.reviews})
            </ThemedText>
          </View>
        </View>
      </Pressable>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFFFFF',
    padding: 8,
  },
  imageContainer: {
    width: '100%',
    backgroundColor: '#F9FAFB',
    borderRadius: 12,
    overflow: 'hidden',
    position: 'relative',
  },
  image: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  discountBadge: {
    position: 'absolute',
    top: 8,
    left: 8,
    backgroundColor: '#10B981',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  discountText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  wishlistButton: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  infoContainer: {
    paddingTop: 8,
    paddingHorizontal: 4,
  },
  brandText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#6B7280',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 4,
  },
  nameText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#1F2937',
    lineHeight: 18,
    marginBottom: 6,
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 4,
  },
  priceText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1F2937',
  },
  originalPriceText: {
    fontSize: 13,
    fontWeight: '500',
    color: '#9CA3AF',
    textDecorationLine: 'line-through',
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  ratingText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#1F2937',
  },
  reviewsText: {
    fontSize: 12,
    color: '#6B7280',
  },
});
