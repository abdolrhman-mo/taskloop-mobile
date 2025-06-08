'use client';

import { ThemedText } from '@/components/ThemedText';
import { ENDPOINTS } from '@/config/endpoints';
import { darkTheme, lightTheme } from '@/constants/Colors';
import { useTheme } from '@/contexts/ThemeContext';
import { useApi } from '@/hooks/useApi';
import { useNavigation, useRouter } from 'expo-router';
import React, { useState } from 'react';
import { ActivityIndicator, KeyboardAvoidingView, Platform, ScrollView, StyleSheet, TextInput, TouchableOpacity, View } from 'react-native';

interface CreateSessionResponse {
  uuid: string;
  name: string;
}

export default function CreateSessionScreen() {
  const { resolvedTheme } = useTheme();
  const theme = resolvedTheme === 'dark' ? darkTheme : lightTheme;
  const router = useRouter();
  const { post, get } = useApi();
  const [sessionName, setSessionName] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const navigation = useNavigation();

  React.useLayoutEffect(() => {
    navigation.setOptions({
      headerTitle: 'Create a study room',
    });
  }, [navigation]);

  // Poll for session creation status
  const checkSessionStatus = async (sessionId: string) => {
      try {
      const session = await get(ENDPOINTS.SESSIONS.READ.path(sessionId));
      if (session) {
        router.replace({
          pathname: '/session/[id]',
          params: { id: sessionId }
        });
      }
      } catch (err) {
      console.error('Failed to verify session:', err);
      // Keep polling if session is not ready
      setTimeout(() => checkSessionStatus(sessionId), 1000);
    }
  };

  const handleCreateSession = async () => {
    if (!sessionName.trim()) {
      setError('Please enter a session name');
      return;
    }

    try {
      setIsCreating(true);
      setError(null);
      const response = await post<CreateSessionResponse>(ENDPOINTS.SESSIONS.CREATE.path, { 
        name: sessionName.trim()
      });
      
      if (response.uuid) {
        // Start polling for session status
        checkSessionStatus(response.uuid);
      } else {
        throw new Error('No session UUID received');
      }
    } catch (err) {
      console.error('Failed to create session:', err);
      setError('Failed to create session. Please try again.');
      setIsCreating(false);
    }
  };

  return (
    <KeyboardAvoidingView 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={[styles.container, { backgroundColor: theme.background.primary }]}
    >
      <ScrollView 
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.content}>
          {/* <View style={styles.header}>
            <ThemedText style={styles.title}>Create New Session</ThemedText>
            <ThemedText style={[styles.subtitle, { color: theme.typography.secondary }]}>
              Start a new task sharing session
            </ThemedText>
          </View> */}
          
          <View style={[
            styles.form,
            { 
              backgroundColor: theme.background.secondary,
              borderColor: theme.border,
            }
          ]}>
            <View style={styles.inputGroup}>
              <ThemedText style={[styles.label, { color: theme.typography.primary }]}>
                  Study Room Name
              </ThemedText>
              <TextInput
                value={sessionName}
                onChangeText={setSessionName}
                  placeholder="Enter a name for your study room"
                placeholderTextColor={theme.typography.secondary}
                style={[
                  styles.input,
                  { 
                borderColor: theme.border,
                color: theme.typography.primary,
                    backgroundColor: theme.background.primary,
                  }
                ]}
              maxLength={50}
              autoFocus
                editable={!isCreating}
            />
            </View>

            {error && (
              <View style={[
                styles.errorContainer,
                { 
                    backgroundColor: `${theme.error.DEFAULT}20`,
                  borderColor: `${theme.error.DEFAULT}40`,
                }
              ]}>
                <ThemedText style={[styles.error, { color: theme.error.DEFAULT }]}>
                {error}
                </ThemedText>
              </View>
            )}

            <View style={styles.buttonGroup}>
              <TouchableOpacity
                onPress={() => router.back()}
                style={[
                  styles.button,
                  styles.cancelButton,
                  { 
                  backgroundColor: theme.background.primary,
                    borderColor: theme.border,
                  }
                ]}
                activeOpacity={0.8}
              >
                <ThemedText style={{ color: theme.typography.primary }}>
                Cancel
                </ThemedText>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={handleCreateSession}
                  disabled={!sessionName.trim() || isCreating}
                style={[
                  styles.button,
                  styles.createButton,
                  { 
                  backgroundColor: theme.brand.background,
                    opacity: (!sessionName.trim() || isCreating) ? 0.5 : 1
                  }
                ]}
                activeOpacity={0.8}
              >
                {isCreating ? (
                  <View style={styles.buttonContent}>
                    <ActivityIndicator size="small" color={theme.brand.text} />
                    <ThemedText style={[styles.buttonText, { color: theme.brand.text }]}>
                      Creating study room...
                    </ThemedText>
                  </View>
                ) : (
                  <ThemedText style={[styles.buttonText, { color: theme.brand.text }]}>
                    Create Study Room
                  </ThemedText>
                )}
              </TouchableOpacity>
            </View>
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
    maxWidth: 600,
    width: '100%',
    alignSelf: 'center',
  },
  header: {
    marginBottom: 24,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    marginBottom: 16,
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
  label: {
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 8,
  },
  input: {
    width: '100%',
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    borderRadius: 8,
    borderWidth: 1,
  },
  errorContainer: {
    padding: 16,
    borderRadius: 8,
    borderWidth: 1,
    marginBottom: 16,
  },
  error: {
    fontSize: 14,
    textAlign: 'center',
  },
  buttonGroup: {
    flexDirection: 'row',
    gap: 12,
  },
  button: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
  },
  cancelButton: {
    backgroundColor: 'transparent',
  },
  createButton: {
    minWidth: 120,
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
