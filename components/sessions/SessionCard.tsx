import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { darkTheme, lightTheme } from '@/constants/Colors';
import { useTheme } from '@/contexts/ThemeContext';
import { Session, User } from '@/types/session';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';

interface SessionCardProps {
  session: Session;
  user: User | null;
  isFeatured?: boolean;
  onLeave: (sessionId: string) => Promise<void>;
  onDelete: (sessionId: string) => Promise<void>;
  isLeaving: boolean;
  isDeleting: boolean;
  leaveError: string | null;
  deleteError: string | null;
}

// Helper to format date
const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString(undefined, {
    year: 'numeric', month: 'long', day: 'numeric'
  });
};

export function SessionCard({ 
  session, 
  user, 
  isFeatured = false, 
  onLeave,
  onDelete,
  isLeaving,
  isDeleting,
  leaveError,
  deleteError
}: SessionCardProps) {
  const { resolvedTheme } = useTheme();
  const theme = resolvedTheme === 'dark' ? darkTheme : lightTheme;
  const router = useRouter();
  const [isPressed, setIsPressed] = useState(false);
  
  // Determine if current user created this session
  const isCreator = user && session.creator === user.id;
  const isParticipant = user && session.participants.some(p => p.id === user.id);

  const handleJoinPress = () => {
    router.push({
      pathname: '/session/[id]',
      params: { id: session.uuid }
    });
  };

  return (
    <ThemedView
      style={[
        styles.container,
        isFeatured ? styles.featuredContainer : styles.regularContainer,
        { 
        backgroundColor: theme.background.secondary,
        borderColor: theme.border,
          opacity: (isLeaving || isDeleting) ? 0.5 : 1,
        }
      ]}
    >
      {/* Role Badge */}
      {isParticipant && (
        <View 
          style={[
            styles.roleBadge,
            { backgroundColor: `${theme.background.tertiary}20` }
          ]}
        >
          <ThemedText style={[styles.roleText, { color: theme.typography.secondary }]}>
          {isCreator ? 'Created by you' : `Created by ${session.creator_username}`}
          </ThemedText>
        </View>
      )}

      {/* <SessionMenu 
        session={session}
        user={user}
        onLeave={onLeave}
        onDelete={onDelete}
        isLeaving={isLeaving}
        isDeleting={isDeleting}
        leaveError={leaveError}
        deleteError={deleteError}
      /> */}

      <View style={[
        styles.contentContainer,
        isFeatured && styles.featuredContent,
        isParticipant && styles.participantContent
      ]}>
        <ThemedText 
          style={[
            styles.title,
            isFeatured ? styles.featuredTitle : styles.regularTitle,
            { color: theme.typography.primary }
          ]}
        >
          {session.name}
        </ThemedText>
        <View style={styles.detailsContainer}>
          <ThemedText style={[styles.detailText, { color: theme.typography.secondary }]}>
            {session.participants_count} {session.participants_count === 1 ? 'participant' : 'participants'}
          </ThemedText>
          <ThemedText style={[styles.detailText, { color: theme.typography.secondary }]}>
            Created {formatDate(session.created_at)}
          </ThemedText>
        </View>
      </View>
      
      <Pressable
        onPress={handleJoinPress}
        onPressIn={() => setIsPressed(true)}
        onPressOut={() => setIsPressed(false)}
        style={[
          styles.joinButton,
          { 
            backgroundColor: `${theme.brand.background}${isPressed ? '30' : '20'}`,
            transform: [{ scale: isPressed ? 0.95 : 1 }]
          }
        ]}
      >
        <ThemedText style={[styles.joinButtonText, { color: theme.typography.primary }]}>
        Join Room
        </ThemedText>
      </Pressable>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: 8, // rounded-lg
    overflow: 'hidden',
    borderWidth: 1,
    borderLeftWidth: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  featuredContainer: {
    padding: 24, // p-6
  },
  regularContainer: {
    padding: 20, // p-5
  },
  roleBadge: {
    position: 'absolute',
    top: 12, // top-3
    left: 12, // left-3
    paddingVertical: 4, // py-1
    paddingHorizontal: 8, // px-2
    borderRadius: 6, // rounded-md
  },
  roleText: {
    fontSize: 12, // text-xs
    fontWeight: '500', // font-medium
  },
  contentContainer: {
    marginBottom: 12, // mb-3
    alignItems: 'center', // Center content horizontally
  },
  featuredContent: {
    alignItems: 'center',
  },
  participantContent: {
    marginTop: 32, // mt-8
  },
  title: {
    fontWeight: 'bold',
    marginBottom: 4,
    textAlign: 'center', // Center text
  },
  featuredTitle: {
    fontSize: 24, // text-2xl
    marginBottom: 8, // mb-2
  },
  regularTitle: {
    fontSize: 20, // text-xl
    marginBottom: 4, // mb-1
  },
  detailsContainer: {
    gap: 4, // space-y-1
    alignItems: 'center', // Center details horizontally
  },
  detailText: {
    fontSize: 12, // text-xs
    textAlign: 'center', // Center text
  },
  joinButton: {
    width: '100%',
    paddingVertical: 10, // py-2.5
    paddingHorizontal: 16,
    borderRadius: 6, // rounded-md
    marginTop: 16, // mt-4
    alignItems: 'center',
  },
  joinButtonText: {
    fontSize: 14, // text-sm
    fontWeight: '600', // font-semibold
  },
}); 