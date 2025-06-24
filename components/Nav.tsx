'use client';

import { ThemeToggle } from '@/components/ThemeToggle';
import { ENDPOINTS } from '@/config/endpoints';
import { darkTheme, lightTheme } from '@/constants/Colors';
import { useTheme } from '@/contexts/ThemeContext';
import { useApi } from '@/hooks/useApi';
import { useSafeScrollView } from '@/hooks/useSafeScrollView';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import { ChevronDown, LogOut } from 'lucide-react-native';
import React, { useEffect, useRef, useState } from 'react';
import { Platform, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { ConfirmationModal } from './common/ConfirmationModal';
import { DropdownMenu } from './common/DropdownMenu';
import { Logo } from './common/Logo';

interface User {
  id: number;
  username: string;
  email: string;
  first_name: string;
  last_name: string;
}

interface NavProps {
  isDropdownOpen: boolean;
  setIsDropdownOpen: (open: boolean) => void;
  children?: React.ReactNode;
}

export function Nav({ isDropdownOpen, setIsDropdownOpen, children }: NavProps) {
  const { resolvedTheme } = useTheme();
  const theme = resolvedTheme === 'dark' ? darkTheme : lightTheme;
  const [username, setUsername] = useState<string | null>(null);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const dropdownRef = useRef<View>(null);
  const router = useRouter();
  const { get } = useApi();
  const { insets } = useSafeScrollView();

  // Get username from /auth/me endpoint
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const userData = await get<User>(ENDPOINTS.AUTH.ME.path);
        setUsername(userData.username);
      } catch (err) {
        console.error('Failed to fetch user data:', err);
      }
    };

    fetchUserData();
  }, [get]);

  // Close dropdown when clicking outside
  useEffect(() => {
    // For React Native mobile, we'll use a different approach
    if (Platform.OS !== 'web') {
      // TODO: Implement proper touch outside handling for mobile
      // This might involve using a Modal or a different UI pattern
      return;
    }

    const handlePressOutside = (event: MouseEvent) => {
      // @ts-ignore - contains is available in web environment
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener('click', handlePressOutside);
    return () => document.removeEventListener('click', handlePressOutside);
  }, []);

  const handleLogout = async () => {
    try {
      setIsLoggingOut(true);
      
      // Remove token from AsyncStorage
      await AsyncStorage.removeItem('token');
      
      // Close the confirmation modal
      setShowLogoutConfirm(false);
      
      // Navigate to login screen
      router.replace('/(auth)/login');
    } catch (error) {
      console.error('Logout error:', error);
      setIsLoggingOut(false);
      setShowLogoutConfirm(false);
    }
  };

  const menuItems = [
    {
      label: 'Logout',
      onPress: () => {
        setShowLogoutConfirm(true);
        setIsDropdownOpen(false);
      },
      icon: <LogOut size={16} color={theme.typography.primary} />
    }
  ];

  return (
    <>
      <View style={[
        styles.container, 
        { 
          backgroundColor: theme.background.primary, 
          paddingTop: insets.top,
          height: insets.top + 60, // 60px for nav content
        }
      ]}>
        <View style={styles.content}>
          {/* Left section - Logo */}
          <View style={styles.logoContainer}>
            <Logo />
          </View>

          {/* Middle section - Optional children */}
          {children && (
            <View style={styles.childrenContainer}>
              <Text style={{ color: theme.typography.primary }}>
                {children}
              </Text>
            </View>
          )}

          {/* Right section - User controls */}
          <View style={styles.controlsContainer}>
            <ThemeToggle />
          
            {/* User menu */}
            {username && (
              <View style={styles.userMenuContainer} ref={dropdownRef}>
                <TouchableOpacity
                  onPress={() => setIsDropdownOpen(!isDropdownOpen)}
                  style={styles.userButton}
                >
                  <Text style={[styles.username, { color: theme.typography.primary }]}>
                    {username}
                  </Text>
                  <ChevronDown 
                    size={16} 
                    color={theme.typography.primary}
                    style={[
                      styles.chevron,
                      isDropdownOpen && styles.chevronRotated
                    ]}
                  />
                </TouchableOpacity>

                <DropdownMenu 
                  items={menuItems}
                  isOpen={isDropdownOpen}
                  style={styles.dropdown}
                />
              </View>
            )}
          </View>
        </View>
      </View>

      {/* Logout Confirmation Modal */}
      <ConfirmationModal
        isOpen={showLogoutConfirm}
        onClose={() => {
          if (!isLoggingOut) {
            setShowLogoutConfirm(false);
          }
        }}
        onConfirm={handleLogout}
        title="Logout"
        message="Are you sure you want to logout? You will need to login again to access your study rooms."
        confirmText={isLoggingOut ? "Logging out..." : "Logout"}
        isDestructive={false}
        isConfirming={isLoggingOut}
      />
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 50,
    paddingVertical: 4,
    paddingHorizontal: 16,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 2,
      },
      android: {
        elevation: 4, // Increase elevation for better visibility
        borderBottomWidth: 1,
        borderBottomColor: 'rgba(0,0,0,0.1)', // Add subtle border
      },
    }),
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    maxWidth: 1280,
    width: '100%',
    alignSelf: 'center',
  },
  logoContainer: {
    flexShrink: 0,
  },
  childrenContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 16,
  },
  controlsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  userMenuContainer: {
    position: 'relative',
  },
  userButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingVertical: 4,
    paddingHorizontal: 12,
    borderRadius: 8,
  },
  username: {
    fontWeight: '500',
    fontSize: 14,
  },
  chevron: {
    transform: [{ rotate: '0deg' }],
  },
  chevronRotated: {
    transform: [{ rotate: '180deg' }],
  },
  dropdown: {
    marginTop: 8,
  },
}); 