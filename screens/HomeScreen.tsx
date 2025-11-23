
import React, { useState, useRef } from 'react';
import { View, StyleSheet, Pressable, Image, Dimensions, FlatList, Platform } from 'react-native';
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

const { width } = Dimensions.get('window');

const HERO_SLIDES = [
  {
    id: '1',
    title: 'Big Sale',
    subtitle: 'Up to 60% OFF on Kids Fashion',
    image: 'https://images.unsplash.com/photo-1503944583220-79d8926ad5e2?w=800',
    buttonText: 'Shop Now',
  },
  {
    id: '2',
    title: 'New Arrivals',
    subtitle: 'Latest Toys Collection',
    image: 'https://images.unsplash.com/photo-1515488042361-ee00e0ddd4e4?w=800',
    buttonText: 'Explore',
  },
  {
    id: '3',
    title: 'Baby Essentials',
    subtitle: 'Everything for Your Little One',
    image: 'https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?w=800',
    buttonText: 'Shop Baby',
  },
];

export default function HomeScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<HomeStackParamList>>();
  const { theme } = useTheme();
  const [products, setProducts] = useState(PRODUCTS);
  const [activeSlide, setActiveSlide] = useState(0);
  const heroScrollRef = useRef<FlatList>(null);

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

  const onViewableItemsChanged = useRef(({ viewableItems }: any) => {
    if (viewableItems.length > 0) {
      setActiveSlide(viewableItems[0].index || 0);
    }
  }).current;

  const renderHeroSlide = ({ item }: any) => (
    <View style={styles.heroSlide}>
      <Image source={{ uri: item.image }} style={styles.heroImage} />
      <LinearGradient
        colors={['rgba(255, 107, 157, 0.1)', 'rgba(255, 107, 157, 0.9)']}
        style={styles.heroOverlay}
      >
        <View style={styles.heroContent}>
          <ThemedText style={styles.heroTitle}>{item.title}</ThemedText>
          <ThemedText style={styles.heroSubtitle}>{item.subtitle}</ThemedText>
          <LinearGradient
            colors={['#FFFFFF', '#FFF8FA']}
            style={styles.heroButton}
          >
            <ThemedText style={styles.heroButtonText}>{item.buttonText}</ThemedText>
            <Feather name="arrow-right" size={18} color={Colors.light.primary} />
          </LinearGradient>
        </View>
      </LinearGradient>
    </View>
  );

  return (
    <ScreenScrollView contentContainerStyle={styles.scrollContent}>
      {/* Hero Slider */}
      <View style={styles.heroSection}>
        <FlatList
          ref={heroScrollRef}
          data={HERO_SLIDES}
          renderItem={renderHeroSlide}
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          onViewableItemsChanged={onViewableItemsChanged}
          viewabilityConfig={{ itemVisiblePercentThreshold: 50 }}
          snapToInterval={width}
          decelerationRate="fast"
        />
        <View style={styles.pagination}>
          {HERO_SLIDES.map((_, index) => (
            <View
              key={index}
              style={[
                styles.paginationDot,
                activeSlide === index && styles.paginationDotActive,
              ]}
            />
          ))}
        </View>
      </View>

      {/* Categories */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <ThemedText style={styles.sectionTitle}>Categories</ThemedText>
          <Pressable onPress={() => navigation.navigate('HomeTab', { screen: 'CategoriesTab' } as any)}>
            <ThemedText style={styles.seeAllText}>See All</ThemedText>
          </Pressable>
        </View>
        <FlatList
          data={CATEGORIES}
          renderItem={({ item }) => (
            <CategoryCircle
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

      {/* Flash Sale */}
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
              <ThemedText style={styles.flashSubtitle}>Up to 60% OFF</ThemedText>
            </View>
          </View>
          <Feather name="chevron-right" size={24} color="#FFFFFF" />
        </LinearGradient>
      </Pressable>

      {/* Trending Products */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <ThemedText style={styles.sectionTitle}>Trending Now</ThemedText>
          <Pressable>
            <ThemedText style={styles.seeAllText}>View All</ThemedText>
          </Pressable>
        </View>
        <View style={styles.productsGrid}>
          {products.map(product => (
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
    paddingBottom: 100,
  },
  heroSection: {
    marginBottom: 24,
  },
  heroSlide: {
    width: width,
    height: 280,
    position: 'relative',
  },
  heroImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  heroOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: '100%',
    justifyContent: 'flex-end',
    paddingHorizontal: 24,
    paddingBottom: 32,
  },
  heroContent: {
    gap: 8,
  },
  heroTitle: {
    fontSize: 32,
    fontWeight: '800',
    color: '#FFFFFF',
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  heroSubtitle: {
    fontSize: 16,
    color: '#FFFFFF',
    fontWeight: '500',
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  heroButton: {
    alignSelf: 'flex-start',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 24,
    marginTop: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 6,
  },
  heroButtonText: {
    fontSize: 15,
    fontWeight: '700',
    color: Colors.light.primary,
  },
  pagination: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 12,
    gap: 6,
  },
  paginationDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#D1D5DB',
  },
  paginationDotActive: {
    width: 20,
    backgroundColor: Colors.light.primary,
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
    position: 'absolute',
    bottom: 24,
    right: 16,
    width: 64,
    height: 64,
    borderRadius: 32,
    overflow: 'visible',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
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
