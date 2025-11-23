
import React from "react";
import { FlatList, FlatListProps, StyleSheet } from "react-native";

import { useTheme } from "@/hooks/useTheme";
import { useScreenInsets } from "@/hooks/useScreenInsets";
import { useResponsive } from "@/hooks/useResponsive";

export function ScreenFlatList<T>({
  contentContainerStyle,
  style,
  ...flatListProps
}: FlatListProps<T>) {
  const { theme } = useTheme();
  const { paddingTop, paddingBottom, scrollInsetBottom } = useScreenInsets();
  const { padding } = useResponsive();

  return (
    <FlatList
      style={[
        styles.container,
        { backgroundColor: theme.backgroundRoot },
        style,
      ]}
      contentContainerStyle={[
        {
          paddingTop,
          paddingBottom,
          paddingHorizontal: padding,
        },
        contentContainerStyle,
      ]}
      scrollIndicatorInsets={{ bottom: scrollInsetBottom }}
      {...flatListProps}
    />
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
