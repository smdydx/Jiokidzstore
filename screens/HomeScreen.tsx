import React, { useState, useCallback, useMemo } from 'react';
import { View, StyleSheet, Pressable, FlatList, Platform, useWindowDimensions } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Feather } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { ScreenScrollView } from '@/components/ScreenScrollView';
import { ThemedText } from '@/components/ThemedText';
import { ProductCard } from '@/components/ProductCard';
import { ModernCategory } from '@/components/ModernCategory';
import { ModernHeader } from '@/components/ModernHeader';
import { ModernSearchBar } from '@/components/ModernSearchBar';
import { Colors, Spacing, BorderRadius } from '@/constants/theme';
import { PRODUCTS, CATEGORIES } from '@/data/mockData';
import { wishlistStorage } from '@/utils/storage';
import type { HomeStackParamList } from '@/navigation/HomeStackNavigator';

// Memoized Sections
const HeroCarousel = React.memo(() => (
  <View style={styles.heroContainer}>
    <LinearGradient
      colors={['#FF6B9D', '#FFB6D9', '#FFE5EE']}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={styles.heroGradient}
    >
      <View style={styles.heroContent}>
        <ThemedText type="h1" style={styles.heroTitle}>Summer Collection</ThemedText>
        <ThemedText style={styles.heroSubtitle}>Up to 50% OFF</ThemedText>
      </View>
    </LinearGradient>
  </View>
));

const PromoCard = React.memo(({ title, subtitle, gradient, onPress }: any) => (
  <Pressable style={styles.promoCard} onPress={onPress}>
    <LinearGradient
      colors={gradient}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={styles.promoGradient}
    >
      <View>
        <ThemedText style={styles.promoLabel}>{title}</ThemedText>
        <ThemedText type="h3" style={styles.promoText}>{subtitle}</ThemedText>
      </View>
      <Feather name="arrow-right" size={20} color="#FFFFFF" />
    </LinearGradient>
  </Pressable>
));

const SectionHeader = React.memo(({ title, onViewAll }: any) => (
  <View style={styles.sectionHeader}>
    <ThemedText type="h3" style={styles.sectionTitle}>{title}</ThemedText>
    <Pressable onPress={onViewAll}>
      <ThemedText style={styles.viewAllText}>View All →</ThemedText>
    </Pressable>
  </View>
));

const CategoryScroll = React.memo(({ categories, onCategoryPress }: any) => (
  <View style={styles.categorySection}>
    <FlatList
      data={categories}
      renderItem={({ item }) => (
        <Pressable 
          style={styles.categoryItem}
          onPress={() => onCategoryPress(item.id, item.name)}
        >
          <View style={styles.categoryIconContainer}>
            <View style={styles.categoryIcon} />
          </View>
          <ThemedText style={styles.categoryName}>{item.name}</ThemedText>
        </Pressable>
      )}
      keyExtractor={(item) => item.id}
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.categoryList}
      scrollEventThrottle={16}
    />
  </View>
));

const FlashSaleStrip = React.memo(({ onPress }: any) => (
  <Pressable style={styles.flashSaleContainer} onPress={onPress}>
    <LinearGradient
      colors={['#FF6B9D', '#FF8FB3']}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 0 }}
      style={styles.flashGradient}
    >
      <View style={styles.flashContent}>
        <View style={styles.flashLeft}>
          <Feather name="zap" size={24} color="#FFFFFF" />
          <View>
            <ThemedText style={styles.flashLabel}>Flash Sale</ThemedText>
            <ThemedText style={styles.flashTime}>Ends in 2h 34m</ThemedText>
          </View>
        </View>
        <Feather name="chevron-right" size={20} color="#FFFFFF" />
      </View>
    </LinearGradient>
  </Pressable>
));

const TrendingProducts = React.memo(({ products, onProductPress, onWishlistPress }: any) => (
  <View style={styles.productsSection}>
    <View style={styles.productsGrid}>
      {products.slice(0, 6).map(product => (
        <ProductCard
          key={product.id}
          product={product}
          onPress={() => onProductPress(product.id)}
          onWishlistPress={() => onWishlistPress(product.id)}
        />
      ))}
    </View>
  </View>
));

export default function HomeScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<HomeStackParamList>>();
  const { width } = useWindowDimensions();
  const [products, setProducts] = useState(PRODUCTS);
  const [wishlistedItems, setWishlistedItems] = useState<Set<string>>(new Set());

  const handleProductPress = useCallback((productId: string) => {
    navigation.navigate('HomeTab', {
      screen: 'HomeStack',
      params: {
        screen: 'ProductDetail',
        params: { productId }
      }
    } as any);
  }, [navigation]);

  const handleWishlistToggle = useCallback(async (productId: string) => {
    const isCurrentlyWishlisted = wishlistedItems.has(productId);
    
    try {
      if (isCurrentlyWishlisted) {
        await wishlistStorage.removeFromWishlist(productId);
        setWishlistedItems(prev => {
          const newSet = new Set(prev);
          newSet.delete(productId);
          return newSet;
        });
      } else {
        const product = products.find(p => p.id === productId);
        if (product) {
          await wishlistStorage.addToWishlist(product);
          setWishlistedItems(prev => new Set(prev).add(productId));
        }
      }
    } catch (error) {
      console.error('Wishlist toggle error:', error);
    }
  }, [wishlistedItems, products]);

  const handleCategoryPress = useCallback((categoryId: string, categoryName: string) => {
    navigation.navigate('HomeTab', {
      screen: 'CategoriesTab',
      params: {
        screen: 'CategoryListing',
        params: { categoryId, categoryName },
      },
    } as any);
  }, [navigation]);

  const handleSearchPress = useCallback(() => {
    navigation.navigate('Search');
  }, [navigation]);

  const updatedProducts = useMemo(() => 
    products.map(p => ({
      ...p,
      isWishlisted: wishlistedItems.has(p.id)
    })),
    [products, wishlistedItems]
  );

  return (
    <View style={styles.container}>
      <ModernHeader notificationCount={2} />

      <View style={styles.scrollWrapper}>
        <ScreenScrollView contentContainerStyle={styles.scrollContent}>
          {/* Search Bar */}
          <ModernSearchBar onSearch={handleSearchPress} />

          {/* Hero Carousel */}
          <HeroCarousel />

          {/* Quick Stats */}
          <View style={styles.statsRow}>
            <StatCard icon="truck" label="Free Shipping" value="₹499+" />
            <StatCard icon="shield" label="Safe Shopping" value="Verified" />
            <StatCard icon="award" label="Best Price" value="Guaranteed" />
          </View>

          {/* Categories */}
          <SectionHeader 
            title="Shop by Category" 
            onViewAll={() => navigation.navigate('DealsTab' as any)}
          />
          <CategoryScroll 
            categories={CATEGORIES} 
            onCategoryPress={handleCategoryPress}
          />

          {/* Promo Cards Grid */}
          <View style={styles.promoGrid}>
            <PromoCard
              title="Hot Deal"
              subtitle="Kids Fashion"
              gradient={['#FF6B9D', '#FFB6D9']}
              onPress={() => navigation.navigate('DealsTab' as any)}
            />
            <PromoCard
              title="Trending"
              subtitle="Toys & Games"
              gradient={['#9B59B6', '#C39BD3']}
              onPress={() => navigation.navigate('DealsTab' as any)}
            />
          </View>

          {/* Flash Sale */}
          <SectionHeader 
            title="Flash Sale" 
            onViewAll={() => navigation.navigate('FlashSale' as any)}
          />
          <FlashSaleStrip onPress={() => navigation.navigate('FlashSale' as any)} />

          {/* Trending Products */}
          <SectionHeader 
            title="Trending Now" 
            onViewAll={() => navigation.navigate('DealsTab' as any)}
          />
          <TrendingProducts 
            products={updatedProducts}
            onProductPress={handleProductPress}
            onWishlistPress={handleWishlistToggle}
          />

          {/* Footer Spacer */}
          <View style={styles.footerSpacer} />
        </ScreenScrollView>
      </View>

      {/* Floating Cart Button */}
      <Pressable 
        style={styles.cartFAB}
        onPress={() => navigation.navigate('Cart')}
      >
        <LinearGradient
          colors={['#FF6B9D', '#FF8FB3']}
          style={styles.cartFABGradient}
        >
          <Feather name="shopping-cart" size={22} color="#FFFFFF" />
          <View style={styles.cartBadge}>
            <ThemedText style={styles.cartBadgeText}>3</ThemedText>
          </View>
        </LinearGradient>
      </Pressable>
    </View>
  );
}

const StatCard = React.memo(({ icon, label, value }: any) => (
  <View style={styles.statCard}>
    <View style={styles.statIcon}>
      <Feather name={icon} size={20} color={Colors.light.primary} />
    </View>
    <ThemedText style={styles.statLabel}>{label}</ThemedText>
    <ThemedText style={styles.statValue}>{value}</ThemedText>
  </View>
));

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.light.backgroundRoot,
  },
  scrollWrapper: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingBottom: 140,
  },
  
  // Hero Section
  heroContainer: {
    marginHorizontal: Spacing.lg,
    marginTop: Spacing.lg,
    marginBottom: Spacing.xl,
    borderRadius: BorderRadius.xl,
    overflow: 'hidden',
  },
  heroGradient: {
    paddingVertical: 40,
    paddingHorizontal: Spacing.xl,
    justifyContent: 'center',
  },
  heroContent: {
    gap: Spacing.sm,
  },
  heroTitle: {
    color: '#FFFFFF',
    fontSize: 28,
    fontWeight: '800',
  },
  heroSubtitle: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
    opacity: 0.95,
  },

  // Stats Row
  statsRow: {
    flexDirection: 'row',
    marginHorizontal: Spacing.lg,
    marginBottom: Spacing.xl,
    gap: Spacing.md,
  },
  statCard: {
    flex: 1,
    backgroundColor: '#F8F9FA',
    borderRadius: BorderRadius.md,
    paddingVertical: Spacing.md,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.light.border,
  },
  statIcon: {
    marginBottom: Spacing.xs,
  },
  statLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: Colors.light.textGray,
    marginBottom: Spacing.xs,
  },
  statValue: {
    fontSize: 13,
    fontWeight: '700',
    color: Colors.light.primary,
  },

  // Section Headers
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginHorizontal: Spacing.lg,
    marginBottom: Spacing.md,
    marginTop: Spacing.lg,
  },
  sectionTitle: {
    color: Colors.light.text,
  },
  viewAllText: {
    color: Colors.light.primary,
    fontSize: 13,
    fontWeight: '600',
  },

  // Categories
  categorySection: {
    marginBottom: Spacing.xl,
  },
  categoryList: {
    paddingHorizontal: Spacing.lg,
    gap: Spacing.md,
  },
  categoryItem: {
    alignItems: 'center',
    gap: Spacing.sm,
  },
  categoryIconContainer: {
    width: 68,
    height: 68,
    borderRadius: BorderRadius.lg,
    overflow: 'hidden',
  },
  categoryIcon: {
    flex: 1,
    backgroundColor: '#FFE5EE',
    borderRadius: BorderRadius.lg,
  },
  categoryName: {
    fontSize: 12,
    fontWeight: '600',
    color: Colors.light.text,
    maxWidth: 68,
    textAlign: 'center',
  },

  // Promo Grid
  promoGrid: {
    marginHorizontal: Spacing.lg,
    marginBottom: Spacing.xl,
    gap: Spacing.md,
  },
  promoCard: {
    borderRadius: BorderRadius.lg,
    overflow: 'hidden',
    height: 100,
  },
  promoGradient: {
    flex: 1,
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  promoLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: 'rgba(255, 255, 255, 0.8)',
    marginBottom: Spacing.xs,
  },
  promoText: {
    color: '#FFFFFF',
    fontWeight: '700',
  },

  // Flash Sale
  flashSaleContainer: {
    marginHorizontal: Spacing.lg,
    marginBottom: Spacing.xl,
    borderRadius: BorderRadius.lg,
    overflow: 'hidden',
  },
  flashGradient: {
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
  },
  flashContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  flashLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
  },
  flashLabel: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 2,
  },
  flashTime: {
    color: 'rgba(255, 255, 255, 0.85)',
    fontSize: 12,
    fontWeight: '500',
  },

  // Products Grid
  productsSection: {
    marginHorizontal: Spacing.lg,
    marginBottom: Spacing.lg,
  },
  productsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.md,
  },

  // Footer
  footerSpacer: {
    height: Spacing.xl,
  },

  // FAB
  cartFAB: {
    position: 'absolute',
    bottom: Spacing.xl,
    right: Spacing.lg,
    width: 60,
    height: 60,
    borderRadius: 30,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 12,
    zIndex: 100,
  },
  cartFABGradient: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 30,
  },
  cartBadge: {
    position: 'absolute',
    top: -8,
    right: -8,
    minWidth: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#EF4444',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2.5,
    borderColor: '#FFFFFF',
  },
  cartBadgeText: {
    fontSize: 12,
    fontWeight: '800',
    color: '#FFFFFF',
  },
});
