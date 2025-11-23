import React, { useEffect, useRef, useState } from 'react';
import { View, StyleSheet, Image, Pressable, ScrollView, Dimensions, NativeScrollEvent, NativeSyntheticEvent } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useNavigation } from '@react-navigation/native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
  Easing,
  useAnimatedReaction,
  withRepeat,
  interpolate,
  Extrapolate,
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
  isFirstSlide?: boolean;
  slideIndex: number;
  currentSlide: number;
}

// Advanced floating element with pulse and orbit effect
function AdvancedFloatingElement({ delay, position, size, icon, isActive }: any) {
  const orbitAnim = useSharedValue(0);
  const pulseAnim = useSharedValue(0);
  const opacityAnim = useSharedValue(0);
  const scaleAnim = useSharedValue(0.3);

  useEffect(() => {
    if (isActive) {
      // Fade in
      opacityAnim.value = withTiming(0.4, { duration: 800, easing: Easing.ease });
      scaleAnim.value = withTiming(1, { 
        duration: 800, 
        easing: Easing.bezier(0.34, 1.56, 0.64, 1) 
      });

      // Orbit animation
      orbitAnim.value = withRepeat(
        withTiming(360, {
          duration: 8000 + delay,
          easing: Easing.linear,
        }),
        -1,
        false
      );

      // Pulse animation
      pulseAnim.value = withRepeat(
        withTiming(1, {
          duration: 1500,
          easing: Easing.inOut(Easing.ease),
        }),
        -1,
        true
      );
    } else {
      opacityAnim.value = 0;
      scaleAnim.value = 0.3;
    }
  }, [isActive]);

  const pulseScale = interpolate(
    pulseAnim.value,
    [0, 1],
    [0.9, 1.1]
  );

  const orbitX = interpolate(
    orbitAnim.value,
    [0, 360],
    [0, 360]
  );

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacityAnim.value,
    transform: [
      { scale: scaleAnim.value * pulseScale },
      { rotateZ: `${orbitAnim.value}deg` },
    ],
  }));

  return (
    <Animated.View style={[styles.floatingElement, { ...position }, animatedStyle]}>
      <View style={[styles.floatingElementContent, { width: size, height: size, borderRadius: size / 2 }]}>
        <Feather name={icon} size={size / 2.5} color="#FFFFFF" />
      </View>
    </Animated.View>
  );
}

// Shimmer background effect
function ShimmerBackground() {
  const shimmerAnim = useSharedValue(0);

  useEffect(() => {
    shimmerAnim.value = withRepeat(
      withTiming(1, {
        duration: 2000,
        easing: Easing.inOut(Easing.ease),
      }),
      -1,
      true
    );
  }, []);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: interpolate(shimmerAnim.value, [0, 1], [0.3, 0.6]),
  }));

  return (
    <Animated.View style={[styles.shimmerOverlay, animatedStyle]} />
  );
}

function Slide({ title, subtitle, icon, logo, gradient, isFirstSlide, slideIndex, currentSlide }: SlideProps) {
  const textFadeAnim = useSharedValue(0);
  const textTranslateAnim = useSharedValue(50);
  const logoFadeAnim = useSharedValue(0);
  const logoScaleAnim = useSharedValue(0.5);
  const containerRotateAnim = useSharedValue(0);
  const glowyAnim = useSharedValue(0);

  useEffect(() => {
    if (slideIndex === currentSlide && isFirstSlide) {
      // Staggered animation sequence
      textFadeAnim.value = withTiming(1, { duration: 600, easing: Easing.ease });
      textTranslateAnim.value = withTiming(0, { duration: 600, easing: Easing.ease });

      setTimeout(() => {
        logoFadeAnim.value = withTiming(1, {
          duration: 1000,
          easing: Easing.bezier(0.34, 1.56, 0.64, 1),
        });
        logoScaleAnim.value = withTiming(1, {
          duration: 1000,
          easing: Easing.bezier(0.34, 1.56, 0.64, 1),
        });
        containerRotateAnim.value = withTiming(360, {
          duration: 1200,
          easing: Easing.bezier(0.34, 1.56, 0.64, 1),
        });

        glowyAnim.value = withRepeat(
          withTiming(1, { duration: 2000, easing: Easing.inOut(Easing.ease) }),
          -1,
          true
        );
      }, 400);
    } else if (slideIndex === currentSlide && !isFirstSlide) {
      textFadeAnim.value = withTiming(1, { duration: 600, easing: Easing.ease });
      logoFadeAnim.value = withTiming(1, { duration: 600, easing: Easing.ease });
    } else {
      textFadeAnim.value = 0;
      textTranslateAnim.value = 50;
      logoFadeAnim.value = 0;
      logoScaleAnim.value = 0.5;
      containerRotateAnim.value = 0;
    }
  }, [slideIndex, currentSlide]);

  const textAnimatedStyle = useAnimatedStyle(() => ({
    opacity: textFadeAnim.value,
    transform: [{ translateY: textTranslateAnim.value }],
  }));

  const glowOpacity = interpolate(glowyAnim.value, [0, 1], [0, 0.3]);

  const logoAnimatedStyle = useAnimatedStyle(() => ({
    opacity: logoFadeAnim.value,
    transform: [
      { scale: logoScaleAnim.value },
      { rotateZ: `${containerRotateAnim.value}deg` },
    ],
  }));

  const glowyStyle = useAnimatedStyle(() => ({
    opacity: glowOpacity,
  }));

  return (
    <LinearGradient
      colors={gradient}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={styles.slide}
    >
      <ShimmerBackground />
      
      <View style={styles.slideContent}>
        {isFirstSlide ? (
          <>
            {/* Advanced animated floating elements */}
            <AdvancedFloatingElement 
              delay={0} 
              position={{ top: 60, left: 20 }} 
              size={56} 
              icon="shopping-bag"
              isActive={slideIndex === currentSlide}
            />
            <AdvancedFloatingElement 
              delay={200} 
              position={{ top: 150, right: 30 }} 
              size={48} 
              icon="gift"
              isActive={slideIndex === currentSlide}
            />
            <AdvancedFloatingElement 
              delay={400} 
              position={{ bottom: 180, left: 40 }} 
              size={52} 
              icon="heart"
              isActive={slideIndex === currentSlide}
            />
            <AdvancedFloatingElement 
              delay={600} 
              position={{ bottom: 140, right: 50 }} 
              size={44} 
              icon="star"
              isActive={slideIndex === currentSlide}
            />
            <AdvancedFloatingElement 
              delay={300} 
              position={{ top: 300, left: 50 }} 
              size={40} 
              icon="zap"
              isActive={slideIndex === currentSlide}
            />

            <Animated.View style={[styles.textContainer, textAnimatedStyle]}>
              <ThemedText style={styles.slideTitle}>{title}</ThemedText>
            </Animated.View>
            
            {/* Logo with glow effect */}
            <View style={styles.logoWrapperContainer}>
              <Animated.View style={[styles.glowEffect, glowyStyle]} />
              <Animated.View style={[styles.logoContainer, logoAnimatedStyle]}>
                <Image source={logo} style={styles.logo} resizeMode="contain" />
              </Animated.View>
            </View>
            
            <Animated.View style={[{ opacity: textFadeAnim }, styles.subtitleContainer]}>
              <ThemedText style={styles.slideSubtitle}>{subtitle}</ThemedText>
            </Animated.View>
          </>
        ) : (
          <>
            <Animated.View style={[styles.iconContainer, logoAnimatedStyle]}>
              <View style={styles.iconGradientBg}>
                <Feather name={icon as any} size={80} color="#FFFFFF" />
              </View>
            </Animated.View>
            <Animated.View style={[textAnimatedStyle, styles.textContainerOther]}>
              <ThemedText style={styles.slideTitle}>{title}</ThemedText>
              <ThemedText style={styles.slideSubtitle}>{subtitle}</ThemedText>
            </Animated.View>
          </>
        )}
      </View>
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
      isFirstSlide: true,
      slideIndex: 0,
      currentSlide,
    },
    {
      title: 'Easy Shopping',
      subtitle: 'Browse, filter, and find everything you need in just a few taps',
      icon: 'shopping-bag',
      gradient: ['#FF8FB3', '#FF6B9D'],
      isFirstSlide: false,
      slideIndex: 1,
      currentSlide,
    },
    {
      title: 'Fast Delivery',
      subtitle: 'Quick checkout and reliable delivery to your doorstep',
      icon: 'truck',
      gradient: ['#FF6B9D', '#E5426B'],
      isFirstSlide: false,
      slideIndex: 2,
      currentSlide,
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
    overflow: 'hidden',
  },
  shimmerOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
  },
  slideContent: {
    alignItems: 'center',
    paddingHorizontal: Spacing.xl,
    width: '100%',
    position: 'relative',
    justifyContent: 'center',
  },
  floatingElement: {
    position: 'absolute',
  },
  floatingElementContent: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.25)',
    backdropFilter: 'blur(10px)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  textContainer: {
    marginBottom: Spacing.lg,
    zIndex: 10,
  },
  textContainerOther: {
    marginTop: Spacing.lg,
  },
  logoWrapperContainer: {
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.xl,
  },
  glowEffect: {
    position: 'absolute',
    width: 240,
    height: 240,
    borderRadius: 120,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    blur: 80,
  },
  logoContainer: {
    width: 180,
    height: 180,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 5,
  },
  logo: {
    width: '100%',
    height: '100%',
  },
  subtitleContainer: {
    marginTop: Spacing.lg,
    paddingHorizontal: Spacing.md,
  },
  iconContainer: {
    marginBottom: Spacing.xxl,
    justifyContent: 'center',
    alignItems: 'center',
  },
  iconGradientBg: {
    width: 140,
    height: 140,
    borderRadius: 70,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.4)',
  },
  slideTitle: {
    fontSize: 32,
    fontWeight: '700',
    color: '#FFFFFF',
    textAlign: 'center',
    fontFamily: 'Poppins',
  },
  slideSubtitle: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.95)',
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
