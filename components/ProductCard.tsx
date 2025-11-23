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
import { BorderRadius, Shadows } from "@/constants/theme";

interface ProductCardProps {
  product: Product;
  onPress: () => void;
  onWishlistToggle?: () => void;
  isWishlisted?: boolean;
}

export function ProductCard({
  product,
  onPress,
  onWishlistToggle,
  isWishlisted = false,
}: ProductCardProps) {
  const { theme } = useTheme();
  const { width, columns, spacing, fontSize, iconSize } = useResponsive();
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const handlePressIn = () => {
    scale.value = withSpring(0.95);
  };

  const handlePressOut = () => {
    scale.value = withSpring(1);
  };

  // Calculate card width based on columns - exactly 50% with no gaps
  const cardWidth = width / 2;
  const imageHeight = cardWidth; // 1:1 aspect ratio

  const discount = Math.round(
    ((product.originalPrice - product.price) / product.originalPrice) * 100
  );

  return (
    <Animated.View style={[animatedStyle, { width: cardWidth }]}>
      <Pressable
        onPress={onPress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        style={[
          styles.container,
          {
            backgroundColor: theme.backgroundRoot,
            borderRadius: 0,
            padding: 8,
          },
        ]}
      >
        <View style={[styles.imageContainer, { height: imageHeight, borderRadius: BorderRadius.sm }]}>
          <Image source={{ uri: product.image }} style={styles.image} />
          {discount > 0 && (
            <View
              style={[
                styles.discountBadge,
                { backgroundColor: theme.success, borderRadius: BorderRadius.xs },
              ]}
            >
              <ThemedText style={[styles.discountText, { fontSize: fontSize.xs }]}>
                {discount}% OFF
              </ThemedText>
            </View>
          )}
          {onWishlistToggle && (
            <Pressable
              onPress={onWishlistToggle}
              style={[
                styles.wishlistButton,
                { backgroundColor: theme.backgroundRoot, borderRadius: BorderRadius.full },
              ]}
            >
              <Feather
                name={isWishlisted ? "heart" : "heart"}
                size={iconSize * 0.7}
                color={isWishlisted ? theme.error : theme.textGray}
                fill={isWishlisted ? theme.error : "transparent"}
              />
            </Pressable>
          )}
        </View>

        <View style={{ marginTop: spacing.sm }}>
          <ThemedText
            type="caption"
            style={[styles.brand, { color: theme.textGray, fontSize: fontSize.xs }]}
          >
            {product.brand}
          </ThemedText>
          <ThemedText
            numberOfLines={2}
            style={[styles.name, { fontSize: fontSize.sm, marginTop: spacing.xs }]}
          >
            {product.name}
          </ThemedText>

          <View style={[styles.priceRow, { marginTop: spacing.xs }]}>
            <ThemedText style={[styles.price, { color: theme.primary, fontSize: fontSize.md }]}>
              ₹{product.price}
            </ThemedText>
            {product.originalPrice > product.price && (
              <ThemedText
                style={[
                  styles.originalPrice,
                  { color: theme.textGray, fontSize: fontSize.xs },
                ]}
              >
                ₹{product.originalPrice}
              </ThemedText>
            )}
          </View>

          <View style={[styles.rating, { marginTop: spacing.xs }]}>
            <Feather name="star" size={iconSize * 0.6} color={theme.warning} fill={theme.warning} />
            <ThemedText style={[styles.ratingText, { fontSize: fontSize.xs }]}>
              {product.rating} ({product.reviews})
            </ThemedText>
          </View>
        </View>
      </Pressable>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 1,
  },
  imageContainer: {
    width: "100%",
    overflow: "hidden",
    backgroundColor: "#F3F4F6",
  },
  image: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },
  discountBadge: {
    position: "absolute",
    top: 6,
    left: 6,
    paddingHorizontal: 6,
    paddingVertical: 3,
  },
  discountText: {
    color: "#FFFFFF",
    fontWeight: "600",
    fontSize: 10,
  },
  wishlistButton: {
    position: "absolute",
    top: 6,
    right: 6,
    width: 28,
    height: 28,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  brand: {
    textTransform: "uppercase",
    fontSize: 10,
    letterSpacing: 0.5,
  },
  name: {
    fontWeight: "500",
    lineHeight: 18,
  },
  priceRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  price: {
    fontWeight: "700",
  },
  originalPrice: {
    textDecorationLine: "line-through",
  },
  rating: {
    flexDirection: "row",
    alignItems: "center",
    gap: 2,
  },
  ratingText: {
    marginLeft: 2,
  },
});