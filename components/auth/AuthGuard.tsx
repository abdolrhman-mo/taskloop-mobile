import { darkTheme, lightTheme } from '@/constants/Colors';
import { useTheme } from '@/contexts/ThemeContext';
import { auth } from '@/utils/auth';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter, useSegments } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, View } from 'react-native';

// Define public routes that don't require authentication
const PUBLIC_ROUTES = ['/(auth)/login', '/(auth)/register'];

export function AuthGuard({ children }: { children: React.ReactNode }) {
  const [isReady, setIsReady] = useState(false);
  const segments = useSegments();
  const router = useRouter();
  const { resolvedTheme } = useTheme();
  const theme = resolvedTheme === 'dark' ? darkTheme : lightTheme;

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const isLoggedIn = await auth.isAuthenticated();
        const currentRoute = '/' + segments.join('/');

        // Allow access to public routes or if user is logged in
        if (PUBLIC_ROUTES.includes(currentRoute) || isLoggedIn) {
          setIsReady(true);
          return;
        }

        // Save intended route for redirect after login
        if (currentRoute.startsWith('/session/')) {
          await AsyncStorage.setItem('authRedirect', currentRoute);
        }

        // Redirect to login
        router.replace('/(auth)/login');
      } catch (error) {
        console.error('Auth check failed:', error);
        router.replace('/(auth)/login');
      }
    };

    checkAuth();
  }, [segments]);

  if (!isReady) {
    return (
      <View style={{ 
        flex: 1, 
        justifyContent: 'center', 
        alignItems: 'center',
        backgroundColor: theme.background.primary 
      }}>
        <ActivityIndicator size="large" color={theme.brand.background} />
      </View>
    );
  }

  return <>{children}</>;
} 