'use client';

import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { LoadingSpinner } from '@/components/common/LoadingSpinner';
import { ShareRoomCTA } from '@/components/session/ShareRoomCTA';
import { ShareSessionBottomSheet } from '@/components/session/ShareSessionBottomSheet';
import { TaskColumn } from '@/components/session/TaskColumn';
import { darkTheme, lightTheme } from '@/constants/Colors';
import { useTheme } from '@/contexts/ThemeContext';
import { useSession } from '@/hooks/useSession';
import { useNavigation } from '@react-navigation/native';
import { EllipsisVertical, Plus, UserRoundPlus } from 'lucide-react-native';
import React, { useLayoutEffect, useState, useRef } from 'react';
import { TouchableOpacity, View, FlatList, Dimensions, SafeAreaView, Text } from 'react-native';
import { NetworkError } from '@/components/common/NetworkError';
import { AnimatedChevronButton } from '@/components/common/AnimatedChevronButton';
import { FontAwesome } from '@expo/vector-icons';
import { TaskInputAccessory } from '@/components/session/TaskInputAccessory';
import { PaginationDots } from './PaginationDots';
import { SettingsBottomSheet } from '@/components/session/SettingsBottomSheet';
import { useAppSelector } from '@/store/hooks';

const { width } = Dimensions.get('window');

export default function SessionScreen() {
  const { resolvedTheme } = useTheme();
  const theme = resolvedTheme === 'dark' ? darkTheme : lightTheme;
  const navigation = useNavigation();
  const [taskSortOrder, setTaskSortOrder] = useState<'newest' | 'oldest'>('newest');
  const [showRankings, setShowRankings] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isShareOpen, setIsShareOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(0);
  const [showChevron, setShowChevron] = useState(false);
  const [isAddingTask, setIsAddingTask] = useState(false);
  const [newTask, setNewTask] = useState('');
  const [newTaskIsDone, setNewTaskIsDone] = useState(false);
  const flatListRef = useRef<FlatList>(null);

  // Handle toggle during task creation
  const handleToggleInEditMode = () => {
    setNewTaskIsDone(!newTaskIsDone);
  };

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

  // Get session from Redux store for updated name
  const sessionFromStore = useAppSelector(state => 
    session ? state.studyRooms.rooms.find(room => room.uuid === session.uuid) : undefined
  );

  // Use Redux session name if available, otherwise fall back to local session
  const currentSessionName = sessionFromStore?.name || session?.name;

  // Set navigation options
  useLayoutEffect(() => {
    navigation.setOptions({
      headerTitle: () => (
        <View className="flex-row items-center gap-2">
          <View className="p-2 rounded-full border" style={{ backgroundColor: theme.background.primary, borderColor: theme.border, borderWidth: 1 }}>
            <FontAwesome
              name="users"
              size={16}
              color={theme.typography.primary}
            />
          </View>
          <Text style={{ color: theme.typography.primary, fontSize: 16 }}>
            {loading ? 'loading...' : (session ? currentSessionName : 'Study Room')}
          </Text>
        </View>
      ),
      headerRight: () => (
        <View className="flex-row items-center">
          <TouchableOpacity
            onPress={() => setIsShareOpen(true)}
            className="flex-row items-center p-4 rounded-lg"
            activeOpacity={0.7}
          >
            <UserRoundPlus size={20} color={theme.typography.primary} />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => setIsSettingsOpen(true)}
            className="flex-row items-center p-4 rounded-lg"
            activeOpacity={0.7}
          >
            <EllipsisVertical size={20} color={theme.typography.primary} />
          </TouchableOpacity>
        </View>
      ),
    });
  }, [navigation, session, loading, currentSessionName]);



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

  const handleScroll = (event: any) => {
    // Handle scroll to update pagination dots
    const scrollPosition = event.nativeEvent.contentOffset.x;
    const pageWidth = (width * 0.75) + 20; // column width + separator width
    const currentIndex = Math.round(scrollPosition / pageWidth);
    setCurrentPage(currentIndex);
  };

  // Handle viewable items changed to show/hide chevron
  const onViewableItemsChanged = ({ viewableItems }: any) => {
    if (viewableItems.length > 0) {
      const firstVisibleIndex = viewableItems[0].index;
      setShowChevron(firstVisibleIndex >= 2);
    }
  };

  const viewabilityConfig = {
    itemVisiblePercentThreshold: 50,
  };

  // Handle chevron press to scroll back to first item
  const handleChevronPress = () => {
    flatListRef.current?.scrollToIndex({ index: 0, animated: true });
  };

  return (
    <ThemedView className="flex-1 py-4">
      <SafeAreaView className="flex-1">
        <SettingsBottomSheet
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
        <ShareSessionBottomSheet
          isOpen={isShareOpen}
          onClose={() => setIsShareOpen(false)}
          sessionId={session.uuid}
        />
        
        {/* Add Task Input Accessory */}
        <TaskInputAccessory
          isVisible={isAddingTask}
          onClose={() => {
            setIsAddingTask(false);
            setNewTask('');
            setNewTaskIsDone(false);
          }}
          mode="add"
          text={newTask}
          onTextChange={setNewTask}
          isToggled={newTaskIsDone}
          onToggle={handleToggleInEditMode}
          onSubmit={async () => {
            try {
              await handleAddTask(newTask.trim(), newTaskIsDone);
              setNewTask('');
              setNewTaskIsDone(false);
              setIsAddingTask(false);
            } catch (error) {
              // Error is handled by parent component
            }
          }}
          isSubmitting={taskState.isAddingTask}
        />

        <View className="flex-1">
        {/* Task input and controls */}
          {/* {currentParticipant && (
          <View className="gap-4 px-4 pb-4">
            <TaskInput
              onSubmit={handleAddTask}
              isAdding={taskState.isAddingTask}
              error={taskState.error}
            />
          </View>
          )} */}

          <TouchableOpacity 
            onPress={() => setIsAddingTask(true)}
            className="flex-row items-center justify-center gap-2 p-4 rounded-full border"
            style={{ 
              backgroundColor: theme.brand.background,
              borderColor: theme.border,
              position: 'absolute',
              bottom: 50,
              right: 20,
              zIndex: 1000,
              // shadowColor: '#000',
              // shadowOffset: {
              //   width: 0,
              //   height: 2,
              // },
              // shadowOpacity: 0.25,
              // shadowRadius: 3.84,
              // elevation: 5,
            }}
          >
            <Plus size={24} color={theme.brand.text} />
          </TouchableOpacity>

        {/* Task columns with horizontal scroll */}
        {participantColumnsData.length > 0 ? (
          <View className="flex-1">
            <FlatList
              ref={flatListRef}
              data={participantColumnsData}
              horizontal
              snapToInterval={(width * 0.75) + 20}
              snapToAlignment='center'
              decelerationRate="fast"
              showsHorizontalScrollIndicator={false}
              keyExtractor={item => item.id.toString()}
              // contentContainerStyle={{ paddingLeft: 4, paddingRight: 12 }}
              contentContainerStyle={
                participantColumnsData.length > 1
                  ? { marginHorizontal: 'auto' }
                  : { marginBottom: 48, marginHorizontal: 'auto' } // 48 = mb-12
              }
              ItemSeparatorComponent={() => <View style={{ width: 14 }} />}
              onScroll={handleScroll}
              scrollEventThrottle={16}
              onViewableItemsChanged={onViewableItemsChanged}
              viewabilityConfig={viewabilityConfig}
              renderItem={({ item }) => (
                <View
                  style={{ 
                    width: width * 0.75, 
                    minHeight: 200, 
                    backgroundColor: theme.background.secondary, 
                    borderColor: theme.border 
                  }}
                  className='rounded-lg overflow-hidden border'
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
            
            {/* Pagination dots */}
            {participantColumnsData.length > 1 ? (
              <PaginationDots
                count={participantColumnsData.length}
                current={currentPage}
                className="py-4 mb-12"
              />
            ) : (
              <View className="mb-12" />
            )}

            {/* Animated Chevron Button */}
            <AnimatedChevronButton
              show={showChevron}
              onPress={handleChevronPress}
            />
          </View>
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
        </View>
      </SafeAreaView>
    </ThemedView>
  );
}
