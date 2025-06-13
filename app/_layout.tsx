import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { AuthGuard } from '@/components/auth/AuthGuard';
import ThemedStack from '@/components/navigation/ThemedStack';
import { ThemeProvider, useTheme } from '@/contexts/ThemeContext';

// Separate component to use theme context
function ThemedStatusBar() {
  const { resolvedTheme } = useTheme();
  return <StatusBar style={resolvedTheme === 'dark' ? 'light' : 'dark'} />;
}

export default function RootLayout() {
  return (
    <SafeAreaProvider>
      <ThemeProvider>
        <ThemedStatusBar />
        <AuthGuard>
          <ThemedStack />
        </AuthGuard>
      </ThemeProvider>
    </SafeAreaProvider>
  );
}
