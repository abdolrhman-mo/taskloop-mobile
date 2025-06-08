import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import React from 'react';
import { ActivityIndicator, StyleSheet } from 'react-native';

export function LoadingState() {
  return (
    <ThemedView style={styles.container}>
      <ActivityIndicator size="large" />
      <ThemedText style={styles.text}>Loading sessions...</ThemedText>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 16,
  },
  text: {
    fontSize: 16,
  },
}); 