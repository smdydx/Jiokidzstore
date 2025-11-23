import React from 'react';
import { View, StyleSheet, Pressable, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Feather } from '@expo/vector-icons';
import { ScreenScrollView } from '@/components/ScreenScrollView';
import { ThemedText } from '@/components/ThemedText';
import { useAuth } from '@/hooks/useAuth';
import { useTheme } from '@/hooks/useTheme';
import { Colors, Spacing, BorderRadius, Shadows } from '@/constants/theme';
import type { ProfileStackParamList } from '@/navigation/ProfileStackNavigator';

interface MenuItemProps {
  icon: string;
  title: string;
  onPress: () => void;
  badge?: number;
  danger?: boolean;
}

function MenuItem({ icon, title, onPress, badge, danger }: MenuItemProps) {
  return (
    <Pressable
      style={({ pressed }) => [
        styles.menuItem,
        pressed && styles.menuItemPressed,
      ]}
      onPress={onPress}
    >
      <View style={styles.menuItemLeft}>
        <View style={[styles.iconContainer, danger && styles.iconContainerDanger]}>
          <Feather name={icon as any} size={20} color={danger ? Colors.light.error : Colors.light.primary} />
        </View>
        <ThemedText style={[styles.menuItemText, danger && styles.menuItemTextDanger]}>
          {title}
        </ThemedText>
      </View>
      <View style={styles.menuItemRight}>
        {badge !== undefined && badge > 0 && (
          <View style={styles.menuBadge}>
            <ThemedText style={styles.menuBadgeText}>{badge}</ThemedText>
          </View>
        )}
        <Feather name="chevron-right" size={20} color={Colors.light.textGray} />
      </View>
    </Pressable>
  );
}

export default function ProfileScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<ProfileStackParamList>>();
  const { user, signOut } = useAuth();
  const { theme } = useTheme();

  const handleLogout = async () => {
    await signOut();
  };

  return (
    <ScreenScrollView>
      <View style={styles.header}>
        <View style={styles.avatarContainer}>
          <View style={styles.avatar}>
            <Feather name="user" size={40} color={Colors.light.primary} />
          </View>
        </View>
        <ThemedText type="h2" style={styles.userName}>
          {user?.name || 'User'}
        </ThemedText>
        <ThemedText style={styles.userPhone}>
          {user?.phone || user?.email || ''}
        </ThemedText>
      </View>

      <View style={styles.section}>
        <MenuItem
          icon="edit-2"
          title="Edit Profile"
          onPress={() => navigation.navigate('EditProfile')}
        />
        <MenuItem
          icon="package"
          title="My Orders"
          onPress={() => navigation.navigate('OrderHistory')}
          badge={2}
        />
        <MenuItem
          icon="heart"
          title="My Wishlist"
          onPress={() => navigation.getParent()?.navigate('WishlistTab' as any)}
        />
        <MenuItem
          icon="map-pin"
          title="Saved Addresses"
          onPress={() => navigation.navigate('SavedAddresses')}
        />
        <MenuItem
          icon="bell"
          title="Notifications"
          onPress={() => navigation.navigate('Notifications')}
          badge={5}
        />
      </View>

      <View style={styles.section}>
        <MenuItem
          icon="help-circle"
          title="Help & Support"
          onPress={() => navigation.navigate('HelpSupport')}
        />
        <MenuItem
          icon="settings"
          title="Settings"
          onPress={() => navigation.navigate('Settings')}
        />
      </View>

      <View style={styles.section}>
        <MenuItem
          icon="log-out"
          title="Logout"
          onPress={handleLogout}
          danger
        />
      </View>
    </ScreenScrollView>
  );
}

const styles = StyleSheet.create({
  header: {
    alignItems: 'center',
    paddingVertical: Spacing.xxl,
  },
  avatarContainer: {
    marginBottom: Spacing.lg,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: Colors.light.backgroundSecondary,
    justifyContent: 'center',
    alignItems: 'center',
    ...Shadows.medium,
  },
  userName: {
    marginBottom: Spacing.xs,
  },
  userPhone: {
    color: Colors.light.textGray,
  },
  section: {
    marginBottom: Spacing.xl,
    paddingHorizontal: Spacing.lg,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: Spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: Colors.light.border,
  },
  menuItemPressed: {
    opacity: 0.7,
  },
  menuItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.light.backgroundSecondary,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: Spacing.md,
  },
  iconContainerDanger: {
    backgroundColor: `${Colors.light.error}15`,
  },
  menuItemText: {
    fontSize: 16,
    fontWeight: '500',
  },
  menuItemTextDanger: {
    color: Colors.light.error,
  },
  menuItemRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  menuBadge: {
    minWidth: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: Colors.light.primary,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 6,
    marginRight: Spacing.sm,
  },
  menuBadgeText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '700',
  },
});
