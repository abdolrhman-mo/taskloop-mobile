import { ThemedText } from '@/components/ThemedText';
import { darkTheme, lightTheme } from '@/constants/Colors';
import { useTheme } from '@/contexts/ThemeContext';
import { Session } from '@/types/session';
import React from 'react';
import { StyleSheet, View } from 'react-native';

interface SessionHeaderProps {
  session: Session;
}

export function SessionHeader({ session }: SessionHeaderProps) {
  const { resolvedTheme } = useTheme();
  const theme = resolvedTheme === 'dark' ? darkTheme : lightTheme;

  return (
    <View style={[styles.container, { backgroundColor: theme.background.secondary }]}> 
      <ThemedText style={[styles.label, { color: theme.typography.secondary }]}>Study Room</ThemedText>
      <ThemedText style={[styles.title, { color: theme.typography.primary }]}>{session.name}</ThemedText>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    paddingVertical: 20,
    paddingHorizontal: 16,
    borderRadius: 12,
    marginBottom: 16,
    alignItems: 'flex-start',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 2,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 4,
    letterSpacing: 0.5,
    textTransform: 'uppercase',
  },
  title: {
    fontSize: 24,
    fontWeight: '800',
    letterSpacing: -0.5,
  },
}); 