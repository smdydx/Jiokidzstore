
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

  const onViewableItemsChanged = useRef(({ viewableItems }: any) => {
    if (viewableItems.length > 0) {
      setActiveSlide(viewableItems[0].index || 0);
    }
  }).current;

  const renderHeroSlide = ({ item }: any) => (
    <View style={styles.heroSlide}>
      <Image source={{ uri: item.image }} style={styles.heroImage} />
      <LinearGradient
        colors={['transparent', 'rgba(0,0,0,0.7)']}
        style={styles.heroOverlay}
      >
        <View style={styles.heroContent}>
          <ThemedText style={styles.heroTitle}>{item.title}</ThemedText>
          <ThemedText style={styles.heroSubtitle}>{item.subtitle}</ThemedText>
          <Pressable style={styles.heroButton}>
            <ThemedText style={styles.heroButtonText}>{item.buttonText}</ThemedText>
          </Pressable>
        </View>
      </LinearGradient>
    </View>
  );

  return (
    <ScreenScrollView contentContainerStyle={styles.scrollContent}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerTop}>
          <View style={styles.locationContainer}>
            <Feather name="map-pin" size={16} color={Colors.light.primary} />
            <ThemedText style={styles.locationText}>Mumbai</ThemedText>
            <Feather name="chevron-down" size={14} color={Colors.light.textGray} />
          </View>
          <View style={styles.headerActions}>
            <Pressable style={styles.iconButton}>
              <Feather name="bell" size={22} color={Colors.light.text} />
              <View style={styles.notificationDot} />
            </Pressable>
          </View>
        </View>

        <Pressable style={styles.searchBar} onPress={handleSearchPress}>
          <Feather name="search" size={20} color={Colors.light.textGray} />
          <ThemedText style={styles.searchPlaceholder}>
            Search for toys, clothes, diapers...
          </ThemedText>
        </Pressable>
      </View>

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
  header: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  locationText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#1F2937',
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  iconButton: {
    position: 'relative',
    padding: 4,
  },
  notificationDot: {
    position: 'absolute',
    top: 4,
    right: 4,
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#EF4444',
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F9FAFB',
    borderRadius: 12,
    paddingHorizontal: 16,
    height: 44,
    gap: 12,
  },
  searchPlaceholder: {
    flex: 1,
    fontSize: 15,
    color: '#9CA3AF',
  },
  heroSection: {
    marginTop: 16,
    marginBottom: 24,
  },
  heroSlide: {
    width: width,
    height: 220,
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
    paddingHorizontal: 20,
    paddingBottom: 24,
  },
  heroContent: {
    gap: 6,
  },
  heroTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  heroSubtitle: {
    fontSize: 14,
    color: '#FFFFFF',
    opacity: 0.95,
  },
  heroButton: {
    alignSelf: 'flex-start',
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
    marginTop: 8,
  },
  heroButtonText: {
    fontSize: 14,
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
    width: 56,
    height: 56,
    borderRadius: 28,
    overflow: 'hidden',
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
  },
  cartBadge: {
    position: 'absolute',
    top: -2,
    right: -2,
    minWidth: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#EF4444',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 6,
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
  cartBadgeText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#FFFFFF',
  },
});
