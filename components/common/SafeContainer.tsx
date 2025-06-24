import { useSafeScrollView } from '@/hooks/useSafeScrollView';
import React from 'react';
import { View, ViewProps } from 'react-native';

interface SafeContainerProps extends ViewProps {
  children: React.ReactNode;
  topOffset?: number; // Additional top offset (default: 60 for nav bar)
}

export function SafeContainer({ 
  children, 
  topOffset = 60,
  style,
  ...props 
}: SafeContainerProps) {
  const { insets } = useSafeScrollView();
  
  return (
    <View
      style={[
        { paddingTop: insets.top + topOffset },
        style,
      ]}
      {...props}
    >
      {children}
    </View>
  );
} 