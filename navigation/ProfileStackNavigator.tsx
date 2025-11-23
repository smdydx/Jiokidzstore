import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import ProfileScreen from "@/screens/ProfileScreen";
import OrderHistoryScreen from "@/screens/account/OrderHistoryScreen";
import OrderTrackingScreen from "@/screens/account/OrderTrackingScreen";
import NotificationsScreen from "@/screens/account/NotificationsScreen";
import SavedAddressesScreen from "@/screens/account/SavedAddressesScreen";
import HelpSupportScreen from "@/screens/account/HelpSupportScreen";
import SettingsScreen from "@/screens/account/SettingsScreen";
import CrashScreen from "@/screens/CrashScreen";
import { useTheme } from "@/hooks/useTheme";
import { getCommonScreenOptions } from "@/navigation/screenOptions";

export type ProfileStackParamList = {
  Profile: undefined;
  OrderHistory: undefined;
  OrderTracking: { orderId: string };
  Notifications: undefined;
  SavedAddresses: undefined;
  HelpSupport: undefined;
  Settings: undefined;
  Crash: undefined;
};

const Stack = createNativeStackNavigator<ProfileStackParamList>();

export default function ProfileStackNavigator() {
  const { theme, isDark } = useTheme();

  return (
    <Stack.Navigator screenOptions={getCommonScreenOptions({ theme, isDark })}>
      <Stack.Screen
        name="Profile"
        component={ProfileScreen}
        options={{ title: "My Profile" }}
      />
      <Stack.Screen
        name="OrderHistory"
        component={OrderHistoryScreen}
        options={{ title: "My Orders" }}
      />
      <Stack.Screen
        name="OrderTracking"
        component={OrderTrackingScreen}
        options={{ title: "Track Order" }}
      />
      <Stack.Screen
        name="Notifications"
        component={NotificationsScreen}
        options={{ title: "Notifications" }}
      />
      <Stack.Screen
        name="SavedAddresses"
        component={SavedAddressesScreen}
        options={{ title: "My Addresses" }}
      />
      <Stack.Screen
        name="HelpSupport"
        component={HelpSupportScreen}
        options={{ title: "Help & Support" }}
      />
      <Stack.Screen
        name="Settings"
        component={SettingsScreen}
        options={{ title: "Settings" }}
      />
      <Stack.Screen
        name="Crash"
        component={CrashScreen}
        options={{ title: "Crash Test" }}
      />
    </Stack.Navigator>
  );
}
