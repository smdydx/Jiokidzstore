
import React, { useState } from 'react';
import { View, StyleSheet, TextInput, Image, Pressable, Platform } from 'react-native';
import { Feather } from '@expo/vector-icons';
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
  const [isLogin, setIsLogin] = useState(true);
  const [phone, setPhone] = useState('');
  const [name, setName] = useState('');

  const handleSendOTP = () => {
    if (isLogin && phone.length === 10) {
      navigation.navigate('OTP', { phone: `+91${phone}` });
    } else if (!isLogin && phone.length === 10 && name.length > 0) {
      navigation.navigate('OTP', { phone: `+91${phone}`, name });
    }
  };

  const isFormValid = isLogin 
    ? phone.length === 10 
    : phone.length === 10 && name.length > 2;

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

        {/* Tab Switcher */}
        <View style={styles.tabContainer}>
          <Pressable 
            style={[styles.tab, isLogin && styles.tabActive]}
            onPress={() => {
              setIsLogin(true);
              setName('');
            }}
          >
            <ThemedText style={[styles.tabText, isLogin && styles.tabTextActive]}>
              Login
            </ThemedText>
            {isLogin && <View style={styles.tabIndicator} />}
          </Pressable>
          
          <Pressable 
            style={[styles.tab, !isLogin && styles.tabActive]}
            onPress={() => {
              setIsLogin(false);
              setPhone('');
            }}
          >
            <ThemedText style={[styles.tabText, !isLogin && styles.tabTextActive]}>
              Register
            </ThemedText>
            {!isLogin && <View style={styles.tabIndicator} />}
          </Pressable>
        </View>

        <View style={styles.contentSection}>
          <ThemedText style={styles.title}>
            {isLogin ? 'Welcome Back' : 'Create Account'}
          </ThemedText>
          <ThemedText style={styles.subtitle}>
            {isLogin ? 'Login to continue shopping for kids' : 'Register to start shopping'}
          </ThemedText>

          <View style={styles.formContainer}>
            {/* Name Field for Register */}
            {!isLogin && (
              <View style={styles.inputWrapper}>
                <ThemedText style={styles.inputLabel}>Full Name</ThemedText>
                <View style={[styles.modernInputContainer, name.length > 0 && styles.modernInputActive]}>
                  <LinearGradient
                    colors={['#FFB6D9', '#FFE5EE']}
                    style={styles.modernInputGradient}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                  >
                    <Feather name="user" size={20} color="#FF6B9D" style={styles.inputIcon} />
                    <TextInput
                      value={name}
                      onChangeText={setName}
                      placeholder="Enter your full name"
                      style={styles.modernPhoneInput}
                      placeholderTextColor="#999"
                    />
                  </LinearGradient>
                </View>
              </View>
            )}

            {/* Phone Field */}
            <View style={styles.inputWrapper}>
              <ThemedText style={styles.inputLabel}>Mobile Number</ThemedText>
              <View style={[styles.modernInputContainer, phone.length > 0 && styles.modernInputActive]}>
                <LinearGradient
                  colors={['#FFB6D9', '#FFE5EE']}
                  style={styles.modernInputGradient}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                >
                  <Feather name="phone" size={20} color="#FF6B9D" style={styles.inputIcon} />
                  <TextInput
                    value={phone}
                    onChangeText={setPhone}
                    placeholder="Enter 10 digit number"
                    keyboardType="phone-pad"
                    maxLength={10}
                    style={styles.modernPhoneInput}
                    placeholderTextColor="#999"
                  />
                </LinearGradient>
              </View>
              {phone.length > 0 && phone.length < 10 && (
                <ThemedText style={styles.helperText}>
                  {10 - phone.length} more digits needed
                </ThemedText>
              )}
            </View>

            <Pressable
              onPress={handleSendOTP}
              disabled={!isFormValid}
              style={[
                styles.submitButton,
                isFormValid && styles.submitButtonActive
              ]}
            >
              <LinearGradient
                colors={isFormValid ? ['#FF6B9D', '#FF8FB3'] : ['#D0D0D0', '#B8B8B8']}
                style={styles.submitButtonGradient}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
              >
                <ThemedText style={[
                  styles.submitButtonText,
                  !isFormValid && styles.submitButtonTextDisabled
                ]}>
                  {isLogin ? 'Continue' : 'Register'}
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
  tabContainer: {
    flexDirection: 'row',
    marginHorizontal: 24,
    marginBottom: 32,
    borderBottomWidth: 2,
    borderBottomColor: '#E5E7EB',
  },
  tab: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 16,
    alignItems: 'center',
  },
  tabActive: {
    borderBottomWidth: 0,
  },
  tabText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#9CA3AF',
  },
  tabTextActive: {
    color: '#FF6B9D',
    fontSize: 18,
    fontWeight: '700',
  },
  tabIndicator: {
    position: 'absolute',
    bottom: -2,
    left: 0,
    right: 0,
    height: 4,
    backgroundColor: '#FF6B9D',
    borderTopLeftRadius: 2,
    borderTopRightRadius: 2,
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
  modernInputContainer: {
    borderRadius: 16,
    overflow: 'hidden',
    borderWidth: 2,
    borderColor: '#FFB6D9',
    shadowColor: '#FF6B9D',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  modernInputActive: {
    borderColor: '#FF6B9D',
    shadowOpacity: 0.2,
    elevation: 6,
  },
  modernInputGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 18,
    paddingVertical: 16,
    height: 62,
  },
  inputIcon: {
    marginRight: 12,
  },
  modernPhoneInput: {
    flex: 1,
    fontSize: 18,
    fontWeight: '700',
    color: '#1F2937',
    paddingVertical: 4,
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
