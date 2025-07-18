import { darkTheme, lightTheme } from '@/constants/Colors';
import { useTheme } from '@/contexts/ThemeContext';
import React from 'react';
import { ActivityIndicator, Text, TouchableOpacity, View } from 'react-native';

interface PrimaryCTAProps {
  title: string;
  onPress: () => void;
  disabled?: boolean;
  loading?: boolean;
  loadingText?: string;
  className?: string;
  style?: any;
}

export function PrimaryCTA({ 
  title, 
  onPress, 
  disabled = false, 
  loading = false, 
  loadingText = 'Loading...',
  className = "",
  style
}: PrimaryCTAProps) {
  const { resolvedTheme } = useTheme();
  const theme = resolvedTheme === 'dark' ? darkTheme : lightTheme;

  return (
    <TouchableOpacity
      className={`py-4 rounded-xl ${className}`}
      style={{ 
        backgroundColor: theme.brand.background,
        opacity: (disabled || loading) ? 0.7 : 1,
        shadowColor: theme.brand.background,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 8,
        elevation: 4,
        ...style
      }}
      onPress={onPress}
      disabled={disabled || loading}
      activeOpacity={0.9}
    >
      {loading ? (
        <View className="flex-row items-center justify-center gap-3">
          <ActivityIndicator size="small" color={theme.brand.text} />
          <Text 
            className="text-lg font-semibold" 
            style={{ color: theme.brand.text }}
          >
            {loadingText}
          </Text>
        </View>
      ) : (
        <Text 
          className="text-lg font-semibold text-center" 
          style={{ color: theme.brand.text }}
        >
          {title}
        </Text>
      )}
    </TouchableOpacity>
  );
} 