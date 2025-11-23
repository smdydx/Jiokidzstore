import React from 'react';
import { View, StyleSheet } from 'react-native';
import { ScreenScrollView } from '@/components/ScreenScrollView';
import { ThemedText } from '@/components/ThemedText';
import { Button } from '@/components/Button';
import { Colors, Spacing, BorderRadius, Shadows } from '@/constants/theme';

export default function OrderSummaryScreen() {
  return (
    <View style={styles.container}>
      <ScreenScrollView>
        <View style={styles.content}>
          <View style={styles.card}>
            <ThemedText type="h3">Order Summary</ThemedText>
            <View style={styles.row}>
              <ThemedText>Subtotal (2 items)</ThemedText>
              <ThemedText>₹1,398</ThemedText>
            </View>
            <View style={styles.row}>
              <ThemedText>Delivery Fee</ThemedText>
              <ThemedText style={styles.free}>FREE</ThemedText>
            </View>
            <View style={[styles.row, styles.totalRow]}>
              <ThemedText type="h3">Total</ThemedText>
              <ThemedText type="h3" style={styles.total}>₹1,398</ThemedText>
            </View>
          </View>
        </View>
      </ScreenScrollView>
      <View style={styles.footer}>
        <Button>Place Order</Button>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { padding: Spacing.lg },
  card: {
    backgroundColor: Colors.light.backgroundRoot,
    padding: Spacing.lg,
    borderRadius: BorderRadius.sm,
    ...Shadows.small,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: Spacing.md,
  },
  totalRow: {
    marginTop: Spacing.lg,
    paddingTop: Spacing.lg,
    borderTopWidth: 1,
    borderTopColor: Colors.light.border,
  },
  total: { color: Colors.light.primary },
  free: { color: Colors.light.success, fontWeight: '600' },
  footer: {
    padding: Spacing.lg,
    paddingBottom: 90,
    backgroundColor: Colors.light.backgroundRoot,
    borderTopWidth: 1,
    borderTopColor: Colors.light.border,
  },
});
