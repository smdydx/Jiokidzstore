import React from 'react';
import { View, StyleSheet, Pressable } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { ScreenScrollView } from '@/components/ScreenScrollView';
import { ThemedText } from '@/components/ThemedText';
import { Colors, Spacing, BorderRadius } from '@/constants/theme';

export default function NotificationsScreen() {
  const notifications = [
    { id: '1', title: 'Order Delivered', message: 'Your order #12345 has been delivered', type: 'order', read: false },
    { id: '2', title: 'Flash Sale', message: 'Up to 60% OFF on kids fashion', type: 'promo', read: false },
    { id: '3', title: 'Order Shipped', message: 'Your order is on the way', type: 'order', read: true },
  ];

  return (
    <ScreenScrollView>
      <View style={styles.container}>
        {notifications.map((notif) => (
          <Pressable
            key={notif.id}
            style={[styles.notifCard, !notif.read && styles.unread]}
          >
            <View style={[styles.icon, notif.type === 'promo' && styles.promoIcon]}>
              <Feather
                name={notif.type === 'order' ? 'package' : 'tag'}
                size={20}
                color={notif.type === 'order' ? Colors.light.primary : Colors.light.warning}
              />
            </View>
            <View style={styles.notifContent}>
              <ThemedText style={styles.notifTitle}>{notif.title}</ThemedText>
              <ThemedText type="small" style={styles.notifMessage}>{notif.message}</ThemedText>
            </View>
            {!notif.read && <View style={styles.unreadDot} />}
          </Pressable>
        ))}
      </View>
    </ScreenScrollView>
  );
}

const styles = StyleSheet.create({
  container: { padding: Spacing.lg },
  notifCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: Spacing.lg,
    borderRadius: BorderRadius.sm,
    backgroundColor: Colors.light.backgroundRoot,
    marginBottom: Spacing.md,
  },
  unread: { backgroundColor: `${Colors.light.primary}10` },
  icon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: `${Colors.light.primary}20`,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: Spacing.md,
  },
  promoIcon: { backgroundColor: `${Colors.light.warning}20` },
  notifContent: { flex: 1 },
  notifTitle: { fontWeight: '600', marginBottom: 2 },
  notifMessage: { color: Colors.light.textGray },
  unreadDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: Colors.light.primary,
    marginLeft: Spacing.sm,
  },
});
