import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { darkTheme, lightTheme } from '@/constants/Colors';
import { useTheme } from '@/contexts/ThemeContext';
import React from 'react';
import { ActivityIndicator, StyleSheet, ViewStyle } from 'react-native';

interface LoadingSpinnerProps {
  text?: string;
  containerStyle?: ViewStyle;
  fullScreen?: boolean;
}

export function LoadingSpinner({ 
  text = 'Loading...', 
  containerStyle,
  fullScreen = false 
}: LoadingSpinnerProps) {
  const { resolvedTheme } = useTheme();
  const theme = resolvedTheme === 'dark' ? darkTheme : lightTheme;

  return (
    <ThemedView style={[
      styles.container,
      fullScreen ? styles.fullScreen : styles.inline,
      containerStyle
    ]}>
      <ActivityIndicator size="large" color={theme.brand.background} />
      <ThemedText style={styles.loadingText}>
        {text}
      </ThemedText>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    gap: 16,
  },
  fullScreen: {
    flex: 1,
    justifyContent: 'center',
  },
  inline: {
    padding: 16,
  },
  loadingText: {
    fontSize: 16,
    fontWeight: '500',
  },
}); 