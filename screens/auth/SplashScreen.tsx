import React, { useEffect } from 'react';
import { View, StyleSheet, Image, Dimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
  withSequence,
  Easing,
  withDelay,
} from 'react-native-reanimated';
import { ThemedText } from '@/components/ThemedText';
import { Colors, Spacing } from '@/constants/theme';

const { height: screenHeight } = Dimensions.get('window');

export default function SplashScreen() {
  // Logo animations
  const logoScale = useSharedValue(0);
  const logoRotate = useSharedValue(-180);
  const logoOpacity = useSharedValue(0);
  
  // Text animations
  const textOpacity = useSharedValue(0);
  const textTranslateY = useSharedValue(50);
  
  // Pulse animation
  const pulseScale = useSharedValue(1);

  useEffect(() => {
    // Logo entrance animation
    logoScale.value = withTiming(1, {
      duration: 800,
      easing: Easing.out(Easing.cubic),
    });

    logoRotate.value = withTiming(0, {
      duration: 800,
      easing: Easing.out(Easing.cubic),
    });

    logoOpacity.value = withTiming(1, {
      duration: 600,
      easing: Easing.ease,
    });

    // Text entrance animation (delayed)
    textOpacity.value = withDelay(
      400,
      withTiming(1, {
        duration: 600,
        easing: Easing.ease,
      })
    );

    textTranslateY.value = withDelay(
      400,
      withTiming(0, {
        duration: 600,
        easing: Easing.out(Easing.cubic),
      })
    );

    // Pulse animation (after entrance)
    pulseScale.value = withDelay(
      1200,
      withSequence(
        withTiming(1.1, {
          duration: 600,
          easing: Easing.inOut(Easing.ease),
        }),
        withTiming(1, {
          duration: 600,
          easing: Easing.inOut(Easing.ease),
        })
      )
    );
  }, []);

  const logoAnimatedStyle = useAnimatedStyle(() => ({
    transform: [
      { scale: logoScale.value },
      { rotate: `${logoRotate.value}deg` },
    ],
    opacity: logoOpacity.value,
  }));

  const textAnimatedStyle = useAnimatedStyle(() => ({
    opacity: textOpacity.value,
    transform: [{ translateY: textTranslateY.value }],
  }));

  const pulseAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: pulseScale.value }],
  }));

  return (
    <LinearGradient
      colors={['#FFB6D9', '#FF6B9D']}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={styles.container}
    >
      {/* Animated pulse background */}
      <Animated.View style={[styles.pulseCircle, pulseAnimatedStyle]} />

      {/* Logo */}
      <Animated.View style={[styles.logoContainer, logoAnimatedStyle]}>
        <Image
          source={require('@/attached_assets/JioKidslogo_1763923777175.png')}
          style={styles.logo}
          resizeMode="contain"
        />
      </Animated.View>

      {/* App Name */}
      <Animated.View style={[styles.textContainer, textAnimatedStyle]}>
        <ThemedText style={styles.appName}>JioKidz</ThemedText>
        <ThemedText style={styles.tagline}>Premium Kids Store</ThemedText>
      </Animated.View>

      {/* Loading dots animation */}
      <View style={styles.dotsContainer}>
        <Animated.View 
          style={[
            styles.dot, 
            {
              opacity: withSequence(
                withDelay(0, withTiming(1, { duration: 400 })),
                withDelay(200, withTiming(0.5, { duration: 400 })),
                withDelay(200, withTiming(1, { duration: 400 }))
              ),
            }
          ]} 
        />
        <Animated.View 
          style={[
            styles.dot, 
            {
              opacity: withSequence(
                withDelay(200, withTiming(1, { duration: 400 })),
                withDelay(200, withTiming(0.5, { duration: 400 })),
                withDelay(200, withTiming(1, { duration: 400 }))
              ),
            }
          ]} 
        />
        <Animated.View 
          style={[
            styles.dot, 
            {
              opacity: withSequence(
                withDelay(400, withTiming(1, { duration: 400 })),
                withDelay(200, withTiming(0.5, { duration: 400 })),
                withDelay(200, withTiming(1, { duration: 400 }))
              ),
            }
          ]} 
        />
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoContainer: {
    width: 200,
    height: 200,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: Spacing.xl,
  },
  logo: {
    width: '100%',
    height: '100%',
  },
  pulseCircle: {
    position: 'absolute',
    width: 300,
    height: 300,
    borderRadius: 150,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },
  textContainer: {
    alignItems: 'center',
    marginBottom: Spacing.xxl,
  },
  appName: {
    fontSize: 32,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: Spacing.xs,
    fontFamily: 'Poppins',
  },
  tagline: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.8)',
    fontWeight: '500',
    fontFamily: 'Poppins',
  },
  dotsContainer: {
    position: 'absolute',
    bottom: 60,
    flexDirection: 'row',
    gap: Spacing.md,
    alignItems: 'center',
  },
  dot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#FFFFFF',
  },
});
