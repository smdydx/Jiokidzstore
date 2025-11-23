import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import CategoriesScreen from "@/screens/main/CategoriesScreen";
import CategoryListingScreen from "@/screens/product/CategoryListingScreen";
import { useTheme } from "@/hooks/useTheme";
import { getCommonScreenOptions } from "@/navigation/screenOptions";

export type CategoriesStackParamList = {
  Categories: undefined;
  CategoryListing: { categoryId: string; categoryName: string };
};

const Stack = createNativeStackNavigator<CategoriesStackParamList>();

export default function CategoriesStackNavigator() {
  const { theme, isDark } = useTheme();

  return (
    <Stack.Navigator
      screenOptions={{
        ...getCommonScreenOptions({ theme, isDark }),
      }}
    >
      <Stack.Screen
        name="Categories"
        component={CategoriesScreen}
        options={{ headerTitle: "Categories" }}
      />
      <Stack.Screen
        name="CategoryListing"
        component={CategoryListingScreen}
        options={({ route }) => ({ headerTitle: route.params.categoryName })}
      />
    </Stack.Navigator>
  );
}
