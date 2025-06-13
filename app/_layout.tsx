import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { useColorScheme } from 'react-native';

import { AuthGuard } from '@/components/auth/AuthGuard';
import ThemedStack from '@/components/navigation/ThemedStack';
import { ThemeProvider } from '@/contexts/ThemeContext';

export default function RootLayout() {
  const colorScheme = useColorScheme();

  return (
      <ThemeProvider>
        <StatusBar style={colorScheme === 'dark' ? 'light' : 'dark'} />
        <AuthGuard>
          <ThemedStack />
          {/* <StatusBar style="dark" /> */}
        </AuthGuard>
      </ThemeProvider>
  );
}
