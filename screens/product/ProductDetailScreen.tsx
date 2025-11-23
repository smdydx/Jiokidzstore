import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, Pressable, Dimensions, Image } from 'react-native';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { Feather } from '@expo/vector-icons';
import { ScreenScrollView } from '@/components/ScreenScrollView';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { Button } from '@/components/Button';
import { ReviewsForm } from './ReviewsForm';
import { useTheme } from '@/hooks/useTheme';
import { Colors, Spacing, BorderRadius, Shadows } from '@/constants/theme';
import { PRODUCTS } from '@/data/mockData';
import { wishlistStorage, cartStorage } from '@/utils/storage';
import type { HomeStackParamList } from '@/navigation/HomeStackNavigator';

const { width } = Dimensions.get('window');

export default function ProductDetailScreen() {
  const navigation = useNavigation();
  const route = useRoute<RouteProp<HomeStackParamList, 'ProductDetail'>>();
  const { theme } = useTheme();
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [selectedColor, setSelectedColor] = useState<string | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [isWishlisted, setIsWishlisted] = useState(false);

  const product = PRODUCTS.find(p => p.id === route.params.productId);

  if (!product) {
    return (
      <View style={styles.errorContainer}>
        <ThemedText>Product not found</ThemedText>
      </View>
    );
  }

  const handleAddToCart = async () => {
    await cartStorage.addToCart({
      id: Date.now().toString(),
      product,
      quantity,
      selectedSize: selectedSize || undefined,
      selectedColor: selectedColor || undefined,
    });
    navigation.navigate('Cart');
  };

  const handleWishlistToggle = async () => {
    if (isWishlisted) {
      await wishlistStorage.removeFromWishlist(product.id);
    } else {
      await wishlistStorage.addToWishlist(product);
    }
    setIsWishlisted(!isWishlisted);
  };

  return (
    <View style={styles.container}>
      <ScreenScrollView>
      <View style={styles.header}>
        <Pressable style={styles.headerButton} onPress={() => navigation.goBack()}>
          <Feather name="arrow-left" size={24} color={Colors.light.text} />
        </Pressable>
        <Pressable style={styles.headerButton} onPress={handleWishlistToggle}>
          <Feather
            name="heart"
            size={24}
            color={isWishlisted ? Colors.light.error : Colors.light.text}
            fill={isWishlisted ? Colors.light.error : 'transparent'}
          />
        </Pressable>
      </View>
        <View style={styles.imageContainer}>
          {product.images && product.images[0] ? (
            <Image 
              source={typeof product.images[0] === 'string' ? { uri: product.images[0] } : product.images[0]} 
              style={styles.image}
            />
          ) : (
            <View style={styles.imagePlaceholder} />
          )}
        </View>

        <View style={styles.content}>
          <ThemedText type="caption" style={styles.brand}>{product.brand}</ThemedText>
          <ThemedText type="h2" style={styles.productName}>{product.name}</ThemedText>

          <View style={styles.ratingContainer}>
            <View style={styles.rating}>
              <Feather name="star" size={16} color={Colors.light.warning} fill={Colors.light.warning} />
              <ThemedText style={styles.ratingText}>{product.rating}</ThemedText>
            </View>
            <ThemedText type="caption" style={styles.reviewCount}>
              ({product.reviewCount} reviews)
            </ThemedText>
          </View>

          <View style={styles.priceContainer}>
            <ThemedText style={styles.price}>₹{product.price}</ThemedText>
            <ThemedText style={styles.mrp}>₹{product.mrp}</ThemedText>
            <View style={styles.discountBadge}>
              <ThemedText style={styles.discountText}>{product.discount}% OFF</ThemedText>
            </View>
          </View>

          {product.sizes && (
            <View style={styles.section}>
              <ThemedText type="h3" style={styles.sectionTitle}>Select Size</ThemedText>
              <View style={styles.optionsContainer}>
                {product.sizes.map(size => (
                  <Pressable
                    key={size}
                    style={[
                      styles.optionButton,
                      selectedSize === size && styles.optionButtonSelected,
                    ]}
                    onPress={() => setSelectedSize(size)}
                  >
                    <ThemedText
                      style={[
                        styles.optionText,
                        selectedSize === size && styles.optionTextSelected,
                      ]}
                    >
                      {size}
                    </ThemedText>
                  </Pressable>
                ))}
              </View>
            </View>
          )}

          {product.colors && (
            <View style={styles.section}>
              <ThemedText type="h3" style={styles.sectionTitle}>Select Color</ThemedText>
              <View style={styles.optionsContainer}>
                {product.colors.map(color => (
                  <Pressable
                    key={color}
                    style={[
                      styles.optionButton,
                      selectedColor === color && styles.optionButtonSelected,
                    ]}
                    onPress={() => setSelectedColor(color)}
                  >
                    <ThemedText
                      style={[
                        styles.optionText,
                        selectedColor === color && styles.optionTextSelected,
                      ]}
                    >
                      {color}
                    </ThemedText>
                  </Pressable>
                ))}
              </View>
            </View>
          )}

          <View style={styles.section}>
            <ThemedText type="h3" style={styles.sectionTitle}>Description</ThemedText>
            <ThemedText style={styles.description}>{product.description}</ThemedText>
          </View>

          {/* Reviews Section */}
          <View style={styles.section}>
            <ReviewsForm productId={product.id} />
          </View>
        </View>
      </ScreenScrollView>

      <View style={styles.footer} pointerEvents="box-none">
        <Button onPress={handleAddToCart} style={styles.addToCartButton}>
          Add to Cart
        </Button>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.light.backgroundRoot,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: Spacing.lg,
    position: 'absolute',
    top: 40,
    left: 0,
    right: 0,
    zIndex: 10,
  },
  headerButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.light.backgroundRoot,
    justifyContent: 'center',
    alignItems: 'center',
    ...Shadows.medium,
  },
  imageContainer: {
    width,
    height: width,
  },
  imagePlaceholder: {
    width: '100%',
    height: '100%',
    backgroundColor: Colors.light.backgroundSecondary,
  },
  content: {
    padding: Spacing.lg,
  },
  brand: {
    color: Colors.light.textGray,
    marginBottom: 4,
  },
  productName: {
    marginBottom: Spacing.md,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.lg,
  },
  rating: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: Spacing.sm,
  },
  ratingText: {
    marginLeft: 4,
    fontWeight: '600',
  },
  reviewCount: {
    color: Colors.light.textGray,
  },
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.xl,
  },
  price: {
    fontSize: 24,
    fontWeight: '700',
    color: Colors.light.primary,
    marginRight: Spacing.md,
  },
  mrp: {
    fontSize: 16,
    textDecorationLine: 'line-through',
    color: Colors.light.textGray,
    marginRight: Spacing.md,
  },
  discountBadge: {
    backgroundColor: Colors.light.success,
    paddingHorizontal: Spacing.sm,
    paddingVertical: 2,
    borderRadius: 4,
  },
  discountText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '700',
  },
  section: {
    marginBottom: Spacing.xl,
  },
  sectionTitle: {
    marginBottom: Spacing.md,
  },
  optionsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.sm,
  },
  optionButton: {
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
    borderWidth: 1,
    borderColor: Colors.light.border,
    borderRadius: BorderRadius.xs,
  },
  optionButtonSelected: {
    backgroundColor: Colors.light.primary,
    borderColor: Colors.light.primary,
  },
  optionText: {
    color: Colors.light.text,
  },
  optionTextSelected: {
    color: '#FFFFFF',
  },
  description: {
    lineHeight: 22,
    color: Colors.light.textGray,
  },
  footer: {
    padding: Spacing.lg,
    paddingBottom: 90,
    backgroundColor: Colors.light.backgroundRoot,
    borderTopWidth: 1,
    borderTopColor: Colors.light.border,
  },
  addToCartButton: {
    width: '100%',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
