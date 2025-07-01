import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { SafeAreaView, ScrollView, StyleSheet, TouchableOpacity, TouchableWithoutFeedback } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { LoadingSpinner } from '@/components/common/LoadingSpinner';
import { Nav } from '@/components/Nav';
import { CreateRoomCTA } from '@/components/sessions/CreateRoomCTA';
import { ErrorState } from '@/components/sessions/ErrorState';
import { SessionList } from '@/components/sessions/SessionList';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { ENDPOINTS } from '@/config/endpoints';
import { darkTheme, lightTheme, theme } from '@/constants/Colors';
import { useTheme } from '@/contexts/ThemeContext';
import { useApi } from '@/hooks/useApi';
import { Session, User } from '@/types/session';

interface LeaveState {
  sessionId: string | null;
  isLoading: boolean;
  error: string | null;
}

interface DeleteState {
  sessionId: string | null;
  isLoading: boolean;
  error: string | null;
}

export default function HomeScreen() {
  const { resolvedTheme } = useTheme();
  const theme = resolvedTheme === 'dark' ? darkTheme : lightTheme;
  const router = useRouter();
  const { get, post, delete: deleteRequest } = useApi();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const insets = useSafeAreaInsets();
  
  const [sessions, setSessions] = useState<Session[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [leaveState, setLeaveState] = useState<LeaveState>({
    sessionId: null,
    isLoading: false,
    error: null
  });
  const [deleteState, setDeleteState] = useState<DeleteState>({
    sessionId: null,
    isLoading: false,
    error: null
  });

  // Fetch current user data
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const userData = await get<User>(ENDPOINTS.AUTH.ME.path);
        setUser(userData);
      } catch (err) {
        console.error('Failed to fetch user data:', err);
      }
    };

    fetchUserData();
  }, [get]);

  const handleLeaveSession = async (sessionId: string) => {
    setLeaveState({
      sessionId,
      isLoading: true,
      error: null
    });

    try {
      await post(ENDPOINTS.SESSIONS.LEAVE.path(sessionId));
      setSessions(prevSessions => prevSessions.filter(s => s.uuid !== sessionId));
    } catch (err) {
      console.error('Failed to leave study room:', err);
      setLeaveState(prev => ({
        ...prev,
        error: 'Failed to leave study room. Please try again.'
      }));
    } finally {
      setTimeout(() => {
        setLeaveState({
          sessionId: null,
          isLoading: false,
          error: null
        });
      }, 1000);
    }
  };

  const handleDeleteSession = async (sessionId: string) => {
    setDeleteState({
      sessionId,
      isLoading: true,
      error: null
    });

    try {
      await deleteRequest(ENDPOINTS.SESSIONS.MANAGE.DELETE.path(sessionId));
      setSessions(prevSessions => prevSessions.filter(s => s.uuid !== sessionId));
    } catch (err) {
      console.error('Failed to delete study room:', err);
      setDeleteState(prev => ({
        ...prev,
        error: 'Failed to delete study room. Please try again.'
      }));
    } finally {
      setTimeout(() => {
        setDeleteState({
          sessionId: null,
          isLoading: false,
          error: null
        });
      }, 1000);
    }
  };

  useEffect(() => {
    const fetchSessions = async () => {
      setLoading(true);
      try {
        const data = await get<Session[]>(ENDPOINTS.SESSIONS.LIST.path);
        setSessions(data);
      } catch (err) {
        console.error(err);
        setError('Failed to load study rooms. Please try refreshing the page.');
      } finally {
        setLoading(false);
      }
    };
    fetchSessions();
  }, [get]);

  const handleLogout = async () => {
    try {
      await AsyncStorage.removeItem('token');
      router.replace({
        pathname: '/(auth)/login'
      });
    } catch (err) {
      console.error('Failed to logout:', err);
    }
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <Nav isDropdownOpen={isDropdownOpen} setIsDropdownOpen={setIsDropdownOpen} />
      <ThemedView style={[styles.container, { paddingTop: insets.top + 60 }]}>
        <ScrollView 
          style={styles.scrollView}
          contentContainerStyle={[
            styles.scrollContent,
            { paddingBottom: insets.bottom + 20 }
          ]}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          <TouchableWithoutFeedback onPress={() => setIsDropdownOpen(false)}>
            <ThemedView style={styles.content}>
              <ThemedView style={styles.header}>
                <ThemedView style={styles.headerContent}>
                  <ThemedText style={styles.title}>
                    Study Rooms
                  </ThemedText>
                  <TouchableOpacity
                    onPress={() => router.push('/session/create')}
                    style={[
                      styles.createButton,
                      { backgroundColor: theme.brand.background }
                    ]}>
                    <ThemedText style={[styles.createButtonText, { color: theme.brand.text }]}>
                      Start Study Room
                    </ThemedText>
                  </TouchableOpacity>
                  {/* Test button */}
                  <TouchableOpacity
                    onPress={() => router.push('/test')}
                    style={[
                      styles.createButton,
                      { backgroundColor: theme.brand.background }
                    ]}>
                    <ThemedText style={[styles.createButtonText, { color: theme.brand.text }]}>
                      Test
                    </ThemedText>
                  </TouchableOpacity>
                </ThemedView>
              </ThemedView>

              {loading && <LoadingSpinner containerStyle={styles.loadingContainer} />}
              
              {!loading && error && (
                <ErrorState 
                  message={error} 
                  onRetry={() => {
                    setError(null);
                    setLoading(true);
                  }} 
                />
              )}

              {!loading && !error && sessions.length === 0 && (
                <ThemedView style={styles.emptyState}>
                  <CreateRoomCTA />
                </ThemedView>
              )}

              {!loading && !error && sessions.length > 0 && (
                <SessionList 
                  sessions={sessions}
                  user={user}
                  onLeave={handleLeaveSession}
                  onDelete={handleDeleteSession}
                  leaveState={leaveState}
                  deleteState={deleteState}
                />
              )}
            </ThemedView>
          </TouchableWithoutFeedback>
        </ScrollView>
      </ThemedView>
    </SafeAreaView>
  );
} 

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    // Remove flexGrow to prevent gray area
  },
  content: {
    padding: 24,
    maxWidth: 1200,
    alignSelf: 'center',
    width: '100%',
  },
  header: {
    marginBottom: 32,
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    letterSpacing: -0.5,
  },
  createButton: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  createButtonText: {
    fontSize: 15,
    fontWeight: '600',
  },
  emptyState: {
    marginTop: 32,
    padding: 16,
    borderRadius: 8,
    backgroundColor: theme.background.secondary,
  },
  sessionList: {
    gap: 16,
  },
  sessionCard: {
    padding: 16,
    borderRadius: 8,
    backgroundColor: theme.background.secondary,
    gap: 8,
  },
  loadingContainer: {
    marginTop: 32,
    backgroundColor: theme.background.secondary,
    borderRadius: 8,
  },
});