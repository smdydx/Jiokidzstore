
import React, { useState, useRef } from 'react';
import { View, StyleSheet, ScrollView, Pressable, Image, Dimensions, FlatList } from 'react-native';
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
    title: 'Big Sale! 🎉',
    subtitle: 'Up to 60% OFF on Kids Fashion',
    image: 'https://images.unsplash.com/photo-1503944583220-79d8926ad5e2?w=800',
    buttonText: 'Shop Now',
  },
  {
    id: '2',
    title: 'New Arrivals 🌟',
    subtitle: 'Latest Toys Collection for Your Kids',
    image: 'https://images.unsplash.com/photo-1515488042361-ee00e0ddd4e4?w=800',
    buttonText: 'Explore',
  },
  {
    id: '3',
    title: 'Baby Essentials 👶',
    subtitle: 'Everything You Need for Your Little One',
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
    <View style={[styles.heroSlide, { width: width - Spacing.lg * 2 }]}>
      <LinearGradient
        colors={['rgba(255, 107, 157, 0.9)', 'rgba(255, 143, 179, 0.8)']}
        style={styles.heroOverlay}
      >
        <Image source={{ uri: item.image }} style={styles.heroImage} />
        <View style={styles.heroContent}>
          <ThemedText style={styles.heroTitle}>{item.title}</ThemedText>
          <ThemedText style={styles.heroSubtitle}>{item.subtitle}</ThemedText>
          <Pressable style={styles.heroButton}>
            <LinearGradient
              colors={['#FFFFFF', '#FFF5F8']}
              style={styles.heroButtonGradient}
            >
              <ThemedText style={styles.heroButtonText}>{item.buttonText}</ThemedText>
              <Feather name="arrow-right" size={18} color={Colors.light.primary} />
            </LinearGradient>
          </Pressable>
        </View>
      </LinearGradient>
    </View>
  );

  return (
    <ScreenScrollView>
      <LinearGradient
        colors={['#FF6B9D', '#FFE5EE']}
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
            Search toys, clothes, diapers...
          </ThemedText>
          <Feather name="mic" size={20} color={Colors.light.primary} />
        </Pressable>
      </LinearGradient>

      {/* Hero Slider Section */}
      <View style={styles.heroSection}>
        <FlatList
          ref={heroScrollRef}
          data={HERO_SLIDES}
          renderItem={renderHeroSlide}
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          onViewableItemsChanged={onViewableItemsChanged}
          viewabilityConfig={{
            itemVisiblePercentThreshold: 50,
          }}
          snapToInterval={width - Spacing.lg * 2 + Spacing.md}
          decelerationRate="fast"
          contentContainerStyle={styles.heroContainer}
        />
        <View style={styles.heroPagination}>
          {HERO_SLIDES.map((_, index) => (
            <View
              key={index}
              style={[
                styles.heroDot,
                activeSlide === index && styles.heroDotActive,
              ]}
            />
          ))}
        </View>
      </View>

      <View style={styles.categoriesSection}>
        <View style={styles.sectionHeader}>
          <ThemedText type="h3" style={styles.sectionTitle}>Shop by Category</ThemedText>
          <Pressable onPress={() => navigation.navigate('HomeTab', { screen: 'CategoriesTab' } as any)}>
            <ThemedText style={styles.seeAll}>See All →</ThemedText>
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
          colors={['#FF6B9D', '#FFA8C5']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.flashGradient}
        >
          <View style={styles.flashContent}>
            <View style={styles.flashIconContainer}>
              <Feather name="zap" size={28} color="#FFFFFF" />
            </View>
            <View style={styles.flashText}>
              <ThemedText style={styles.flashTitle}>⚡ Flash Sale</ThemedText>
              <ThemedText style={styles.flashSubtitle}>
                Up to 60% OFF • Limited Time Only!
              </ThemedText>
            </View>
          </View>
          <Feather name="chevron-right" size={28} color="#FFFFFF" />
        </LinearGradient>
      </Pressable>

      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <ThemedText type="h3" style={styles.sectionTitle}>🔥 Trending Now</ThemedText>
          <Pressable>
            <ThemedText style={styles.seeAll}>View All →</ThemedText>
          </Pressable>
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
    fontWeight: '700',
    fontSize: 15,
    textShadowColor: 'rgba(0, 0, 0, 0.2)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  notificationButton: {
    position: 'relative',
  },
  badge: {
    position: 'absolute',
    top: 0,
    right: 0,
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#FFD700',
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: BorderRadius.md,
    paddingHorizontal: Spacing.lg,
    height: 50,
    gap: Spacing.md,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  searchPlaceholder: {
    flex: 1,
    color: Colors.light.textGray,
    fontSize: 15,
  },
  heroSection: {
    marginTop: Spacing.lg,
    marginBottom: Spacing.lg,
  },
  heroContainer: {
    paddingHorizontal: Spacing.lg,
    gap: Spacing.md,
  },
  heroSlide: {
    height: 200,
    borderRadius: BorderRadius.lg,
    overflow: 'hidden',
    marginRight: Spacing.md,
  },
  heroImage: {
    width: '100%',
    height: '100%',
    position: 'absolute',
  },
  heroOverlay: {
    flex: 1,
    justifyContent: 'flex-end',
    padding: Spacing.lg,
  },
  heroContent: {
    gap: Spacing.xs,
  },
  heroTitle: {
    fontSize: 26,
    fontWeight: '800',
    color: '#FFFFFF',
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  heroSubtitle: {
    fontSize: 15,
    color: '#FFFFFF',
    fontWeight: '600',
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  heroButton: {
    marginTop: Spacing.sm,
    alignSelf: 'flex-start',
    borderRadius: BorderRadius.sm,
    overflow: 'hidden',
  },
  heroButtonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 20,
    gap: 6,
  },
  heroButtonText: {
    fontSize: 15,
    fontWeight: '700',
    color: Colors.light.primary,
  },
  heroPagination: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: Spacing.md,
    gap: 6,
  },
  heroDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#FFB6D0',
  },
  heroDotActive: {
    width: 24,
    backgroundColor: Colors.light.primary,
  },
  categoriesSection: {
    marginTop: Spacing.md,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: Spacing.lg,
    marginBottom: Spacing.lg,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#333',
  },
  seeAll: {
    color: Colors.light.primary,
    fontWeight: '700',
    fontSize: 15,
  },
  categoriesScroll: {
    paddingLeft: Spacing.lg,
  },
  flashSaleBanner: {
    marginHorizontal: Spacing.lg,
    marginVertical: Spacing.lg,
    borderRadius: BorderRadius.md,
    overflow: 'hidden',
    shadowColor: Colors.light.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
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
  flashIconContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  flashText: {},
  flashTitle: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: '800',
    textShadowColor: 'rgba(0, 0, 0, 0.2)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  flashSubtitle: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '600',
    textShadowColor: 'rgba(0, 0, 0, 0.2)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
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
    width: 60,
    height: 60,
    borderRadius: 30,
    overflow: 'hidden',
    shadowColor: Colors.light.primary,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.5,
    shadowRadius: 10,
    elevation: 10,
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
    minWidth: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: '#FFD700',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 5,
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
  cartBadgeText: {
    color: Colors.light.primary,
    fontSize: 12,
    fontWeight: '800',
  },
});
