import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { ScreenScrollView } from '@/components/ScreenScrollView';
import { ThemedText } from '@/components/ThemedText';
import { Colors, Spacing, BorderRadius, Shadows } from '@/constants/theme';

export default function OrderTrackingScreen() {
  const steps = [
    { title: 'Order Placed', date: 'Jan 15, 2:30 PM', completed: true },
    { title: 'Order Confirmed', date: 'Jan 15, 3:00 PM', completed: true },
    { title: 'Shipped', date: 'Jan 16, 10:00 AM', completed: true },
    { title: 'Out for Delivery', date: '', completed: false },
    { title: 'Delivered', date: '', completed: false },
  ];

  return (
    <ScreenScrollView>
      <View style={styles.container}>
        <View style={styles.card}>
          <ThemedText type="h3">Order #12345</ThemedText>
          <ThemedText type="caption" style={styles.subtitle}>Estimated delivery: Jan 18, 2025</ThemedText>
        </View>

        <View style={styles.timeline}>
          {steps.map((step, index) => (
            <View key={index} style={styles.step}>
              <View style={styles.stepIndicator}>
                <View style={[styles.dot, step.completed && styles.dotCompleted]}>
                  {step.completed && <Feather name="check" size={16} color="#FFFFFF" />}
                </View>
                {index < steps.length - 1 && (
                  <View style={[styles.line, step.completed && styles.lineCompleted]} />
                )}
              </View>
              <View style={styles.stepContent}>
                <ThemedText style={[styles.stepTitle, step.completed && styles.stepTitleCompleted]}>
                  {step.title}
                </ThemedText>
                {step.date && <ThemedText type="caption" style={styles.stepDate}>{step.date}</ThemedText>}
              </View>
            </View>
          ))}
        </View>
      </View>
    </ScreenScrollView>
  );
}

const styles = StyleSheet.create({
  container: { padding: Spacing.lg },
  card: {
    backgroundColor: Colors.light.backgroundRoot,
    padding: Spacing.lg,
    borderRadius: BorderRadius.sm,
    marginBottom: Spacing.xl,
    ...Shadows.small,
  },
  subtitle: { color: Colors.light.textGray, marginTop: 4 },
  timeline: {},
  step: { flexDirection: 'row', marginBottom: Spacing.xl },
  stepIndicator: { alignItems: 'center', marginRight: Spacing.lg },
  dot: {
    width: 32,
    height: 32,
    borderRadius: 16,
    borderWidth: 2,
    borderColor: Colors.light.border,
    justifyContent: 'center',
    alignItems: 'center',
  },
  dotCompleted: { backgroundColor: Colors.light.primary, borderColor: Colors.light.primary },
  line: { width: 2, flex: 1, backgroundColor: Colors.light.border, marginTop: 4 },
  lineCompleted: { backgroundColor: Colors.light.primary },
  stepContent: { flex: 1, paddingTop: 4 },
  stepTitle: { fontWeight: '600', marginBottom: 2 },
  stepTitleCompleted: { color: Colors.light.primary },
  stepDate: { color: Colors.light.textGray },
});
