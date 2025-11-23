
import React, { useState } from 'react';
import { View, StyleSheet, TextInput, Image, Pressable, Platform } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { ScreenScrollView } from '@/components/ScreenScrollView';
import { ThemedText } from '@/components/ThemedText';
import { ModernInput } from '@/components/ModernInput';
import { useTheme } from '@/hooks/useTheme';
import { Colors, Spacing, BorderRadius, Typography } from '@/constants/theme';
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
        colors={['#FFFFFF', '#FFF8FA']}
        style={styles.container}
      >
        <View style={styles.logoSection}>
          <Image
            source={require('@/attached_assets/JioKidslogo_1763910976445.png')}
            style={styles.logo}
            resizeMode="contain"
          />
        </View>

        <View style={styles.contentSection}>
          <ThemedText style={styles.title}>
            Welcome Back
          </ThemedText>
          <ThemedText style={styles.subtitle}>
            Login to continue shopping for kids
          </ThemedText>

          <View style={styles.formContainer}>
            <View style={styles.inputWrapper}>
              <ThemedText style={styles.inputLabel}>Mobile Number</ThemedText>
              <ModernInput
                icon="phone"
                value={phone}
                onChangeText={setPhone}
                placeholder="Enter 10 digit number"
                keyboardType="phone-pad"
                maxLength={10}
              />
              {phone.length > 0 && phone.length < 10 && (
                <ThemedText style={styles.helperText}>
                  {10 - phone.length} more digits needed
                </ThemedText>
              )}
            </View>

            <Pressable
              onPress={handleSendOTP}
              disabled={phone.length !== 10}
              style={[
                styles.submitButton,
                phone.length === 10 && styles.submitButtonActive
              ]}
            >
              <LinearGradient
                colors={phone.length === 10 ? ['#FF6B9D', '#FF8FB3'] : ['#D0D0D0', '#B8B8B8']}
                style={styles.submitButtonGradient}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
              >
                <ThemedText style={[
                  styles.submitButtonText,
                  phone.length !== 10 && styles.submitButtonTextDisabled
                ]}>
                  Continue
                </ThemedText>
              </LinearGradient>
            </Pressable>
          </View>

          <View style={styles.dividerContainer}>
            <View style={styles.dividerLine} />
            <ThemedText style={styles.dividerText}>OR</ThemedText>
            <View style={styles.dividerLine} />
          </View>

          <Pressable style={styles.socialButton}>
            <ThemedText style={styles.socialButtonText}>
              Continue with Google
            </ThemedText>
          </Pressable>

          <ThemedText style={styles.termsText}>
            By continuing, you agree to our{'\n'}
            <ThemedText style={styles.termsLink}>Terms of Service</ThemedText>
            {' and '}
            <ThemedText style={styles.termsLink}>Privacy Policy</ThemedText>
          </ThemedText>
        </View>
      </LinearGradient>
    </ScreenScrollView>
  );
}

const styles = StyleSheet.create({
  scrollContent: {
    flexGrow: 1,
  },
  container: {
    flex: 1,
    minHeight: Platform.select({ web: '100vh', default: '100%' }),
  },
  logoSection: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 60,
    paddingBottom: 40,
  },
  logo: {
    width: 180,
    height: 90,
  },
  contentSection: {
    flex: 1,
    paddingHorizontal: 24,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#1F2937',
    marginBottom: 8,
    letterSpacing: -0.5,
  },
  subtitle: {
    fontSize: 15,
    color: '#6B7280',
    marginBottom: 40,
    lineHeight: 22,
  },
  formContainer: {
    width: '100%',
  },
  inputWrapper: {
    marginBottom: 24,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '700',
    color: '#1F2937',
    marginBottom: 12,
    letterSpacing: 0.2,
  },
  helperText: {
    fontSize: 12,
    color: '#FF6B9D',
    fontWeight: '500',
    marginTop: 6,
  },
  phoneInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F9FAFB',
    borderRadius: 14,
    borderWidth: 2,
    borderColor: '#E5E7EB',
    height: 60,
    overflow: 'hidden',
  },
  countryCodeBox: {
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderRightWidth: 1.5,
    borderRightColor: '#E5E7EB',
    justifyContent: 'center',
  },
  countryCodeText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
  },
  phoneInput: {
    flex: 1,
    fontSize: 18,
    fontWeight: '600',
    paddingHorizontal: 16,
    height: '100%',
    color: '#1F2937',
  },
  submitButton: {
    width: '100%',
    marginTop: 32,
    borderRadius: 14,
    overflow: 'hidden',
    shadowColor: '#FF6B9D',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 5,
  },
  submitButtonActive: {
    shadowOpacity: 0.25,
    elevation: 8,
  },
  submitButtonGradient: {
    height: 60,
    justifyContent: 'center',
    alignItems: 'center',
  },
  submitButtonText: {
    fontSize: 18,
    fontWeight: '800',
    color: '#FFFFFF',
    letterSpacing: 0.5,
  },
  submitButtonTextDisabled: {
    color: '#6B7280',
  },
  dividerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 32,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: '#E5E7EB',
  },
  dividerText: {
    fontSize: 13,
    color: '#9CA3AF',
    fontWeight: '500',
    marginHorizontal: 16,
  },
  socialButton: {
    height: 56,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: '#E5E7EB',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
  },
  socialButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#374151',
  },
  termsText: {
    fontSize: 13,
    color: '#9CA3AF',
    textAlign: 'center',
    lineHeight: 20,
  },
  termsLink: {
    color: '#FF6B9D',
    fontWeight: '600',
  },
});
