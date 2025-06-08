import { Stack } from 'expo-router';
import React from 'react';

import { darkTheme, lightTheme } from '@/constants/Colors';
import { useTheme } from '@/contexts/ThemeContext';

export default function ThemedStack() {
    const { resolvedTheme } = useTheme();
    const theme = resolvedTheme === 'dark' ? darkTheme : lightTheme;
  
    return (
        <Stack
            screenOptions={{
                headerStyle: {
                    backgroundColor: theme.background.primary,
                },
                headerTintColor: theme.typography.primary,  // ← this sets back arrow and back button text color
                // headerShadowVisible: false, // ✅ disables shadow cross-platform (React Navigation v6+)
                headerTitleStyle: {
                    color: theme.typography.primary,
                    fontSize: 16,
                },
            }}
        >
        <Stack.Screen
            name="index"
            options={{
                headerShown: false,
            }}
        />
        <Stack.Screen
            name="(auth)"
            options={{
                headerShown: false,
            }}
        />
        <Stack.Screen
            name="session"
        />
      </Stack>
    );
  }
  