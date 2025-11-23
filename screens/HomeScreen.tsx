import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, Pressable, TextInput } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Feather } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { ScreenScrollView } from '@/components/ScreenScrollView';
import { ThemedText } from '@/components/ThemedText';
import { ProductCard } from '@/components/ProductCard';
import { CategoryCircle } from '@/components/CategoryCircle';
import { useTheme } from '@/hooks/useTheme';
import { Colors, Spacing, BorderRadius } from '@/constants/theme';
import { PRODUCTS, CATEGORIES } from '@/data/mockData';
import { wishlistStorage } from '@/utils/storage';
import type { HomeStackParamList } from '@/navigation/HomeStackNavigator';

export default function HomeScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<HomeStackParamList>>();
  const { theme } = useTheme();
  const [products, setProducts] = useState(PRODUCTS);

  const handleProductPress = (productId: string) => {
    navigation.navigate('ProductDetail', { productId });
  };

  const handleWishlistToggle = async (productId: string) => {
    const product = products.find(p => p.id === productId);
    if (product) {
      const isWishlisted = await wishlistStorage.isInWishlist(productId);
      if (isWishlisted) {
        await wishlistStorage.removeFromWishlist(productId);
      } else {
        await wishlistStorage.addToWishlist(product);
      }
      
      setProducts(prev =>
        prev.map(p =>
          p.id === productId ? { ...p, isWishlisted: !isWishlisted } : p
        )
      );
    }
  };

  const handleCategoryPress = (categoryId: string, categoryName: string) => {
    navigation.navigate('HomeTab', {
      screen: 'CategoriesTab',
      params: {
        screen: 'CategoryListing',
        params: { categoryId, categoryName },
      },
    } as any);
  };

  const handleSearchPress = () => {
    navigation.navigate('Search');
  };

  return (
    <ScreenScrollView>
      <LinearGradient
        colors={[Colors.light.primary, Colors.light.backgroundSecondary]}
        style={styles.header}
      >
        <View style={styles.headerTop}>
          <View style={styles.locationContainer}>
            <Feather name="map-pin" size={16} color="#FFFFFF" />
            <ThemedText style={styles.locationText}>Deliver to Mumbai</ThemedText>
            <Feather name="chevron-down" size={16} color="#FFFFFF" />
          </View>
          <Pressable style={styles.notificationButton}>
            <Feather name="bell" size={24} color="#FFFFFF" />
            <View style={styles.badge} />
          </Pressable>
        </View>

        <Pressable style={styles.searchBar} onPress={handleSearchPress}>
          <Feather name="search" size={20} color={Colors.light.primary} />
          <ThemedText style={styles.searchPlaceholder}>
            Search for toys, clothes, diapers...
          </ThemedText>
          <Feather name="mic" size={20} color={Colors.light.primary} />
        </Pressable>
      </LinearGradient>

      <View style={styles.categoriesSection}>
        <View style={styles.sectionHeader}>
          <ThemedText type="h3">Shop by Category</ThemedText>
          <Pressable onPress={() => navigation.navigate('HomeTab', { screen: 'CategoriesTab' } as any)}>
            <ThemedText style={styles.seeAll}>See All</ThemedText>
          </Pressable>
        </View>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.categoriesScroll}>
          {CATEGORIES.map(category => (
            <CategoryCircle
              key={category.id}
              category={category}
              onPress={() => handleCategoryPress(category.id, category.name)}
            />
          ))}
        </ScrollView>
      </View>

      <Pressable style={styles.flashSaleBanner} onPress={() => navigation.navigate('FlashSale')}>
        <LinearGradient
          colors={[Colors.light.warning, '#FF6B00']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={styles.flashGradient}
        >
          <View style={styles.flashContent}>
            <Feather name="zap" size={24} color="#FFFFFF" />
            <View style={styles.flashText}>
              <ThemedText style={styles.flashTitle}>Flash Sale</ThemedText>
              <ThemedText type="caption" style={styles.flashSubtitle}>
                Up to 60% OFF • Limited Time!
              </ThemedText>
            </View>
          </View>
          <Feather name="chevron-right" size={24} color="#FFFFFF" />
        </LinearGradient>
      </Pressable>

      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <ThemedText type="h3">Trending Now</ThemedText>
        </View>
        <View style={styles.productsGrid}>
          {products.map(product => (
            <View key={product.id} style={styles.productItem}>
              <ProductCard
                product={product}
                onPress={() => handleProductPress(product.id)}
                onWishlistPress={() => handleWishlistToggle(product.id)}
              />
            </View>
          ))}
        </View>
      </View>

      <Pressable
        style={styles.cartFAB}
        onPress={() => navigation.navigate('Cart')}
      >
        <Feather name="shopping-cart" size={24} color="#FFFFFF" />
        <View style={styles.cartBadge}>
          <ThemedText style={styles.cartBadgeText}>3</ThemedText>
        </View>
      </Pressable>
    </ScreenScrollView>
  );
}

const styles = StyleSheet.create({
  header: {
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.lg,
    paddingBottom: Spacing.xl,
    borderBottomLeftRadius: BorderRadius.lg,
    borderBottomRightRadius: BorderRadius.lg,
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.lg,
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  locationText: {
    color: '#FFFFFF',
    fontWeight: '600',
  },
  notificationButton: {
    position: 'relative',
  },
  badge: {
    position: 'absolute',
    top: 0,
    right: 0,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: Colors.light.error,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: BorderRadius.xs,
    paddingHorizontal: Spacing.lg,
    height: 48,
    gap: Spacing.md,
  },
  searchPlaceholder: {
    flex: 1,
    color: Colors.light.textGray,
  },
  categoriesSection: {
    marginTop: Spacing.xl,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: Spacing.lg,
    marginBottom: Spacing.lg,
  },
  seeAll: {
    color: Colors.light.primary,
    fontWeight: '600',
  },
  categoriesScroll: {
    paddingLeft: Spacing.lg,
  },
  flashSaleBanner: {
    marginHorizontal: Spacing.lg,
    marginVertical: Spacing.xl,
    borderRadius: BorderRadius.sm,
    overflow: 'hidden',
  },
  flashGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: Spacing.lg,
  },
  flashContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
  },
  flashText: {},
  flashTitle: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '700',
  },
  flashSubtitle: {
    color: '#FFFFFF',
  },
  section: {
    marginBottom: Spacing.xl,
  },
  productsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: Spacing.sm,
  },
  productItem: {
    width: '50%',
  },
  cartFAB: {
    position: 'absolute',
    bottom: 90,
    right: Spacing.lg,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: Colors.light.primary,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: Colors.light.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 8,
    elevation: 8,
  },
  cartBadge: {
    position: 'absolute',
    top: -4,
    right: -4,
    minWidth: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: Colors.light.error,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 4,
  },
  cartBadgeText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '700',
  },
});
