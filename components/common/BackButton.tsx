import { darkTheme, lightTheme } from '@/constants/Colors';
import { useTheme } from '@/contexts/ThemeContext';
import { useRouter } from 'expo-router';
import { ArrowLeft } from 'lucide-react-native';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity } from 'react-native';

interface BackButtonProps {
  href: '/(tabs)' | '/(tabs)/profile' | '/';
}

export function BackButton({ href }: BackButtonProps) {
  const { resolvedTheme } = useTheme();
  const theme = resolvedTheme === 'dark' ? darkTheme : lightTheme;
  const router = useRouter();

  return (
    <TouchableOpacity 
      onPress={() => router.back()}
      style={[
        styles.container,
        { backgroundColor: `${theme.brand.background}10` }
      ]}
      activeOpacity={0.7}
    >
      <ArrowLeft 
        size={20} 
        color={theme.typography.primary}
        style={styles.icon}
      />
      <Text style={[styles.text, { color: theme.typography.primary }]}>
        Back to Home
      </Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    padding: 8,
    borderRadius: 8,
    marginTop: 16,
  },
  icon: {
    marginTop: 1,
  },
  text: {
    fontSize: 14,
    fontWeight: '500',
  },
}); 