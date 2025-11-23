import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { ThemedText } from '@/components/ThemedText';
import { Button } from '@/components/Button';
import { Colors, Spacing } from '@/constants/theme';

export default function OrderConfirmationScreen() {
  return (
    <View style={styles.container}>
      <View style={styles.iconContainer}>
        <Feather name="check-circle" size={80} color={Colors.light.success} />
      </View>
      <ThemedText type="h1" style={styles.title}>Order Placed!</ThemedText>
      <ThemedText style={styles.subtitle}>
        Your order #12345 has been placed successfully
      </ThemedText>
      <ThemedText style={styles.delivery}>Estimated delivery: 3-5 business days</ThemedText>
      <View style={styles.buttons}>
        <Button>Track Order</Button>
        <Button style={styles.secondaryButton}>Continue Shopping</Button>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: Spacing.xxl },
  iconContainer: { marginBottom: Spacing.xl },
  title: { marginBottom: Spacing.sm, textAlign: 'center' },
  subtitle: { textAlign: 'center', color: Colors.light.textGray, marginBottom: Spacing.md },
  delivery: { textAlign: 'center', fontWeight: '600', marginBottom: Spacing.xxl },
  buttons: { width: '100%', gap: Spacing.md },
  secondaryButton: { backgroundColor: Colors.light.backgroundSecondary },
});
