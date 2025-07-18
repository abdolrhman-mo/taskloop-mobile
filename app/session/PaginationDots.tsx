import { darkTheme, lightTheme } from '@/constants/Colors';
import { useTheme } from '@/contexts/ThemeContext';
import React from 'react';
import { View } from 'react-native';

interface PaginationDotsProps {
  count: number;
  current: number;
  className?: string;
}

export function PaginationDots({ count, current, className = '' }: PaginationDotsProps) {
  const { resolvedTheme } = useTheme();
  const theme = resolvedTheme === 'dark' ? darkTheme : lightTheme;
  
  return (
    <View className={`flex-row justify-center items-center ${className}`}>
      {Array.from({ length: count }).map((_, index) => (
        <View
          key={index}
          style={{
            width: 8,
            height: 8,
            borderRadius: 4,
            backgroundColor: current === index ? theme.brand.background : theme.background.fourth,
            marginHorizontal: 4,
          }}
        />
      ))}
    </View>
  );
} 