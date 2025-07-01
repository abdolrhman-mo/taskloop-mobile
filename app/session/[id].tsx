'use client';

import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { LoadingSpinner } from '@/components/common/LoadingSpinner';
import { SafeScrollView } from '@/components/common/SafeScrollView';
import { SettingsMenu } from '@/components/session/SettingsMenu';
import { ShareRoomCTA } from '@/components/session/ShareRoomCTA';
import { ShareSessionMenu } from '@/components/session/ShareSessionMenu';
import { TaskColumn } from '@/components/session/TaskColumn';
import { TaskInput } from '@/components/session/TaskInput';
import { darkTheme, lightTheme } from '@/constants/Colors';
import { useTheme } from '@/contexts/ThemeContext';
import { useSession } from '@/hooks/useSession';
import { useNavigation } from '@react-navigation/native';
import { Settings, Share2 } from 'lucide-react-native';
import React, { useLayoutEffect, useState } from 'react';
import { StyleSheet, TouchableOpacity, View, FlatList, Dimensions } from 'react-native';

const { width } = Dimensions.get('window');

export default function SessionScreen() {
  const { resolvedTheme } = useTheme();
  const theme = resolvedTheme === 'dark' ? darkTheme : lightTheme;
  const navigation = useNavigation();
  const [taskSortOrder, setTaskSortOrder] = useState<'newest' | 'oldest'>('newest');
  const [showRankings, setShowRankings] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isShareOpen, setIsShareOpen] = useState(false);

  const {
    session,
    tasks,
    user,
    loading,
    error,
    isParticipant,
    currentParticipant,
    taskState,
    handleAddTask,
    handleToggleTask,
    handleDeleteTask,
    handleEditTask,
    handleLeaveSession,
    handleDeleteSession,
    getSortedTasks,
    getSortedParticipants
  } = useSession();

  // Set navigation options
  useLayoutEffect(() => {
    navigation.setOptions({
      headerTitle: loading ? 'loading...' : (session ? (session.name) : 'Study Room'),
      headerRight: () => (
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <TouchableOpacity
            onPress={() => setIsSettingsOpen(true)}
            style={[styles.triggerButton]}
            activeOpacity={0.7}
          >
            <Settings size={20} color={theme.typography.primary} />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => setIsShareOpen(true)}
            style={[styles.triggerButton]}
            activeOpacity={0.7}
          >
            <Share2 size={20} color={theme.typography.primary} />
          </TouchableOpacity>
        </View>
      ),
    });
  }, [navigation, session, loading]);

  // Loading state
  if (loading) {
    return (
      <LoadingSpinner fullScreen />
    );
  }

  // Error states
  if (error) {
    return (
      <ThemedView style={[styles.container, styles.centerContent]}>
        <ThemedText style={[styles.errorText, { color: theme.error.DEFAULT }]}>
          {error}
        </ThemedText>
      </ThemedView>
    );
  }

  if (!session) {
    return (
      <ThemedView style={[styles.container, styles.centerContent]}>
        <ThemedText style={styles.errorText}>
          No study room found.
        </ThemedText>
      </ThemedView>
    );
  }

  if (!user) {
    return (
      <ThemedView style={[styles.container, styles.centerContent]}>
        <ThemedText style={styles.errorText}>
          Please log in to view this study room.
        </ThemedText>
      </ThemedView>
    );
  }

  if (!isParticipant) {
    return (
      <ThemedView style={[styles.container, styles.centerContent]}>
        <ThemedText style={styles.errorText}>
          You are not a participant in this study room.
        </ThemedText>
      </ThemedView>
    );
  }

  // Get sorted participants with positions
  const sortedParticipants = getSortedParticipants(session.participants);
  const currentParticipantStats = sortedParticipants.find(
    stats => stats.id === user?.id
  );
  const otherParticipantStats = sortedParticipants.filter(
    stats => stats.id !== user?.id
  );

  // Get sorted tasks for each participant
  const participantTasks = (participantId: number) => {
    const participantTasks = tasks.filter(task => task.user === participantId);
    return getSortedTasks(participantTasks);
  };

  // Prepare data for FlatList: current participant first, then others
  const participantColumnsData = [
    ...(currentParticipant && currentParticipantStats ? [{
      id: currentParticipant.id,
      username: `${currentParticipant.username} (you)`,
      isCurrentUser: true,
      stats: currentParticipantStats,
    }] : []),
    ...otherParticipantStats.map(stats => ({
      id: stats.id,
      username: stats.username,
      isCurrentUser: false,
      stats,
    }))
  ];

  return (
    <ThemedView style={styles.container}>
      {/* <SafeScrollView style={styles.scrollView}> */}
        <View style={styles.content}>
          <View style={styles.mainContent}>
            <SettingsMenu
              isOpen={isSettingsOpen}
              onClose={() => setIsSettingsOpen(false)}
              session={session}
              isCreator={Boolean(user && session.creator === user.id)}
              onSessionUpdate={(updatedSession) => session && Object.assign(session, updatedSession)}
              onSessionLeave={handleLeaveSession}
              onSessionDelete={handleDeleteSession}
              taskSortOrder={taskSortOrder}
              onTaskSortChange={setTaskSortOrder}
              showRankings={showRankings}
              onShowRankingsChange={setShowRankings}
            />
            <ShareSessionMenu
              isOpen={isShareOpen}
              onClose={() => setIsShareOpen(false)}
              sessionId={session.uuid}
            />
            {/* Task input and controls */}
            {currentParticipant && (
              <View style={styles.taskInputContainer}>
                <TaskInput
                  onSubmit={handleAddTask}
                  isAdding={taskState.isAddingTask}
                  error={taskState.error}
                />
              </View>
            )}

            {/* Task columns with horizontal scroll */}
            <View style={styles.taskColumnsContainer}>
              {participantColumnsData.length > 0 ? (
                <FlatList
                  data={participantColumnsData}
                  horizontal
                  pagingEnabled
                  showsHorizontalScrollIndicator={false}
                  keyExtractor={item => item.id.toString()}
                  contentContainerStyle={styles.taskColumns}
                  renderItem={({ item }) => (
                    <View style={styles.taskColumn}>
                      <TaskColumn
                        title={item.username}
                        tasks={participantTasks(item.id)}
                        isColumnOwner={item.isCurrentUser}
                        onToggleTask={handleToggleTask}
                        onDeleteTask={handleDeleteTask}
                        onEditTask={handleEditTask}
                        togglingTaskId={taskState.togglingTaskId}
                        position={showRankings ? item.stats.position : undefined}
                        completionPercentage={showRankings ? item.stats.completionPercentage : undefined}
                      />
                    </View>
                  )}
                />
              ) : (
                <FlatList
                  data={[{ key: 'share' }]}
                  horizontal
                  pagingEnabled
                  showsHorizontalScrollIndicator={false}
                  contentContainerStyle={styles.taskColumns}
                  renderItem={() => (
                    <View style={styles.taskColumn}>
                      <ShareRoomCTA sessionId={session.uuid} />
                    </View>
                  )}
                />
              )}
            </View>
          </View>
        </View>
      {/* </SafeScrollView> */}
    </ThemedView>
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
    flexGrow: 1,
  },
  centerContent: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    width: '100%',
  },
  content: {
    flex: 1,
    padding: 16,
  },
  backButton: {
    marginBottom: 16,
  },
  mainContent: {
    flex: 1,
    gap: 16,
  },
  taskInputContainer: {
    gap: 16,
  },
  taskColumnsContainer: {
    flex: 1,
    minHeight: 200,
  },
  taskColumns: {
    flex: 1,
    gap: 16,
  },
  taskColumn: {
    width: width * 0.8,
    minHeight: 200,
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
  },
  errorText: {
    fontSize: 16,
    textAlign: 'center',
  },
  triggerButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
});
