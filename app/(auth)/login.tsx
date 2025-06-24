import { SafeScrollView } from '@/components/common/SafeScrollView';
import { ThemedText } from '@/components/ThemedText';
import { ENDPOINTS } from '@/config/endpoints';
import { darkTheme, lightTheme } from '@/constants/Colors';
import { useTheme } from '@/contexts/ThemeContext';
import { useApi } from '@/hooks/useApi';
import { auth } from '@/utils/auth';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { ActivityIndicator, KeyboardAvoidingView, Platform, StyleSheet, TextInput, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

interface LoginResponse {
  message: string;
  token: string;
}

export default function LoginScreen() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { post } = useApi();
  const { resolvedTheme } = useTheme();
  const theme = resolvedTheme === 'dark' ? darkTheme : lightTheme;
  const insets = useSafeAreaInsets();

  const handleSubmit = async () => {
    if (!username || !password) return;
    
    setLoading(true);
    setError(null);

    try {
      const response = await post<LoginResponse>(ENDPOINTS.AUTH.LOGIN.path, {
        username,
        password
      });

      // Store token in AsyncStorage
      await auth.setToken(response.token);

      // Check for redirect route
      const redirectRoute = await AsyncStorage.getItem('authRedirect');
      if (redirectRoute) {
        await AsyncStorage.removeItem('authRedirect');
        router.replace(redirectRoute as any);
      } else {
        router.replace('/');
      }
    } catch (err) {
      console.error(err);
      setError('Login failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <SafeScrollView>
        <View style={styles.content}>
          <View style={styles.header}>
            <ThemedText style={styles.title}>
              Welcome back
            </ThemedText>
            <ThemedText style={[styles.subtitle, { color: theme.typography.secondary }]}>
              Don&apos;t have an account?{' '}
              <ThemedText onPress={() => router.push('/(auth)/register')}>
                <ThemedText style={[styles.link, { color: theme.brand.background }]}>
                  Sign up
                </ThemedText>
              </ThemedText>
            </ThemedText>
          </View>

          <View style={[
            styles.form,
            { 
              backgroundColor: theme.background.secondary,
              borderColor: theme.border,
            }
          ]}>
            <View style={styles.inputGroup}>
              <TextInput
                value={username}
                onChangeText={setUsername}
                placeholder="Username"
                placeholderTextColor={theme.typography.secondary}
                style={[
                  styles.input,
                  styles.inputTop,
                  { 
                    borderColor: theme.border,
                    color: theme.typography.primary,
                  }
                ]}
                autoCapitalize="none"
                keyboardType="email-address"
                autoComplete="email"
              />
              <TextInput
                value={password}
                onChangeText={setPassword}
                placeholder="Password"
                placeholderTextColor={theme.typography.secondary}
                style={[
                  styles.input,
                  styles.inputBottom,
                  { 
                    borderColor: theme.border,
                    color: theme.typography.primary,
                  }
                ]}
                secureTextEntry
                autoComplete="password"
              />
            </View>

            {error && (
              <ThemedText style={[styles.error, { color: theme.error.DEFAULT }]}>
                {error}
              </ThemedText>
            )}

            <TouchableOpacity
              onPress={handleSubmit}
              disabled={loading}
              style={[
                styles.button,
                { 
                  backgroundColor: theme.brand.background,
                  opacity: loading ? 0.5 : 1
                }
              ]}
              activeOpacity={0.8}
            >
              {loading ? (
                <View style={styles.buttonContent}>
                  <ActivityIndicator size="small" color={theme.brand.text} />
                  <ThemedText style={[styles.buttonText, { color: theme.brand.text }]}>
                    Signing in...
                  </ThemedText>
                </View>
              ) : (
                <ThemedText style={[styles.buttonText, { color: theme.brand.text }]}>
                  Sign in
                </ThemedText>
              )}
            </TouchableOpacity>
          </View>
        </View>
      </SafeScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    padding: 16,
    justifyContent: 'center',
  },
  header: {
    alignItems: 'center',
    marginBottom: 24,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
  },
  link: {
    fontWeight: '500',
  },
  form: {
    padding: 24,
    borderRadius: 12,
    borderWidth: 1,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  inputGroup: {
    marginBottom: 16,
  },
  input: {
    width: '100%',
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    borderWidth: 1,
  },
  inputTop: {
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
    borderBottomWidth: 0,
  },
  inputBottom: {
    borderBottomLeftRadius: 8,
    borderBottomRightRadius: 8,
  },
  error: {
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 16,
  },
  button: {
    width: '100%',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: '500',
  },
}); 