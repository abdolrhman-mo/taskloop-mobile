import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { darkTheme, lightTheme } from '@/constants/Colors';
import { useTheme } from '@/contexts/ThemeContext';
import { AlertCircle, RefreshCw } from 'lucide-react-native';
import React from 'react';
import { StyleSheet, TouchableOpacity } from 'react-native';

interface ErrorStateProps {
  message?: string;
  onRetry?: () => void;
}

export function ErrorState({ 
  message = 'Something went wrong. Please try again.',
  onRetry 
}: ErrorStateProps) {
  const { resolvedTheme } = useTheme();
  const theme = resolvedTheme === 'dark' ? darkTheme : lightTheme;

  return (
    <ThemedView style={styles.container}>
      <AlertCircle 
        size={24} 
        color={theme.error.DEFAULT}
        style={styles.icon}
      />
      <ThemedText style={[styles.message, { color: theme.error.DEFAULT }]}>
        {message}
      </ThemedText>
      {onRetry && (
        <TouchableOpacity
          onPress={onRetry}
          style={[styles.retryButton, { backgroundColor: `${theme.error.DEFAULT}10` }]}
          activeOpacity={0.7}
        >
          <RefreshCw size={16} color={theme.error.DEFAULT} />
          <ThemedText style={[styles.retryText, { color: theme.error.DEFAULT }]}>
            Try Again
          </ThemedText>
        </TouchableOpacity>
      )}
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
    gap: 16,
  },
  icon: {
    marginBottom: 8,
  },
  message: {
    fontSize: 16,
    textAlign: 'center',
  },
  retryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
    marginTop: 8,
  },
  retryText: {
    fontSize: 14,
    fontWeight: '500',
  },
}); 