import React from 'react';
import { StyleSheet, View, Pressable, Text } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Feather } from '@expo/vector-icons';
import { Colors, Spacing, BorderRadius } from '@/constants/theme';

interface ModernHeaderProps {
  onNotificationPress?: () => void;
  notificationCount?: number;
}

export function ModernHeader({ onNotificationPress, notificationCount = 0 }: ModernHeaderProps) {
  return (
    <LinearGradient
      colors={['#FFB6D9', '#FFE5EE']}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={styles.container}
    >
      <View style={styles.content}>
        {/* Location Section */}
        <Pressable style={styles.locationSection}>
          <Feather name="map-pin" size={16} color={Colors.light.primary} />
          <Text style={styles.locationText}>Delhi NCR</Text>
        </Pressable>

        {/* Right Icons */}
        <View style={styles.rightSection}>
          {/* Notification */}
          <Pressable style={styles.iconButton} onPress={onNotificationPress}>
            <Feather name="bell" size={20} color={Colors.light.text} />
            {notificationCount > 0 && (
              <View style={styles.badge}>
                <Text style={styles.badgeText}>{notificationCount}</Text>
              </View>
            )}
          </Pressable>

          {/* Share */}
          <Pressable style={styles.iconButton}>
            <Feather name="share-2" size={20} color={Colors.light.text} />
          </Pressable>
        </View>
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  content: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  locationSection: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    backgroundColor: 'rgba(255,255,255,0.7)',
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.md,
  },
  locationText: {
    fontSize: 13,
    fontWeight: '600',
    color: Colors.light.text,
  },
  rightSection: {
    flexDirection: 'row',
    gap: Spacing.md,
  },
  iconButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(255,255,255,0.7)',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  badge: {
    position: 'absolute',
    top: -4,
    right: -4,
    backgroundColor: Colors.light.error,
    width: 20,
    height: 20,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
  badgeText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: '700',
  },
});
