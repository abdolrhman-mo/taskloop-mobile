import { PortalProvider } from '@gorhom/portal';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { Provider } from 'react-redux';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { AuthGuard } from '@/components/auth/AuthGuard';
import { ThemedStatusBar } from '@/components/common/ThemedStatusBar';
import ThemedStack from '@/components/navigation/ThemedStack';
import { ThemeProvider } from '@/contexts/ThemeContext';
import { store } from '@/store';
import './global.css';

export default function RootLayout() {
  return (
    <Provider store={store}>
      <GestureHandlerRootView style={{ flex: 1 }}>
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
      </GestureHandlerRootView>
    </Provider>
  );
}
