import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import WishlistScreen from "@/screens/main/WishlistScreen";
import { useTheme } from "@/hooks/useTheme";
import { getCommonScreenOptions } from "@/navigation/screenOptions";

export type WishlistStackParamList = {
  Wishlist: undefined;
};

const Stack = createNativeStackNavigator<WishlistStackParamList>();

export default function WishlistStackNavigator() {
  const { theme, isDark } = useTheme();

  return (
    <Stack.Navigator
      screenOptions={{
        ...getCommonScreenOptions({ theme, isDark }),
      }}
    >
      <Stack.Screen
        name="Wishlist"
        component={WishlistScreen}
        options={{ headerTitle: "My Wishlist" }}
      />
    </Stack.Navigator>
  );
}
