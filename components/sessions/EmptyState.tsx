import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { darkTheme, lightTheme } from '@/constants/Colors';
import { useTheme } from '@/contexts/ThemeContext';
import { PlusCircle } from 'lucide-react-native';
import React from 'react';
import { StyleSheet, TouchableOpacity } from 'react-native';

interface EmptyStateProps {
  onCreatePress?: () => void;
}

export function EmptyState({ onCreatePress }: EmptyStateProps) {
  const { resolvedTheme } = useTheme();
  const theme = resolvedTheme === 'dark' ? darkTheme : lightTheme;

  return (
    <ThemedView style={styles.container}>
      <PlusCircle 
        size={32} 
        color={theme.brand.background}
        style={styles.icon}
      />
      <ThemedText style={styles.title}>
        No Study Rooms Yet
      </ThemedText>
      <ThemedText style={[styles.description, { color: theme.typography.secondary }]}>
        Create your first study room to get started!
      </ThemedText>
      {onCreatePress && (
        <TouchableOpacity
          onPress={onCreatePress}
          style={[styles.button, { backgroundColor: theme.brand.background }]}
          activeOpacity={0.7}
        >
          <ThemedText style={[styles.buttonText, { color: theme.brand.text }]}>
            Create Study Room
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
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  description: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 8,
  },
  button: {
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    marginTop: 8,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: '500',
  },
}); 