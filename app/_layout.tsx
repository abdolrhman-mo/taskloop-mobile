import React from 'react';
import { useColorScheme } from 'react-native';

import { AuthGuard } from '@/components/auth/AuthGuard';
import ThemedStack from '@/components/navigation/ThemedStack';
import { ThemeProvider } from '@/contexts/ThemeContext';

export default function RootLayout() {
  const colorScheme = useColorScheme();

  return (
      <ThemeProvider>
        <AuthGuard>
          <ThemedStack />
        </AuthGuard>
      </ThemeProvider>
  );
}
