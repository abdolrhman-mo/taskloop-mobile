import { SessionCard } from '@/components/sessions/SessionCard';
import { ThemedText } from '@/components/ThemedText';
import { Session, User } from '@/types/session';
import React, { useMemo } from 'react';
import { View, useWindowDimensions } from 'react-native';

interface SessionListProps {
  sessions: Session[];
  user: User | null;
  onLeave: (sessionId: string) => Promise<void>;
  onDelete: (sessionId: string) => Promise<void>;
  leaveState: {
    sessionId: string | null;
    isLoading: boolean;
    error: string | null;
  };
  deleteState: {
    sessionId: string | null;
    isLoading: boolean;
    error: string | null;
  };
}

export function SessionList({ 
  sessions, 
  user, 
  onLeave, 
  onDelete,
  leaveState,
  deleteState
}: SessionListProps) {
  const { width } = useWindowDimensions();
  const sortedSessions = useMemo(() => {
    const sorted = [...sessions];
    sorted.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
    return sorted;
  }, [sessions]);

  // Calculate number of columns based on screen width
  const getColumnCount = () => {
    if (width >= 1024) return 3; // lg
    if (width >= 640) return 2;  // sm
    return 1;                    // default
  };

  const columnCount = getColumnCount();

  if (sessions.length === 0) {
    return null;
  }

  return (
    <View className="flex-1">
      {sortedSessions.length > 0 && (
        <View className="flex-1">
          <ThemedText type="title" className="text-xl font-semibold tracking-tight mb-2">
            My Study Rooms
          </ThemedText>
          <View 
            className="flex-col gap-4"
          >
            {sortedSessions.map(session => (
                <SessionCard 
                  key={session.uuid}
                  session={session}
                  user={user}
                  onLeave={onLeave}
                  onDelete={onDelete}
                  isLeaving={leaveState.sessionId === session.uuid && leaveState.isLoading}
                  isDeleting={deleteState.sessionId === session.uuid && deleteState.isLoading}
                  leaveError={leaveState.sessionId === session.uuid ? leaveState.error : null}
                  deleteError={deleteState.sessionId === session.uuid ? deleteState.error : null}
                />
            ))}
          </View>
        </View>
      
      )}
    </View>
  );
}

