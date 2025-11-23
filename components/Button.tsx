
import React from "react";
import { StyleSheet, Pressable, ActivityIndicator } from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";

import { ThemedText } from "@/components/ThemedText";
import { useTheme } from "@/hooks/useTheme";
import { useResponsive } from "@/hooks/useResponsive";
import { BorderRadius } from "@/constants/theme";

type ButtonVariant = "primary" | "secondary" | "outline";

interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: ButtonVariant;
  disabled?: boolean;
  loading?: boolean;
  fullWidth?: boolean;
  icon?: React.ReactNode;
}

export function Button({
  title,
  onPress,
  variant = "primary",
  disabled = false,
  loading = false,
  fullWidth = false,
  icon,
}: ButtonProps) {
  const { theme } = useTheme();
  const { buttonHeight, fontSize, spacing } = useResponsive();
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const handlePressIn = () => {
    scale.value = withSpring(0.95);
  };

  const handlePressOut = () => {
    scale.value = withSpring(1);
  };

  const getButtonStyle = () => {
    const baseStyle = {
      height: buttonHeight,
      paddingHorizontal: spacing.xl,
      borderRadius: BorderRadius.sm,
    };

    switch (variant) {
      case "primary":
        return {
          ...baseStyle,
          backgroundColor: disabled ? theme.border : theme.primary,
        };
      case "secondary":
        return {
          ...baseStyle,
          backgroundColor: disabled ? theme.border : theme.secondary,
        };
      case "outline":
        return {
          ...baseStyle,
          backgroundColor: "transparent",
          borderWidth: 2,
          borderColor: disabled ? theme.border : theme.primary,
        };
    }
  };

  const getTextColor = () => {
    if (disabled) return theme.textGray;
    switch (variant) {
      case "primary":
        return theme.buttonText;
      case "secondary":
        return theme.text;
      case "outline":
        return theme.primary;
    }
  };

  return (
    <Animated.View style={[animatedStyle, fullWidth && styles.fullWidth]}>
      <Pressable
        onPress={onPress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        disabled={disabled || loading}
        style={[styles.button, getButtonStyle()]}
      >
        {loading ? (
          <ActivityIndicator color={getTextColor()} />
        ) : (
          <>
            {icon}
            <ThemedText
              style={[
                styles.text,
                { color: getTextColor(), fontSize: fontSize.md },
                icon && styles.textWithIcon,
              ]}
            >
              {title}
            </ThemedText>
          </>
        )}
      </Pressable>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  button: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  text: {
    fontWeight: "600",
  },
  textWithIcon: {
    marginLeft: 8,
  },
  fullWidth: {
    width: "100%",
  },
});
