import React, { useEffect, useRef, useState } from 'react';
import { View, StyleSheet, Image, Pressable, ScrollView, Dimensions, NativeScrollEvent, NativeSyntheticEvent } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useNavigation } from '@react-navigation/native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
  Easing,
} from 'react-native-reanimated';
import { Feather } from '@expo/vector-icons';
import { ThemedText } from '@/components/ThemedText';
import { Colors, Spacing } from '@/constants/theme';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

interface SlideProps {
  title: string;
  subtitle: string;
  icon?: string;
  logo?: any;
  gradient: [string, string];
}

function Slide({ title, subtitle, icon, logo, gradient }: SlideProps) {
  const fadeAnim = useSharedValue(0);

  useEffect(() => {
    fadeAnim.value = withTiming(1, {
      duration: 600,
      easing: Easing.ease,
    });
  }, []);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: fadeAnim.value,
  }));

  return (
    <LinearGradient
      colors={gradient}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={styles.slide}
    >
      <Animated.View style={[styles.slideContent, animatedStyle]}>
        {logo ? (
          <View style={styles.logoContainer}>
            <Image source={logo} style={styles.logo} resizeMode="contain" />
          </View>
        ) : (
          <View style={styles.iconContainer}>
            <Feather name={icon as any} size={120} color="#FFFFFF" />
          </View>
        )}
        <ThemedText style={styles.slideTitle}>{title}</ThemedText>
        <ThemedText style={styles.slideSubtitle}>{subtitle}</ThemedText>
      </Animated.View>
    </LinearGradient>
  );
}

export default function SplashScreen() {
  const navigation = useNavigation<any>();
  const scrollViewRef = useRef<ScrollView>(null);
  const [currentSlide, setCurrentSlide] = useState(0);
  const autoScrollTimer = useRef<NodeJS.Timeout>();

  const slides: SlideProps[] = [
    {
      title: 'Welcome to',
      subtitle: 'Premium Kids E-Commerce Store',
      logo: require('@/attached_assets/JioKidslogo_1763923777175.png'),
      gradient: ['#FFB6D9', '#FF6B9D'],
    },
    {
      title: 'Easy Shopping',
      subtitle: 'Browse, filter, and find everything you need in just a few taps',
      icon: 'shopping-bag',
      gradient: ['#FF8FB3', '#FF6B9D'],
    },
    {
      title: 'Fast Delivery',
      subtitle: 'Quick checkout and reliable delivery to your doorstep',
      icon: 'truck',
      gradient: ['#FF6B9D', '#E5426B'],
    },
  ];

  const startAutoScroll = () => {
    if (autoScrollTimer.current) {
      clearTimeout(autoScrollTimer.current);
    }

    const timer1 = setTimeout(() => {
      if (currentSlide === 0) {
        scrollViewRef.current?.scrollTo({ x: screenWidth, animated: true });
        setCurrentSlide(1);
      }
    }, 4000);

    autoScrollTimer.current = timer1;
  };

  const startAutoScrollSlide2 = () => {
    if (autoScrollTimer.current) {
      clearTimeout(autoScrollTimer.current);
    }

    const timer2 = setTimeout(() => {
      if (currentSlide === 1) {
        scrollViewRef.current?.scrollTo({ x: screenWidth * 2, animated: true });
        setCurrentSlide(2);
      }
    }, 4000);

    autoScrollTimer.current = timer2;
  };

  useEffect(() => {
    startAutoScroll();
  }, [currentSlide]);

  useEffect(() => {
    if (currentSlide === 1) {
      startAutoScrollSlide2();
    }
  }, [currentSlide]);

  const handleScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const scrollX = event.nativeEvent.contentOffset.x;
    const slide = Math.round(scrollX / screenWidth);
    setCurrentSlide(slide);

    if (autoScrollTimer.current) {
      clearTimeout(autoScrollTimer.current);
    }
  };

  const handleGetStarted = () => {
    if (autoScrollTimer.current) {
      clearTimeout(autoScrollTimer.current);
    }
    navigation.navigate('Login');
  };

  const handleDotPress = (index: number) => {
    if (autoScrollTimer.current) {
      clearTimeout(autoScrollTimer.current);
    }
    scrollViewRef.current?.scrollTo({ x: screenWidth * index, animated: true });
    setCurrentSlide(index);
  };

  return (
    <View style={styles.container}>
      <ScrollView
        ref={scrollViewRef}
        horizontal
        pagingEnabled
        scrollEnabled={true}
        showsHorizontalScrollIndicator={false}
        scrollEventThrottle={16}
        onScroll={handleScroll}
        style={styles.scrollView}
      >
        {slides.map((slide, index) => (
          <View key={index} style={{ width: screenWidth }}>
            <Slide {...slide} />
          </View>
        ))}
      </ScrollView>

      {/* Dots Indicator */}
      <View style={styles.dotsContainer}>
        {slides.map((_, index) => (
          <Pressable
            key={index}
            style={[
              styles.dot,
              currentSlide === index ? styles.activeDot : styles.inactiveDot,
            ]}
            onPress={() => handleDotPress(index)}
          />
        ))}
      </View>

      {/* Get Started Button - Only on last slide */}
      {currentSlide === 2 && (
        <Animated.View style={styles.buttonContainer}>
          <Pressable
            style={({ pressed }) => [
              styles.getStartedButton,
              pressed && styles.getStartedButtonPressed,
            ]}
            onPress={handleGetStarted}
          >
            <LinearGradient
              colors={['#FF6B9D', '#FF8FB3']}
              style={styles.buttonGradient}
            >
              <ThemedText style={styles.buttonText}>Get Started</ThemedText>
              <Feather name="arrow-right" size={18} color="#FFFFFF" style={{ marginLeft: Spacing.sm }} />
            </LinearGradient>
          </Pressable>
        </Animated.View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  scrollView: {
    flex: 1,
  },
  slide: {
    width: screenWidth,
    height: screenHeight,
    justifyContent: 'center',
    alignItems: 'center',
  },
  slideContent: {
    alignItems: 'center',
    paddingHorizontal: Spacing.xl,
  },
  logoContainer: {
    marginBottom: Spacing.xl,
    width: 180,
    height: 180,
  },
  logo: {
    width: '100%',
    height: '100%',
  },
  iconContainer: {
    marginBottom: Spacing.xxl,
  },
  slideTitle: {
    fontSize: 32,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: Spacing.lg,
    textAlign: 'center',
    fontFamily: 'Poppins',
  },
  slideSubtitle: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.9)',
    textAlign: 'center',
    lineHeight: 24,
    fontFamily: 'Poppins',
    fontWeight: '500',
  },
  dotsContainer: {
    position: 'absolute',
    bottom: 100,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'center',
    gap: Spacing.md,
  },
  dot: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  activeDot: {
    backgroundColor: '#FFFFFF',
    width: 32,
  },
  inactiveDot: {
    backgroundColor: 'rgba(255, 255, 255, 0.5)',
  },
  buttonContainer: {
    position: 'absolute',
    bottom: 40,
    left: Spacing.lg,
    right: Spacing.lg,
  },
  getStartedButton: {
    borderRadius: 12,
    overflow: 'hidden',
  },
  getStartedButtonPressed: {
    opacity: 0.8,
  },
  buttonGradient: {
    paddingVertical: Spacing.lg,
    paddingHorizontal: Spacing.xl,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFFFFF',
    fontFamily: 'Poppins',
  },
});
