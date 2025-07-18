import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { darkTheme, lightTheme } from '@/constants/Colors';
import { useTheme } from '@/contexts/ThemeContext';
import { Session, User } from '@/types/session';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Pressable, View } from 'react-native';

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
      className={`rounded-lg overflow-hidden border p-4 flex-col gap-2`}
      style={{ 
        backgroundColor: theme.background.secondary,
        borderColor: theme.border,
        opacity: (isLeaving || isDeleting) ? 0.5 : 1,
      }}
    >

      {/* Role Badge */}
      <View 
        className="py-1 px-2 rounded-md border"
        style={{ 
          backgroundColor: theme.background.primary, 
          borderColor: theme.border, 
          alignSelf: 'flex-start' }} // Tells the View to only be as wide as its content
      >
        <ThemedText className="text-xs font-medium" style={{ color: theme.typography.secondary }}>
        {isCreator ? 'Created by you' : `Created by ${session.creator_username}`}
        </ThemedText>
      </View>

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

      <View className={`items-center`}>
        <ThemedText 
          className={`font-bold text-center ${isFeatured ? 'text-2xl mb-2' : 'text-xl mb-1'}`}
          style={{ color: theme.typography.primary }}
        >
          {session.name}
        </ThemedText>
        <View className="items-center">
          <ThemedText className="text-xs text-center" style={{ color: theme.typography.secondary }}>
            {session.participants_count} {session.participants_count === 1 ? 'participant' : 'participants'}
          </ThemedText>
          <ThemedText className="text-xs text-center" style={{ color: theme.typography.secondary }}>
            Created {formatDate(session.created_at)}
          </ThemedText>
        </View>
      </View>
      
      <Pressable
        onPress={handleJoinPress}
        onPressIn={() => setIsPressed(true)}
        onPressOut={() => setIsPressed(false)}
        className="w-full py-2.5 px-4 rounded-md mt-4 items-center"
        style={{ 
          backgroundColor: `${theme.brand.background}${isPressed ? '30' : '20'}`,
          transform: [{ scale: isPressed ? 0.95 : 1 }]
        }}
      >
        <ThemedText className="text-sm font-semibold" style={{ color: theme.typography.primary }}>
        Join Room
        </ThemedText>
      </Pressable>
    </ThemedView>
  );
} 