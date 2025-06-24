import { SafeScrollView } from '@/components/common/SafeScrollView';
import { ThemedText } from '@/components/ThemedText';
import { ENDPOINTS } from '@/config/endpoints';
import { darkTheme, lightTheme } from '@/constants/Colors';
import { useTheme } from '@/contexts/ThemeContext';
import { useApi } from '@/hooks/useApi';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { ActivityIndicator, KeyboardAvoidingView, Platform, StyleSheet, TextInput, TouchableOpacity, View } from 'react-native';

interface RegisterResponse {
  message: string;
  token: string;
}

export default function RegisterScreen() {
  const { resolvedTheme } = useTheme();
  const theme = resolvedTheme === 'dark' ? darkTheme : lightTheme;
  const router = useRouter();
  const { post } = useApi();
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async () => {
    if (!formData.username || !formData.email || !formData.password || !formData.confirmPassword) return;
    
    setIsLoading(true);
    setError(null);
    
    // Basic validation
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      setIsLoading(false);
      return;
    }

    try {
      const response = await post<RegisterResponse>(ENDPOINTS.AUTH.REGISTER.path, {
        username: formData.username,
        email: formData.email,
        password: formData.password
      });

      // Store token in AsyncStorage
      await AsyncStorage.setItem('token', response.token);
      router.replace('/');
    } catch (err) {
      console.error(err);
      setError('Registration failed. Please try again.');
    } finally {
      setIsLoading(false);
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
                value={formData.username}
                onChangeText={(text) => setFormData({ ...formData, username: text })}
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
                value={formData.email}
                onChangeText={(text) => setFormData({ ...formData, email: text })}
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
                value={formData.password}
                onChangeText={(text) => setFormData({ ...formData, password: text })}
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
                value={formData.confirmPassword}
                onChangeText={(text) => setFormData({ ...formData, confirmPassword: text })}
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
              disabled={isLoading}
              style={[
                styles.button,
                { 
                  backgroundColor: theme.brand.background,
                  opacity: isLoading ? 0.5 : 1
                }
              ]}
              activeOpacity={0.8}
            >
              {isLoading ? (
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