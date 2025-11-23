import { ScrollView, ScrollViewProps, StyleSheet } from "react-native";

import { useTheme } from "@/hooks/useTheme";
import { useScreenInsets } from "@/hooks/useScreenInsets";
import { useResponsive } from "@/hooks/useResponsive";

export function ScreenScrollView({
  children,
  contentContainerStyle,
  style,
  keyboardShouldPersistTaps, // Added this prop based on the changes snippet
  ...scrollViewProps
}: ScrollViewProps) {
  const { theme } = useTheme();
  const { paddingTop, paddingBottom, scrollInsetBottom } = useScreenInsets();
  const { padding } = useResponsive();

  return (
    <ScrollView
      style={[
        styles.container,
        { backgroundColor: theme.backgroundRoot },
        style,
      ]}
      contentContainerStyle={[
        {
          paddingTop,
          paddingBottom,
        },
        contentContainerStyle,
      ]}
      scrollIndicatorInsets={{ bottom: scrollInsetBottom }}
      keyboardShouldPersistTaps={keyboardShouldPersistTaps}
      {...scrollViewProps}
    >
      {children}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});