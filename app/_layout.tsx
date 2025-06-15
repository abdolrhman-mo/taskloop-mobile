import { PortalProvider } from '@gorhom/portal';
import React from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { Provider } from 'react-redux';

import { AuthGuard } from '@/components/auth/AuthGuard';
import { ThemedStatusBar } from '@/components/common/ThemedStatusBar';
import ThemedStack from '@/components/navigation/ThemedStack';
import { ThemeProvider } from '@/contexts/ThemeContext';
import { store } from '@/store';

export default function RootLayout() {
  return (
    <Provider store={store}>
      <SafeAreaProvider>
        <ThemeProvider>
          <PortalProvider>
            <ThemedStatusBar />
            <AuthGuard>
              <ThemedStack />
            </AuthGuard>
          </PortalProvider>
        </ThemeProvider>
      </SafeAreaProvider>
    </Provider>
  );
}
