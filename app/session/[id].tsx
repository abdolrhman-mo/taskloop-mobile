'use client';

import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { LoadingSpinner } from '@/components/common/LoadingSpinner';
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
import { ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native';

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

  return (
    <ThemedView style={styles.container}>
      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
      >
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

            {/* Task columns */}
            <View style={styles.taskColumnsContainer}>
            <View style={styles.taskColumns}>
                  {/* Current user's task column */}
                  {currentParticipant && currentParticipantStats && (
                <View style={styles.taskColumn}>
                      <TaskColumn
                        title={`${currentParticipant.username} (you)`}
                        tasks={participantTasks(currentParticipant.id)}
                        isColumnOwner={true}
                        onToggleTask={handleToggleTask}
                        onDeleteTask={handleDeleteTask}
                        onEditTask={handleEditTask}
                        togglingTaskId={taskState.togglingTaskId}
                        position={showRankings ? currentParticipantStats.position : undefined}
                        completionPercentage={showRankings ? currentParticipantStats.completionPercentage : undefined}
                      />
                </View>
                  )}

                  {/* Other participants' task columns or Share CTA */}
                  {otherParticipantStats.length > 0 ? (
                    otherParticipantStats.map(stats => (
                  <View key={stats.id} style={styles.taskColumn}>
                        <TaskColumn
                          title={stats.username}
                          tasks={participantTasks(stats.id)}
                          isColumnOwner={false}
                          onToggleTask={handleToggleTask}
                          onDeleteTask={handleDeleteTask}
                          onEditTask={handleEditTask}
                          togglingTaskId={taskState.togglingTaskId}
                          position={showRankings ? stats.position : undefined}
                          completionPercentage={showRankings ? stats.completionPercentage : undefined}
                        />
                  </View>
                    ))
                  ) : (
                <View style={styles.taskColumn}>
                      <ShareRoomCTA sessionId={session.uuid} />
                </View>
                  )}
              </View>
            </View>
          </View>
        </View>
      </ScrollView>
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
    flex: 1,
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
