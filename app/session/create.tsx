import { CustomInputAccessory } from '@/components/common/CustomInputAccessory';
import { PrimaryCTA } from '@/components/common/PrimaryCTA';
import { CopyLinkButton } from '@/components/session/CopyLinkButton';
import { WhatsAppShareButton } from '@/components/session/WhatsAppShareButton';
import { useTheme } from '@/contexts/ThemeContext';
import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  SafeAreaView,
  Dimensions,
  ActivityIndicator,
} from 'react-native';
import PagerView from 'react-native-pager-view';

import { ENDPOINTS } from '@/config/endpoints';
import { darkTheme, lightTheme } from '@/constants/Colors';
import { useApi } from '@/hooks/useApi';
import { useRouter } from 'expo-router';
import { ThemedText } from '@/components/ThemedText';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { addStudyRoom, setLoading, setError as setRoomsError } from '@/store/features/studyRoomsSlice';
import { Session } from '@/types/session';

interface CreateSessionResponse {
  uuid: string;
  name: string;
}

const CreateSession = () => {
const { resolvedTheme } = useTheme();
const theme = resolvedTheme === 'dark' ? darkTheme : lightTheme;
  const [currentPage, setCurrentPage] = useState(0);
  const [sessionName, setSessionName] = useState('');
  const [sessionId, setSessionId] = useState('');
  const [isInputAccessoryVisible, setIsInputAccessoryVisible] = useState(true);
  const router = useRouter();
  const pagerRef = useRef<PagerView>(null);
  const totalPages = 3; // Updated to include study rooms list

  const { post, get } = useApi();
  
  // Redux state and actions
  const dispatch = useAppDispatch();
  const { rooms: studyRooms, isLoading: isLoadingRooms, error: roomsError } = useAppSelector(
    (state) => state.studyRooms
  );
  
  const [error, setError] = useState<string | null>(null);
  const [isCreatingRoom, setIsCreatingRoom] = useState(false);
  const [isEnteringRoom, setIsEnteringRoom] = useState(false);

  // Navigate to the study room if it exists
  const navigateToStudyRoom = async (sessionId: string) => {
    setIsEnteringRoom(true);
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
      setIsEnteringRoom(false);
      // Keep polling if session is not ready
      setTimeout(() => navigateToStudyRoom(sessionId), 1000);
    }
  };

  const handleCreateSession = async () => {
    if (!sessionName.trim()) {
      setError('Please enter a session name');
      return;
    }

    try {
      setIsCreatingRoom(true);
      setError(null);
      dispatch(setLoading(true));
      
      const response = await post<CreateSessionResponse>(ENDPOINTS.SESSIONS.CREATE.path, { 
        name: sessionName.trim()
      });
      
      if (response.uuid) {
        // Create a session object to add to Redux store
        const newSession: Session = {
          id: Date.now(), // Temporary ID until we get real data from API
          uuid: response.uuid,
          name: response.name || sessionName.trim(),
          creator: 0, // Current user ID (you might want to get this from auth context)
          creator_username: 'You', // Current user username
          participants: [],
          participants_count: 1,
          created_at: new Date().toISOString(),
        };
        
        // Add to Redux store
        dispatch(addStudyRoom(newSession));
        dispatch(setLoading(false));
        
        setSessionId(response.uuid);
        setIsCreatingRoom(false);
        goToNextPage();
      } else {
        throw new Error('No session UUID received');
      }
    } catch (err) {
      console.error('Failed to create study room:', err);
      setError('Failed to create study room. Please try again.');
      dispatch(setRoomsError('Failed to create study room. Please try again.'));
      dispatch(setLoading(false));
      setIsCreatingRoom(false);
    }
  };

  const goToNextPage = () => {
    if (currentPage < totalPages - 1) {
      pagerRef.current?.setPage(currentPage + 1);
      if (currentPage === 0) {
        setIsInputAccessoryVisible(false);
      }
    }
  };

  const handlePageSelected = (e: any) => {
    setCurrentPage(e.nativeEvent.position);
  };

  // Validation logic for each screen
  const isCurrentInputValid = () => {
    if (currentPage === 0) {
      return sessionName.trim() !== '';
    }
    return false;
  };

  const renderScreen1 = () => (
    <View className="h-full">
      <TextInput
        className="border-none rounded-lg mb-4 text-base bg-white"
        placeholder="What course or topic are you studying today? (e.g. Math, Physics, Python, etc.)"
        value={sessionName}
        onChangeText={(text) => setSessionName(text)}
        autoFocus={true}
        multiline={true}
        style={{
          height: 80, // must give it enough height!
          textAlignVertical: 'top',
        }}
      />
      <CustomInputAccessory
        isVisible={isInputAccessoryVisible}
        onClose={() => {}}
        overlayFlag={false}
      >
        <PrimaryCTA
          title="Start Study Room"
          onPress={handleCreateSession}
          disabled={!isCurrentInputValid() || currentPage === totalPages - 1}
          loading={isCreatingRoom}
          loadingText="Starting study room..."
          className="m-5"
        />
      </CustomInputAccessory>
    </View>
  );


  const renderScreen2 = () => (
    <View className="flex-1 px-4 py-8">
      {/* Success Header */}
      <View className="items-center mb-8">
        {/* Success Icon */}
        <View 
          className="w-16 h-16 rounded-full items-center justify-center mb-6"
          style={{ backgroundColor: `${theme.brand.background}20` }}
        >
          <View 
            className="w-8 h-8 rounded-full items-center justify-center"
            style={{ backgroundColor: theme.brand.background }}
          >
            <Text style={{ color: theme.brand.text, fontSize: 18, fontWeight: 'bold' }}>✓</Text>
          </View>
        </View>
        
        {/* Session Name - Main Focus */}
        <ThemedText 
          className="text-3xl font-bold text-center mb-4" 
          style={{ 
            color: theme.typography.primary,
            letterSpacing: -1,
          }}
        >
          {sessionName}
        </ThemedText>
        
        <ThemedText 
          className="text-base text-center" 
          style={{ color: theme.typography.secondary }}
        >
          Study Room Created!
        </ThemedText>
      </View>

      {/* Share Section */}
      <View 
        className="p-6 rounded-xl mb-6"
        style={{ 
          backgroundColor: theme.background.secondary,
          borderWidth: 1,
          borderColor: theme.border
        }}
      >
        <ThemedText 
          className="text-lg font-semibold text-center mb-2" 
          style={{ color: theme.typography.primary }}
        >
          Invite Friends
        </ThemedText>
        <ThemedText 
          className="text-sm text-center mb-4" 
          style={{ color: theme.typography.secondary }}
        >
          Share this link to let others join your study room
        </ThemedText>
        
        <View className="flex-row gap-3">
          <WhatsAppShareButton sessionId={sessionId} />
          <CopyLinkButton sessionId={sessionId} theme={theme} />
        </View>
      </View>

      {/* Action Buttons */}
      <View className="gap-3">
        {/* Primary Action - Enter Room */}
        <PrimaryCTA
          title="Enter Study Room"
          onPress={() => navigateToStudyRoom(sessionId)}
          loading={isEnteringRoom}
          loadingText="Entering room..."
        />
      </View>
    </View>
  );

  return (
    <SafeAreaView 
        className="flex-1 mb-12 p-5"
        style={{
            // position: 'absolute',
            // top: 0,
            // left: 0,
            // right: 0,
            // bottom: 0,
            // zIndex: 9999,
            // elevation: 9999,
            backgroundColor: theme.background.secondary
        }}
    >
        <PagerView
            ref={pagerRef}
            style={{ flex: 1 }}
            initialPage={0}
            onPageSelected={handlePageSelected}
            scrollEnabled={false} // disables swipe
        >
            <View key="1" 
                className="flex-1"
                // className="flex-1 justify-center items-center"
            >
                {renderScreen1()}
            </View>
            <View key="2" className="flex-1">
                {renderScreen2()}
            </View>
        </PagerView>
    </SafeAreaView>
  );
};

export default CreateSession;