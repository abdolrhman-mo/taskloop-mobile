'use client';

import { SafeScrollView } from '@/components/common/SafeScrollView';
import { ThemedText } from '@/components/ThemedText';
import { ENDPOINTS } from '@/config/endpoints';
import { darkTheme, lightTheme } from '@/constants/Colors';
import { useTheme } from '@/contexts/ThemeContext';
import { useApi } from '@/hooks/useApi';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { ActivityIndicator, KeyboardAvoidingView, Platform, TextInput, TouchableOpacity, View } from 'react-native';

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

  const renderScreen1 = () => {
    return (
      <View>
        <ThemedText>Screen 1</ThemedText>
      </View>
    );
  };

  const renderScreen2 = () => {
    return (
      <View>
        <ThemedText>Screen 2</ThemedText>
      </View>
    );
  };

  return (
    <KeyboardAvoidingView 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      className="flex-1"
      style={{ backgroundColor: theme.background.primary }}
    >
      <SafeScrollView>
        <View className="flex-1 p-4 max-w-[600px] w-full self-center">
          <View 
            className="p-6 rounded-xl border"
            style={{ 
              backgroundColor: theme.background.secondary,
              borderColor: theme.border,
            }}
          >
            <View className="mb-4">
              <ThemedText className="text-sm font-medium mb-2" style={{ color: theme.typography.primary }}>
                  Study Room Name
              </ThemedText>
              <TextInput
                value={sessionName}
                onChangeText={setSessionName}
                  placeholder="Enter a name for your study room"
                placeholderTextColor={theme.typography.secondary}
                className="w-full px-4 py-3 text-base rounded-lg border"
                style={{ 
                borderColor: theme.border,
                color: theme.typography.primary,
                    backgroundColor: theme.background.primary,
                  }}
              maxLength={50}
              autoFocus
                editable={!isCreating}
            />
            </View>

            {error && (
              <View 
                className="p-4 rounded-lg border mb-4"
                style={{ 
                    backgroundColor: `${theme.error.DEFAULT}20`,
                  borderColor: `${theme.error.DEFAULT}40`,
                }}
              >
                <ThemedText className="text-sm text-center" style={{ color: theme.error.DEFAULT }}>
                {error}
                </ThemedText>
              </View>
            )}

            <View className="flex-row gap-3">
              <TouchableOpacity
                onPress={() => router.back()}
                className="flex-1 py-3 rounded-lg items-center justify-center border bg-transparent"
                style={{ 
                  borderColor: theme.border,
                }}
                activeOpacity={0.8}
              >
                <ThemedText className="text-base font-medium" style={{ color: theme.typography.primary }}>
                Cancel
                </ThemedText>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={handleCreateSession}
                disabled={!sessionName.trim() || isCreating}
                className="flex-1 min-w-[120px] py-3 rounded-lg items-center justify-center border"
                style={{ 
                  backgroundColor: theme.brand.background,
                  opacity: (!sessionName.trim() || isCreating) ? 0.5 : 1,
                  borderColor: theme.brand.background,
                }}
                activeOpacity={0.8}
              >
                {isCreating ? (
                  <View className="flex-row items-center gap-2">
                    <ActivityIndicator size="small" color={theme.brand.text} />
                    <ThemedText className="text-base font-medium" style={{ color: theme.brand.text }}>
                      Creating study room...
                    </ThemedText>
                  </View>
                ) : (
                  <ThemedText className="text-base font-medium" style={{ color: theme.brand.text }}>
                    Create Study Room
                  </ThemedText>
                )}
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </SafeScrollView>
    </KeyboardAvoidingView>
  );
}
