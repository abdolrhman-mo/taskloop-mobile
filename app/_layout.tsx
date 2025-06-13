import React from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { AuthGuard } from '@/components/auth/AuthGuard';
import { ThemedStatusBar } from '@/components/common/ThemedStatusBar';
import ThemedStack from '@/components/navigation/ThemedStack';
import { ThemeProvider } from '@/contexts/ThemeContext';

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
