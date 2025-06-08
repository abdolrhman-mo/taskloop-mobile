import { ThemedText } from '@/components/ThemedText';
import { ENDPOINTS } from '@/config/endpoints';
import { darkTheme, lightTheme } from '@/constants/Colors';
import { useTheme } from '@/contexts/ThemeContext';
import { useApi } from '@/hooks/useApi';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { ActivityIndicator, KeyboardAvoidingView, Platform, ScrollView, StyleSheet, TextInput, TouchableOpacity, View } from 'react-native';

interface RegisterResponse {
  message: string;
  token: string;
}

export default function RegisterScreen() {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { post } = useApi();
  const { resolvedTheme } = useTheme();
  const theme = resolvedTheme === 'dark' ? darkTheme : lightTheme;

  const handleSubmit = async () => {
    if (!username || !email || !password || !confirmPassword) return;
    
    setLoading(true);
    setError(null);
    
    // Basic validation
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      setLoading(false);
      return;
    }

    try {
      const response = await post<RegisterResponse>(ENDPOINTS.AUTH.REGISTER.path, {
        username,
        email,
        password
      });

      // Store token in AsyncStorage
      await AsyncStorage.setItem('token', response.token);
      router.replace('/');
    } catch (err) {
      console.error(err);
      setError('Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <ScrollView 
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.content}>
          <View style={styles.header}>
            <ThemedText style={styles.title}>
              Create your account
            </ThemedText>
            <ThemedText style={[styles.subtitle, { color: theme.typography.secondary }]}>
              Already have an account?{' '}
              <ThemedText onPress={() => router.push('/(auth)/login')}>
                <ThemedText style={[styles.link, { color: theme.brand.background }]}>
                  Login
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
                autoComplete="username"
              />
              <TextInput
                value={email}
                onChangeText={setEmail}
                placeholder="Email address"
                placeholderTextColor={theme.typography.secondary}
                style={[
                  styles.input,
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
                  { 
                    borderColor: theme.border,
                    color: theme.typography.primary,
                  }
                ]}
                secureTextEntry
                autoComplete="password-new"
              />
              <TextInput
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                placeholder="Confirm Password"
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
                autoComplete="password-new"
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
                    Creating account...
                  </ThemedText>
                </View>
              ) : (
                <ThemedText style={[styles.buttonText, { color: theme.brand.text }]}>
                  Create Account
                </ThemedText>
              )}
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
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