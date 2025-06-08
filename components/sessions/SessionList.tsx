import { SessionCard } from '@/components/sessions/SessionCard';
import { ThemedText } from '@/components/ThemedText';
import { Session, User } from '@/types/session';
import React, { useMemo } from 'react';
import { StyleSheet, View, useWindowDimensions } from 'react-native';

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

  const latestSession = sortedSessions.length > 0 ? sortedSessions[0] : null;
  const otherSessions = sortedSessions.length > 1 ? sortedSessions.slice(1) : [];

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
    <View style={styles.container}>
      {latestSession && (
        <View style={styles.latestSection}>
          <ThemedText type="title" style={styles.sectionTitle}>
            Latest Room
          </ThemedText>
          <SessionCard 
            session={latestSession} 
            user={user}
            isFeatured={true}
            onLeave={onLeave}
            onDelete={onDelete}
            isLeaving={leaveState.sessionId === latestSession.uuid && leaveState.isLoading}
            isDeleting={deleteState.sessionId === latestSession.uuid && deleteState.isLoading}
            leaveError={leaveState.sessionId === latestSession.uuid ? leaveState.error : null}
            deleteError={deleteState.sessionId === latestSession.uuid ? deleteState.error : null}
          />
        </View>
      )}

      {otherSessions.length > 0 && (
        <View style={styles.otherSection}>
          <ThemedText type="title" style={styles.sectionTitle}>
            {latestSession ? 'Other Active Rooms' : 'All Rooms'}
          </ThemedText>
          <View style={[
            styles.otherSessionsGrid,
            { gap: width >= 640 ? 32 : 24 } // sm:gap-8 (32px) vs gap-6 (24px)
          ]}>
            {otherSessions.map(session => (
              <View 
                key={session.uuid} 
                style={[
                  styles.gridItem,
                  { width: `${100 / columnCount}%` }
                ]}
              >
                <SessionCard 
                  session={session}
                  user={user}
                  onLeave={onLeave}
                  onDelete={onDelete}
                  isLeaving={leaveState.sessionId === session.uuid && leaveState.isLoading}
                  isDeleting={deleteState.sessionId === session.uuid && deleteState.isLoading}
                  leaveError={leaveState.sessionId === session.uuid ? leaveState.error : null}
                  deleteError={deleteState.sessionId === session.uuid ? deleteState.error : null}
                />
              </View>
            ))}
          </View>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  latestSection: {
    marginTop: 32, // mt-8
    marginBottom: 48, // mb-12
  },
  otherSection: {
    flex: 1,
  },
  sectionTitle: {
    fontSize: 24, // text-2xl
    fontWeight: '600', // font-semibold
    marginBottom: 16, // mb-4
    letterSpacing: -0.5, // tracking-tight
  },
  otherSessionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginHorizontal: -12, // Compensate for grid item padding
  },
  gridItem: {
    paddingHorizontal: 12, // Half of the gap
  },
}); 