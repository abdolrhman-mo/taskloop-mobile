'use client';

import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { CustomSafeAreaView } from '@/components/common/CustomSafeAreaView';
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
import { TouchableOpacity, View, FlatList, Dimensions, SafeAreaView, RefreshControl } from 'react-native';
import { NetworkError } from '@/components/common/NetworkError';

const { width } = Dimensions.get('window');

export default function SessionScreen() {
  const { resolvedTheme } = useTheme();
  const theme = resolvedTheme === 'dark' ? darkTheme : lightTheme;
  const navigation = useNavigation();
  const [taskSortOrder, setTaskSortOrder] = useState<'newest' | 'oldest'>('newest');
  const [showRankings, setShowRankings] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isShareOpen, setIsShareOpen] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  const {
    session,
    tasks,
    user,
    loading,
    loadingTasks,
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
        <View className="flex-row items-center">
          <TouchableOpacity
            onPress={() => setIsSettingsOpen(true)}
            className="flex-row items-center gap-2 px-4 py-2 rounded-lg"
            activeOpacity={0.7}
          >
            <Settings size={20} color={theme.typography.primary} />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => setIsShareOpen(true)}
            className="flex-row items-center gap-2 px-4 py-2 rounded-lg"
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
      <NetworkError message={error} onRetry={() => {
        // reload the session data
        if (typeof window !== 'undefined') {
          window.location.reload();
        } else {
          // fallback: could call a refetch or navigation reset
        }
      }} />
    );
  }

  if (!session) {
    return (
      <ThemedView className="flex-1 justify-center items-center">
        <ThemedText className="text-center text-base">
          No study room found.
        </ThemedText>
      </ThemedView>
    );
  }

  if (!user) {
    return (
      <ThemedView className="flex-1 justify-center items-center">
        <ThemedText className="text-center text-base">
          Please log in to view this study room.
        </ThemedText>
      </ThemedView>
    );
  }

  if (!isParticipant) {
    return (
      <ThemedView className="flex-1 justify-center items-center">
        <ThemedText className="text-center text-base">
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
    <ThemedView className="flex-1 py-4">
      <SafeAreaView className="flex-1">
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
          <View className="gap-4 px-4 pb-4">
            <TaskInput
              onSubmit={handleAddTask}
              isAdding={taskState.isAddingTask}
              error={taskState.error}
            />
          </View>
        )}

        {/* Task columns with horizontal scroll */}
        {participantColumnsData.length > 0 ? (
          <FlatList
            data={participantColumnsData}
            horizontal
            snapToInterval={width * 0.8}
            decelerationRate="fast"
            showsHorizontalScrollIndicator={false}
            keyExtractor={item => item.id.toString()}
            // contentContainerStyle={{ paddingHorizontal: width * 0.15 }}
            className='px-2'
            renderItem={({ item }) => (
              <View 
                style={{ width: width * 0.8, minHeight: 200 }}
                className='px-2'
              >
                <TaskColumn
                  title={item.username}
                  tasks={participantTasks(item.id)}
                  isColumnOwner={item.isCurrentUser}
                  onToggleTask={handleToggleTask}
                  onDeleteTask={handleDeleteTask}
                  onEditTask={handleEditTask}
                  togglingTaskId={taskState.togglingTaskId}
                  completionPercentage={showRankings ? item.stats.completionPercentage : undefined}
                  isTasksLoading={loadingTasks}
                />
              </View>
            )}
            // refreshControl={
            //   <RefreshControl
            //     refreshing={refreshing}
            //     onRefresh={handleRefresh}
            //     tintColor={theme.brand.background}
            //   />
            // }
          />
        ) : (
          <FlatList
            data={[{ key: 'share' }]}
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ gap: 16, flex: 1 }}
            renderItem={() => (
              <View style={{ width: width * 0.8, minHeight: 200 }}>
                <ShareRoomCTA sessionId={session.uuid} />
              </View>
            )}
          />
        )}
      </SafeAreaView>
    </ThemedView>
  );
}
