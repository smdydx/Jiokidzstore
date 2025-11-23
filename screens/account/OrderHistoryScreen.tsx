import React from 'react';
import { View, StyleSheet, Pressable } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { ScreenScrollView } from '@/components/ScreenScrollView';
import { ThemedText } from '@/components/ThemedText';
import { Colors, Spacing, BorderRadius, Shadows } from '@/constants/theme';

export default function OrderHistoryScreen() {
  const orders = [
    { id: '12345', status: 'Delivered', date: '2 days ago', total: 1398, items: 2 },
    { id: '12344', status: 'In Transit', date: '5 days ago', total: 899, items: 1 },
  ];

  return (
    <ScreenScrollView>
      <View style={styles.container}>
        {orders.map((order) => (
          <Pressable key={order.id} style={styles.orderCard}>
            <View style={styles.orderHeader}>
              <ThemedText style={styles.orderId}>Order #{order.id}</ThemedText>
              <View style={[styles.statusBadge, order.status === 'Delivered' && styles.delivered]}>
                <ThemedText style={styles.statusText}>{order.status}</ThemedText>
              </View>
            </View>
            <ThemedText type="caption" style={styles.date}>{order.date}</ThemedText>
            <View style={styles.orderFooter}>
              <ThemedText>{order.items} items • ₹{order.total}</ThemedText>
              <Feather name="chevron-right" size={20} color={Colors.light.textGray} />
            </View>
          </Pressable>
        ))}
      </View>
    </ScreenScrollView>
  );
}

const styles = StyleSheet.create({
  container: { paddingHorizontal: Spacing.lg },
  orderCard: {
    backgroundColor: Colors.light.backgroundRoot,
    padding: Spacing.lg,
    borderRadius: BorderRadius.sm,
    marginBottom: Spacing.md,
    ...Shadows.small,
  },
  orderHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 4 },
  orderId: { fontWeight: '700' },
  statusBadge: {
    paddingHorizontal: Spacing.sm,
    paddingVertical: 2,
    borderRadius: 4,
    backgroundColor: Colors.light.warning,
  },
  delivered: { backgroundColor: Colors.light.success },
  statusText: { color: '#FFFFFF', fontSize: 12, fontWeight: '600' },
  date: { color: Colors.light.textGray, marginBottom: Spacing.md },
  orderFooter: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
});
