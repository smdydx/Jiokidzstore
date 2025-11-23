import React, { useState } from 'react';
import { StyleSheet, TextInput as RNTextInput, View, TextInputProps, Pressable } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Feather } from '@expo/vector-icons';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import { Colors, Spacing, BorderRadius } from '@/constants/theme';

interface ModernInputProps extends TextInputProps {
  icon?: string;
  rightIcon?: string;
  onRightIconPress?: () => void;
  error?: boolean;
  focused?: boolean;
}

export function ModernInput({
  icon,
  rightIcon,
  onRightIconPress,
  error,
  focused: externalFocused,
  ...props
}: ModernInputProps) {
  const [internalFocused, setInternalFocused] = useState(false);
  const isFocused = externalFocused ?? internalFocused;
  const borderColor = useSharedValue(0);

  const handleFocus = () => {
    setInternalFocused(true);
    borderColor.value = withTiming(1, { duration: 300 });
  };

  const handleBlur = () => {
    setInternalFocused(false);
    borderColor.value = withTiming(0, { duration: 300 });
  };

  const animatedStyle = useAnimatedStyle(() => ({
    borderColor: borderColor.value === 0 ? Colors.light.border : Colors.light.primary,
    shadowOpacity: borderColor.value === 0 ? 0.05 : 0.15,
  }));

  return (
    <Animated.View style={[styles.container, animatedStyle]}>
      <LinearGradient
        colors={['rgba(255,255,255,0.8)', 'rgba(255,255,255,0.95)']}
        style={styles.gradient}
      >
        <View style={styles.inputWrapper}>
          {icon && <Feather name={icon as any} size={18} color={Colors.light.textGray} />}
          <RNTextInput
            {...props}
            onFocus={handleFocus}
            onBlur={handleBlur}
            style={[styles.input, icon && { marginLeft: Spacing.md }]}
            placeholderTextColor={Colors.light.textGray}
          />
          {rightIcon && (
            <Pressable onPress={onRightIconPress}>
              <Feather name={rightIcon as any} size={18} color={Colors.light.primary} />
            </Pressable>
          )}
        </View>
      </LinearGradient>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    borderWidth: 1.5,
    borderRadius: BorderRadius.md,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 3,
  },
  gradient: {
    padding: 0,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
    gap: Spacing.md,
  },
  input: {
    flex: 1,
    color: Colors.light.text,
    fontSize: 16,
    fontWeight: '500',
  },
});
