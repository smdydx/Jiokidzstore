import React, { useState, useRef, useEffect } from 'react';
import { View, StyleSheet, TextInput, Pressable } from 'react-native';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { ScreenScrollView } from '@/components/ScreenScrollView';
import { ThemedText } from '@/components/ThemedText';
import { Button } from '@/components/Button';
import { useAuth } from '@/hooks/useAuth';
import { useTheme } from '@/hooks/useTheme';
import { Colors, Spacing, BorderRadius } from '@/constants/theme';
import type { RootStackParamList } from '@/navigation/RootNavigator';

export default function OTPScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const route = useRoute<RouteProp<RootStackParamList, 'OTP'>>();
  const { signIn } = useAuth();
  const { theme } = useTheme();
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [timer, setTimer] = useState(30);
  const inputRefs = useRef<Array<TextInput | null>>([]);

  useEffect(() => {
    const interval = setInterval(() => {
      setTimer((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const handleOtpChange = (value: string, index: number) => {
    if (value.length <= 1 && /^\d*$/.test(value)) {
      const newOtp = [...otp];
      newOtp[index] = value;
      setOtp(newOtp);

      if (value && index < 5) {
        inputRefs.current[index + 1]?.focus();
      }
    }
  };

  const handleKeyPress = (key: string, index: number) => {
    if (key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleVerify = async () => {
    const otpValue = otp.join('');
    if (otpValue.length === 6) {
      await signIn({
        id: '1',
        name: 'User',
        phone: route.params.phone,
      });
    }
  };

  const handleResend = () => {
    setTimer(30);
  };

  return (
    <ScreenScrollView>
      <ThemedText type="h1" style={styles.title}>
        Enter OTP
      </ThemedText>
      <ThemedText style={styles.subtitle}>
        We've sent a 6-digit code to{'\n'}{route.params.phone}
      </ThemedText>

      <View style={styles.otpContainer}>
        {otp.map((digit, index) => (
          <TextInput
            key={index}
            ref={(ref) => {
              if (ref) inputRefs.current[index] = ref;
            }}
            style={[
              styles.otpInput,
              {
                borderColor: digit ? Colors.light.primary : Colors.light.border,
                color: theme.text,
              },
            ]}
            value={digit}
            onChangeText={(value) => handleOtpChange(value, index)}
            onKeyPress={({ nativeEvent }) => handleKeyPress(nativeEvent.key, index)}
            keyboardType="number-pad"
            maxLength={1}
            autoFocus={index === 0}
          />
        ))}
      </View>

      {timer > 0 ? (
        <ThemedText style={styles.timerText}>
          Resend OTP in 0:{timer.toString().padStart(2, '0')}
        </ThemedText>
      ) : (
        <Pressable onPress={handleResend}>
          <ThemedText style={styles.resendText}>Resend OTP</ThemedText>
        </Pressable>
      )}

      <Button
        onPress={handleVerify}
        style={styles.button}
        disabled={otp.join('').length !== 6}
      >
        Verify & Continue
      </Button>
    </ScreenScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: Spacing.xl,
    alignItems: 'center',
  },
  title: {
    marginTop: Spacing.xxl * 2,
    marginBottom: Spacing.sm,
  },
  subtitle: {
    color: Colors.light.textGray,
    textAlign: 'center',
    marginBottom: Spacing.xxl,
  },
  otpContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: Spacing.xl,
    gap: Spacing.md,
  },
  otpInput: {
    width: 48,
    height: 56,
    borderWidth: 2,
    borderRadius: BorderRadius.xs,
    textAlign: 'center',
    fontSize: 24,
    fontWeight: '600',
  },
  timerText: {
    color: Colors.light.textGray,
    marginBottom: Spacing.xxl,
  },
  resendText: {
    color: Colors.light.primary,
    fontWeight: '600',
    marginBottom: Spacing.xxl,
  },
  button: {
    width: '100%',
  },
});
