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
import { Platform, Text, TouchableOpacity, View } from 'react-native';
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
      <View 
        style={{ 
          backgroundColor: theme.background.secondary,
          paddingTop: insets.top,
          borderColor: theme.border,
        }}
        className="w-full py-3 px-4 border-b"
      >
        <View className="flex-row items-center justify-between">
          {/* Left section - Logo */}
          <Logo />

          {/* Middle section - Optional children */}
          {children && (
            <View className="flex-1 items-center px-4">
              <Text style={{ color: theme.typography.primary }}>
                {children}
              </Text>
            </View>
          )}

          {/* Right section - User controls */}
          <View className="flex-row items-center gap-3">
            <ThemeToggle />
          
            {/* User menu */}
            {username && (
              <View className="relative" ref={dropdownRef}>
                <TouchableOpacity
                  onPress={() => setIsDropdownOpen(!isDropdownOpen)}
                  className="flex-row items-center gap-2 py-2 px-3 rounded-lg"
                >
                  <Text 
                    style={{ color: theme.typography.primary }}
                    className="font-medium"
                  >
                    {username}
                  </Text>
                  <ChevronDown 
                    size={16} 
                    color={theme.typography.primary}
                    style={{
                      transform: [{ rotate: isDropdownOpen ? '180deg' : '0deg' }]
                    }}
                  />
                </TouchableOpacity>

                <DropdownMenu 
                  items={menuItems}
                  isOpen={isDropdownOpen}
                  style={{ marginTop: 8 }}
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

