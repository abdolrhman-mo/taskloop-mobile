import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { SafeAreaView, ScrollView, TouchableOpacity, TouchableWithoutFeedback, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { LoadingSpinner } from '@/components/common/LoadingSpinner';
import { Nav } from '@/components/Nav';
import { CreateRoomCTA } from '@/components/sessions/CreateRoomCTA';
import { SessionList } from '@/components/sessions/SessionList';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { ENDPOINTS } from '@/config/endpoints';
import { darkTheme, lightTheme } from '@/constants/Colors';
import { useTheme } from '@/contexts/ThemeContext';
import { useApi } from '@/hooks/useApi';
import { Session, User } from '@/types/session';
import { NetworkError } from '@/components/common/NetworkError';
import { PlusIcon } from 'lucide-react-native';
import Svg, { Path } from 'react-native-svg';

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
    <SafeAreaView className="flex-1">
      <Nav isDropdownOpen={isDropdownOpen} setIsDropdownOpen={setIsDropdownOpen} />
      <ThemedView className="flex-1">
        <ScrollView 
          className="flex-1"
          contentContainerStyle={{ paddingBottom: insets.bottom + 20 }}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          <TouchableWithoutFeedback onPress={() => setIsDropdownOpen(false)}>
            <ThemedView className="p-4 max-w-screen-xl self-center w-full">
              <ThemedView className="mb-4">
                  <TouchableOpacity
                    onPress={() => router.push('/session/create')}
                    style={{ backgroundColor: theme.brand.background }}
                    className="p-4 rounded-lg flex-col gap-4"
                  >
                    <View className="flex-row items-center gap-2">
                      <PlusIcon size={16} color={theme.brand.text} />
                      <ThemedText 
                        style={{ color: theme.brand.text }}
                        className="text-base font-semibold"
                      >
                        New Study Room
                      </ThemedText>
                    </View>
                    <View className="flex-row justify-end">
                      <View>
                        <Svg width="63" height="77" viewBox="0 0 63 77" fill="none">
                          <Path d="M19.4273 0.833008C16.7544 1.16992 14.6094 2.62988 13.5313 4.86475C12.4756 7.04346 12.4756 9.25586 13.5537 11.4233C14.25 12.8159 15.3731 13.9277 16.7993 14.6128C18.0347 15.208 18.6973 15.3652 19.9775 15.3652C21.314 15.3652 22.1001 15.1855 23.2568 14.6353C26.4463 13.0967 28.041 9.40186 27.0078 5.98779C26.1206 3.11279 23.5264 1.05762 20.4941 0.844238C20.0898 0.821777 19.6182 0.810547 19.4273 0.833008Z" fill="white"/>
                          <Path d="M15.4067 16.2637C12.835 16.6793 10.5664 18.7232 9.74658 21.3736C9.49951 22.1822 9.51074 23.6422 9.76904 30.8634C9.85888 33.4239 9.98242 37.2423 10.0498 39.3424C10.3081 47.2261 10.3193 47.4732 10.6338 48.1583C11.0493 49.0455 11.6333 49.6632 12.4531 50.0675C13.1157 50.3931 13.3516 50.4381 15.3955 50.6402C17.709 50.8536 24.6606 51.4825 28.6812 51.8306C29.939 51.9317 31.0283 52.0777 31.1069 52.1451C31.1855 52.2012 31.9829 54.4249 32.8813 57.0865C38.6763 74.2017 38.4067 73.483 39.2266 74.5162C39.8105 75.2462 40.5181 75.6729 41.293 75.7515C42.5059 75.8638 43.7861 75.0552 44.0781 73.9771C44.1455 73.7188 44.2017 73.0562 44.2017 72.4835C44.1904 71.4166 44.0669 70.7203 43.1235 66.6324C42.8428 65.397 42.416 63.4991 42.1689 62.421C41.9219 61.3428 41.4951 59.4449 41.2031 58.2095C40.4956 55.0875 39.687 51.5162 39.1367 49.0567C38.4853 46.1593 37.9575 45.272 36.4526 44.5196C35.9136 44.2388 35.644 44.2052 30.6914 43.8345C27.8276 43.6099 25.3232 43.4078 25.1323 43.3741C24.9302 43.3404 24.7168 43.2169 24.6494 43.1046C24.5708 42.9586 24.5259 41.3863 24.5034 38.8145L24.481 34.7379L23.7622 34.5919C22.437 34.3336 22.2124 34.1427 18.7197 30.3355C15.9009 27.2584 15.4966 26.7642 15.4966 26.4498C15.4966 26.1353 15.5303 26.0904 15.8447 26.0567C16.1367 26.023 16.2603 26.1129 16.6758 26.5621C19.6968 29.9537 22.6841 33.0982 23.0996 33.3341L23.5825 33.6148L33.1846 33.6485C39.9341 33.671 42.9551 33.6485 43.3706 33.5587C44.1455 33.3902 44.8418 32.9073 45.3135 32.1998C45.6953 31.6383 45.7065 31.5821 45.7065 30.5938C45.7065 29.6842 45.6728 29.5157 45.4033 29.044C45.2236 28.7633 44.8979 28.3702 44.6733 28.1793C43.8198 27.4718 44.1792 27.4942 33.8921 27.4942H24.5371L24.5259 26.6182C24.5146 24.1588 24.335 22.0362 24.0991 21.3175C23.3354 19.0601 21.4936 17.2633 19.2139 16.5445C18.2144 16.2188 16.4736 16.0953 15.4067 16.2637Z" fill="white"/>
                          <Path d="M59.9468 16.6006C59.4863 16.8813 59.4639 16.915 58.6328 19.3745C58.2398 20.5425 57.2964 23.2827 56.544 25.4727C54.1968 32.312 53.9497 33.0308 53.7139 33.7495L53.478 34.457H42.8765C31.208 34.457 31.7246 34.4233 31.2754 35.1533C30.8599 35.8384 31.062 36.6807 31.7246 37.085C32.0166 37.2422 33.0835 37.2646 43.4268 37.2646C54.4888 37.2646 54.8145 37.2534 55.1626 37.04C55.5557 36.8042 55.6455 36.6582 55.9038 35.917C56.0049 35.6362 56.5889 33.918 57.2178 32.0986C57.8467 30.2793 58.4307 28.5835 58.5093 28.3364C58.689 27.7861 61.2046 20.4189 61.6987 19.0264C61.8897 18.4761 62.0469 17.8921 62.0469 17.7349C62.0469 17.2969 61.6426 16.7241 61.2046 16.5332C60.688 16.3198 60.3735 16.3311 59.9468 16.6006Z" fill="white"/>
                          <Path d="M2.54787 21.1603C1.82912 21.5196 1.34621 22.0924 1.09914 22.8785C0.885762 23.5411 0.807149 22.8561 2.35695 35.0187C2.69387 37.7027 3.25539 42.1051 3.59231 44.7892C3.94045 47.4733 4.4009 51.0895 4.61428 52.819C5.0635 56.3229 5.19826 56.7945 5.92824 57.4347C6.73684 58.1197 7.00637 58.1534 11.8692 58.1534H16.2266V63.5441V68.9347H14.5982C13.4414 68.9347 12.8574 68.9796 12.5991 69.0919C12.1387 69.2941 8.29787 73.1573 8.14065 73.5729C7.60158 75.0441 8.89309 76.4591 10.4429 76.0773C10.8023 75.9874 11.1953 75.673 12.5318 74.359L14.1602 72.753H18.0347H21.898L23.2456 74.1119C25.0762 75.965 25.312 76.1222 26.1094 76.1222C27.4009 76.1222 28.2095 75.1114 27.9624 73.7975C27.895 73.4381 27.5806 73.0563 25.8511 71.3043C24.7281 70.17 23.6499 69.1817 23.4478 69.0919C23.2007 68.9796 22.6167 68.9347 21.5611 68.9347H20.0449V63.5441V58.1534H24.4585C29.3775 58.1534 29.5122 58.131 30.3545 57.4122C31.2305 56.6598 31.5786 55.2447 31.1406 54.2115C30.8936 53.65 30.3096 53.0211 29.7705 52.7291L29.3101 52.482L19.8091 52.4484L10.3081 52.4259L10.2295 51.8307C10.1958 51.5162 9.85891 48.8658 9.4883 45.9684C9.12893 43.0597 8.32033 36.6808 7.69143 31.7843C6.51223 22.4518 6.52346 22.5079 5.87209 21.7442C5.11965 20.8683 3.64846 20.61 2.54787 21.1603Z" fill="white"/>
                          <Path d="M28.2881 38.4326C27.6479 38.7134 27.457 39.0952 27.457 40.0947C27.457 40.6675 27.5132 41.0942 27.6255 41.3076C27.9961 42.0264 27.0303 41.9814 42.9551 41.9814H57.4424V50.5728C57.4424 57.3672 57.4761 59.1641 57.5884 59.1753C57.6558 59.1753 57.8804 59.1978 58.0601 59.1978C58.3857 59.2202 58.397 59.2427 58.4307 59.8042C58.4531 60.2871 58.4307 60.3994 58.2959 60.3994C58.1611 60.3994 58.1162 60.2759 58.1162 59.9502C58.1162 59.5796 58.0825 59.501 57.8916 59.501C57.7007 59.501 57.667 59.5796 57.667 59.9502C57.667 60.1973 57.6221 60.3994 57.5547 60.3994C57.4761 60.3994 57.4424 62.7915 57.4424 67.3623C57.4424 74.9429 57.4199 74.707 58.0713 75.2124C58.3184 75.4033 58.5317 75.4482 59.2954 75.4482C60.1602 75.4482 60.25 75.4258 60.5644 75.1338C60.7441 74.9541 60.9575 74.6172 61.0249 74.3701C61.1035 74.0781 61.1484 71.7534 61.1484 67.1602C61.1484 60.5005 61.1372 60.3994 60.9238 60.3994C60.7217 60.3994 60.6992 60.3208 60.6992 59.6133C60.6992 58.9058 60.7217 58.8271 60.9238 58.8271C61.1484 58.8271 61.1484 58.7485 61.1484 49.1353C61.1484 38.3091 61.1934 38.8818 60.3623 38.4775C59.9917 38.2866 59.0034 38.2754 44.3027 38.2754C31.4438 38.2866 28.5688 38.3091 28.2881 38.4326ZM59.6548 59.2988C59.7222 59.3774 59.8008 59.6582 59.8345 59.9165L59.8906 60.377L59.3066 60.3657C58.7788 60.3433 58.7339 60.3208 58.7339 60.0625C58.7339 59.8379 58.8125 59.7593 59.1157 59.6582C59.3516 59.5796 59.4526 59.501 59.3628 59.4561C59.2842 59.4111 59.1494 59.3999 59.0596 59.4336C58.8125 59.5234 58.6103 59.3887 58.8013 59.2651C59.0371 59.1191 59.5312 59.1416 59.6548 59.2988Z" fill="white"/>
                          <Path d="M59.0708 59.9616C59.0259 60.0289 59.0259 60.1076 59.0596 60.1412C59.1494 60.2311 59.4639 60.0851 59.4639 59.9503C59.4639 59.8043 59.1606 59.8043 59.0708 59.9616Z" fill="white"/>
                        </Svg>
                      </View>
                    </View>
                  </TouchableOpacity>
                  
                  {/* Test button */}
                  {/* <TouchableOpacity
                    onPress={() => router.push('/test')}
                    className="bg-red-500 text-white"
                  >
                    <ThemedText style={[styles.createButtonText, { color: theme.brand.text }]}>
                      Test
                    </ThemedText>
                  </TouchableOpacity> */}
              </ThemedView>

              {loading && <LoadingSpinner containerStyle={{ marginTop: 32, borderRadius: 8 }} />}
              
              {!loading && error && (
                <NetworkError 
                  message={error} 
                  onRetry={() => {
                    setError(null);
                    setLoading(true);
                  }} 
                />
              )}

              {!loading && !error && sessions.length === 0 && (
                <ThemedView 
                  style={{ backgroundColor: theme.background.secondary }}
                  className="mt-8 p-4 rounded-lg"
                >
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

