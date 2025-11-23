
import React, { useState, useRef } from 'react';
import { View, StyleSheet, Pressable, Image, Dimensions, FlatList, Platform } from 'react-native';
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
import { ModernHeroSection } from '@/components/ModernHeroSection';
import { BadgeLabel } from '@/components/BadgeLabel';
import { EnhancedButton } from '@/components/EnhancedButton';
import { BestSellersCarousel } from '@/components/BestSellersCarousel';
import { PersonalizedSection } from '@/components/PersonalizedSection';
import { TestimonialsSection } from '@/components/TestimonialsSection';
import { TwoColumnPromo } from '@/components/TwoColumnPromo';
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
    navigation.navigate('HomeTab', {
      screen: 'HomeStack',
      params: {
        screen: 'ProductDetail',
        params: { productId }
      }
    } as any);
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
    <ScreenScrollView contentContainerStyle={styles.scrollContent}>
      {/* Modern Header */}
      <ModernHeader notificationCount={2} />

      {/* Modern Search Bar */}
      <ModernSearchBar onSearch={handleSearchPress} />

      {/* Modern Hero Section */}
      <ModernHeroSection
        onSlidePress={() => {}}
        onButtonPress={() => navigation.navigate('FlashSale')}
      />

      {/* Two Column Promo Section */}
      <TwoColumnPromo 
        onLeftPress={() => navigation.navigate('DealsTab' as any)}
        onRightPress={() => navigation.navigate('DealsTab' as any)}
      />

      {/* Promotional Banner */}
      <View style={styles.promoBanner}>
        <LinearGradient
          colors={['#FFB6D9', '#FF8FB3']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.promoBannerGradient}
        >
          <View>
            <BadgeLabel label="Limited Time Offer" type="hot" />
            <ThemedText style={styles.promoBannerText}>Free Shipping on Orders Above ₹499</ThemedText>
          </View>
          <Pressable>
            <Feather name="arrow-right" size={24} color="#FFFFFF" />
          </Pressable>
        </LinearGradient>
      </View>

      {/* Categories */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <ThemedText style={styles.sectionTitle}>Shop by Category</ThemedText>
          <Pressable onPress={() => navigation.navigate('DealsTab' as any)}>
            <ThemedText style={styles.seeAllText}>View All</ThemedText>
          </Pressable>
        </View>
        <FlatList
          data={CATEGORIES}
          renderItem={({ item }) => (
            <ModernCategory
              category={item}
              onPress={() => handleCategoryPress(item.id, item.name)}
            />
          )}
          keyExtractor={(item) => item.id}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.categoriesList}
        />
      </View>

      {/* Flash Sale Section */}
      <Pressable style={styles.flashSaleBanner} onPress={() => navigation.navigate('FlashSale')}>
        <LinearGradient
          colors={['#FF6B9D', '#FFA8C5']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={styles.flashGradient}
        >
          <View style={styles.flashLeft}>
            <View style={styles.flashIcon}>
              <Feather name="zap" size={24} color="#FFFFFF" />
            </View>
            <View>
              <ThemedText style={styles.flashTitle}>Flash Sale</ThemedText>
              <ThemedText style={styles.flashSubtitle}>Limited offers today</ThemedText>
            </View>
          </View>
          <Feather name="chevron-right" size={24} color="#FFFFFF" />
        </LinearGradient>
      </Pressable>

      {/* Best Sellers Carousel */}
      <BestSellersCarousel onProductPress={handleProductPress} />

      {/* Personalized Section */}
      <PersonalizedSection onItemPress={() => navigation.navigate('DealsTab' as any)} />

      {/* Testimonials Section */}
      <TestimonialsSection />

      {/* Trending Products */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <ThemedText style={styles.sectionTitle}>Trending Now</ThemedText>
          <Pressable>
            <ThemedText style={styles.seeAllText}>View All</ThemedText>
          </Pressable>
        </View>
        <View style={styles.productsGrid}>
          {products.slice(0, 6).map(product => (
            <ProductCard
              key={product.id}
              product={product}
              onPress={() => handleProductPress(product.id)}
              onWishlistPress={() => handleWishlistToggle(product.id)}
            />
          ))}
        </View>
      </View>

      {/* Floating Cart */}
      <Pressable
        style={styles.cartFAB}
        onPress={() => navigation.navigate('Cart')}
      >
        <LinearGradient
          colors={['#FF6B9D', '#FF8FB3']}
          style={styles.cartFABGradient}
        >
          <Feather name="shopping-cart" size={24} color="#FFFFFF" />
          <View style={styles.cartBadge}>
            <ThemedText style={styles.cartBadgeText}>3</ThemedText>
          </View>
        </LinearGradient>
      </Pressable>
    </ScreenScrollView>
  );
}

const styles = StyleSheet.create({
  scrollContent: {
    flexGrow: 1,
    paddingBottom: 120,
    paddingTop: 0,
  },
  section: {
    marginBottom: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1F2937',
  },
  seeAllText: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.light.primary,
  },
  promoBanner: {
    marginHorizontal: 16,
    marginBottom: 24,
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 5,
  },
  promoBannerGradient: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  promoBannerText: {
    fontSize: 15,
    fontWeight: '700',
    color: '#FFFFFF',
    marginTop: 8,
  },
  categoriesList: {
    paddingHorizontal: 16,
  },
  flashSaleBanner: {
    marginHorizontal: 16,
    marginBottom: 24,
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  flashGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 20,
  },
  flashLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  flashIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  flashTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  flashSubtitle: {
    fontSize: 13,
    color: '#FFFFFF',
    opacity: 0.9,
    marginTop: 2,
  },
  productsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  cartFAB: {
    position: 'relative',
    alignSelf: 'flex-end',
    width: 64,
    height: 64,
    borderRadius: 32,
    marginRight: 16,
    marginTop: -70,
    marginBottom: 16,
    overflow: 'visible',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
    zIndex: 999,
  },
  cartFABGradient: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 32,
  },
  cartBadge: {
    position: 'absolute',
    top: -4,
    right: -4,
    minWidth: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#EF4444',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 6,
    borderWidth: 3,
    borderColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  cartBadgeText: {
    fontSize: 12,
    fontWeight: '800',
    color: '#FFFFFF',
    lineHeight: 14,
  },
});
