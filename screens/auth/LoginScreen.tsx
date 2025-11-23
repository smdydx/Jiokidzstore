import React, { useState } from 'react';
import { View, StyleSheet, TextInput, Image, Pressable } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { ScreenScrollView } from '@/components/ScreenScrollView';
import { ThemedText } from '@/components/ThemedText';
import { Button } from '@/components/Button';
import { useTheme } from '@/hooks/useTheme';
import { Colors, Spacing, BorderRadius, Typography, Shadows } from '@/constants/theme';
import type { RootStackParamList } from '@/navigation/RootNavigator';

export default function LoginScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const { theme } = useTheme();
  const [phone, setPhone] = useState('');

  const handleSendOTP = () => {
    if (phone.length === 10) {
      navigation.navigate('OTP', { phone: `+91${phone}` });
    }
  };

  return (
    <ScreenScrollView contentContainerStyle={styles.scrollContent}>
      <LinearGradient
        colors={['#FFFFFF', '#FFE5EE', '#FFF0F5', '#FFFFFF']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.gradientBackground}
      >
        <View style={styles.logoContainer}>
          <View style={styles.logoShadow}>
            <Image
              source={require('@/attached_assets/JioKidslogo_1763910976445.png')}
              style={styles.logo}
              resizeMode="contain"
            />
          </View>
        </View>

        <View style={styles.contentCard}>
          <LinearGradient
            colors={['#FFFFFF', '#FFF5F8']}
            style={styles.cardGradient}
          >
            <ThemedText type="h1" style={styles.title}>
              Welcome Back! 👋
            </ThemedText>
            <ThemedText style={styles.subtitle}>
              Login to continue shopping amazing kids products
            </ThemedText>

            <View style={styles.inputContainer}>
              <ThemedText type="small" style={styles.label}>
                📱 Phone Number
              </ThemedText>
              <LinearGradient
                colors={['#FFE5EE', '#FFF0F5']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.phoneInputGradient}
              >
                <View style={styles.phoneInputContainer}>
                  <LinearGradient
                    colors={['#FF6B9D', '#FF8FB3']}
                    style={styles.countryCode}
                  >
                    <ThemedText style={styles.countryCodeText}>+91</ThemedText>
                  </LinearGradient>
                  <TextInput
                    style={[styles.input, { color: theme.text }]}
                    value={phone}
                    onChangeText={setPhone}
                    placeholder="Enter mobile number"
                    placeholderTextColor={theme.textGray}
                    keyboardType="phone-pad"
                    maxLength={10}
                  />
                </View>
              </LinearGradient>
            </View>

            <LinearGradient
              colors={phone.length === 10 ? ['#FF6B9D', '#FF8FB3', '#FFA8C5'] : ['#E0E0E0', '#F0F0F0']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.buttonGradient}
            >
              <Pressable
                onPress={handleSendOTP}
                disabled={phone.length !== 10}
                style={styles.button}
              >
                <ThemedText style={styles.buttonText}>
                  Send OTP 🚀
                </ThemedText>
              </Pressable>
            </LinearGradient>

            <View style={styles.decorativeElements}>
              <View style={[styles.circle, styles.circle1]} />
              <View style={[styles.circle, styles.circle2]} />
              <View style={[styles.circle, styles.circle3]} />
            </View>

            <ThemedText type="small" style={styles.termsText}>
              🔒 By continuing, you agree to our{' '}
              <ThemedText type="small" style={styles.linkText}>
                Terms of Service
              </ThemedText>
              {' '}and{' '}
              <ThemedText type="small" style={styles.linkText}>
                Privacy Policy
              </ThemedText>
            </ThemedText>
          </LinearGradient>
        </View>
      </LinearGradient>
    </ScreenScrollView>
  );
}

const styles = StyleSheet.create({
  scrollContent: {
    flexGrow: 1,
  },
  gradientBackground: {
    flex: 1,
    minHeight: '100%',
    paddingHorizontal: Spacing.lg,
  },
  logoContainer: {
    alignItems: 'center',
    marginTop: Spacing.xxl * 2,
    marginBottom: Spacing.xl,
  },
  logoShadow: {
    ...Shadows.large,
    borderRadius: BorderRadius.xl,
    backgroundColor: '#FFFFFF',
    padding: Spacing.md,
  },
  logo: {
    width: 220,
    height: 110,
  },
  contentCard: {
    borderRadius: BorderRadius['2xl'],
    overflow: 'hidden',
    ...Shadows.medium,
    marginBottom: Spacing.xxl,
  },
  cardGradient: {
    padding: Spacing.xl,
    paddingTop: Spacing.xxl,
    paddingBottom: Spacing.xxl,
  },
  title: {
    marginBottom: Spacing.sm,
    textAlign: 'center',
    color: Colors.light.primary,
  },
  subtitle: {
    color: Colors.light.textGray,
    marginBottom: Spacing.xxl,
    textAlign: 'center',
    paddingHorizontal: Spacing.md,
  },
  inputContainer: {
    width: '100%',
    marginBottom: Spacing.xl,
  },
  label: {
    marginBottom: Spacing.md,
    fontWeight: '700',
    color: Colors.light.text,
    fontSize: 15,
  },
  phoneInputGradient: {
    borderRadius: BorderRadius.md,
    padding: 2,
    ...Shadows.small,
  },
  phoneInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: BorderRadius.md,
    overflow: 'hidden',
  },
  countryCode: {
    height: Spacing.inputHeight,
    paddingHorizontal: Spacing.lg,
    justifyContent: 'center',
    borderTopLeftRadius: BorderRadius.md,
    borderBottomLeftRadius: BorderRadius.md,
  },
  countryCodeText: {
    fontWeight: '700',
    color: '#FFFFFF',
    fontSize: 16,
  },
  input: {
    flex: 1,
    height: Spacing.inputHeight,
    backgroundColor: '#FFFFFF',
    paddingHorizontal: Spacing.lg,
    fontSize: Typography.body.fontSize,
    fontWeight: '500',
  },
  buttonGradient: {
    borderRadius: BorderRadius.md,
    ...Shadows.medium,
    marginBottom: Spacing.xl,
  },
  button: {
    height: Spacing.buttonHeight + 4,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '700',
  },
  decorativeElements: {
    position: 'absolute',
    top: 0,
    right: 0,
    width: '100%',
    height: '100%',
    zIndex: -1,
  },
  circle: {
    position: 'absolute',
    borderRadius: 9999,
    opacity: 0.1,
  },
  circle1: {
    width: 120,
    height: 120,
    backgroundColor: '#FF6B9D',
    top: -40,
    right: -30,
  },
  circle2: {
    width: 80,
    height: 80,
    backgroundColor: '#9B59B6',
    bottom: 100,
    left: -20,
  },
  circle3: {
    width: 60,
    height: 60,
    backgroundColor: '#FFE5EE',
    top: '50%',
    right: 20,
  },
  termsText: {
    textAlign: 'center',
    color: Colors.light.textGray,
    lineHeight: 20,
  },
  linkText: {
    color: Colors.light.primary,
    fontWeight: '600',
  },
});