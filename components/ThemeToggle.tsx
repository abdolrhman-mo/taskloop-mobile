'use client';

import { darkTheme, lightTheme } from '@/constants/Colors';
import { useTheme } from '@/contexts/ThemeContext';
import { Moon, Sun } from 'lucide-react-native';
import React, { useState } from 'react';
import { ActivityIndicator, Pressable, StyleSheet } from 'react-native';

export function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme();
  const [isPressed, setIsPressed] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const theme = resolvedTheme === 'dark' ? darkTheme : lightTheme;
  const isDarkMode = resolvedTheme === 'dark';

  const toggleTheme = async () => {
    try {
      setIsLoading(true);
      await setTheme(isDarkMode ? 'light' : 'dark');
    } catch (error) {
      console.error('Failed to toggle theme:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Pressable
      onPress={toggleTheme}
      onPressIn={() => setIsPressed(true)}
      onPressOut={() => setIsPressed(false)}
      disabled={isLoading}
      style={[
        styles.button,
        { 
          backgroundColor: `${theme.background.tertiary}${isPressed ? '30' : '20'}`,
          opacity: isLoading ? 0.5 : 1,
        }
      ]}
    >
      {isLoading ? (
        <ActivityIndicator size="small" color={theme.typography.primary} />
      ) : isDarkMode ? (
        <Sun size={18} color={theme.typography.primary} />
      ) : (
        <Moon size={18} color={theme.typography.primary} />
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    padding: 8,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: 36,
    minHeight: 36,
  },
}); 