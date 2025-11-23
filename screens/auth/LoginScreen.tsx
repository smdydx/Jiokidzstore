import React, { useState } from 'react';
import { View, StyleSheet, TextInput, Image, Pressable } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { ScreenScrollView } from '@/components/ScreenScrollView';
import { ThemedText } from '@/components/ThemedText';
import { Button } from '@/components/Button';
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
    <ScreenScrollView>
      <Image
        source={require('@/attached_assets/JioKidslogo_1763910976445.png')}
        style={styles.logo}
        resizeMode="contain"
      />

      <ThemedText type="h1" style={styles.title}>
        Welcome Back!
      </ThemedText>
      <ThemedText style={styles.subtitle}>
        Login to continue shopping
      </ThemedText>

      <View style={styles.inputContainer}>
        <ThemedText type="small" style={styles.label}>
          Phone Number
        </ThemedText>
        <View style={styles.phoneInputContainer}>
          <View style={styles.countryCode}>
            <ThemedText style={styles.countryCodeText}>+91</ThemedText>
          </View>
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
      </View>

      <Button
        onPress={handleSendOTP}
        style={styles.button}
        disabled={phone.length !== 10}
      >
        Send OTP
      </Button>

      <ThemedText type="small" style={styles.termsText}>
        By continuing, you agree to our Terms of Service and Privacy Policy
      </ThemedText>
    </ScreenScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: Spacing.xl,
    alignItems: 'center',
  },
  logo: {
    width: 200,
    height: 100,
    marginTop: Spacing.xxl,
    marginBottom: Spacing.xl,
  },
  title: {
    marginBottom: Spacing.sm,
  },
  subtitle: {
    color: Colors.light.textGray,
    marginBottom: Spacing.xxl,
  },
  inputContainer: {
    width: '100%',
    marginBottom: Spacing.xl,
  },
  label: {
    marginBottom: Spacing.sm,
    fontWeight: '600',
  },
  phoneInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  countryCode: {
    height: Spacing.inputHeight,
    paddingHorizontal: Spacing.lg,
    justifyContent: 'center',
    backgroundColor: Colors.light.backgroundSecondary,
    borderTopLeftRadius: BorderRadius.xs,
    borderBottomLeftRadius: BorderRadius.xs,
    marginRight: 1,
  },
  countryCodeText: {
    fontWeight: '600',
  },
  input: {
    flex: 1,
    height: Spacing.inputHeight,
    backgroundColor: Colors.light.backgroundSecondary,
    borderTopRightRadius: BorderRadius.xs,
    borderBottomRightRadius: BorderRadius.xs,
    paddingHorizontal: Spacing.lg,
    fontSize: Typography.body.fontSize,
  },
  button: {
    width: '100%',
    marginBottom: Spacing.lg,
  },
  termsText: {
    textAlign: 'center',
    color: Colors.light.textGray,
    paddingHorizontal: Spacing.xl,
  },
});
