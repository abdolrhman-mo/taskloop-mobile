import { useSafeScrollView } from '@/hooks/useSafeScrollView';
import React from 'react';
import { ScrollView, ScrollViewProps } from 'react-native';

interface SafeScrollViewProps extends Omit<ScrollViewProps, 'contentContainerStyle'> {
  children: React.ReactNode;
  contentContainerStyle?: ScrollViewProps['contentContainerStyle'];
}

export function SafeScrollView({ 
  children, 
  contentContainerStyle,
  ...props 
}: SafeScrollViewProps) {
  const { scrollViewProps } = useSafeScrollView();
  
  return (
    <ScrollView
      {...scrollViewProps}
      {...props}
      contentContainerStyle={[
        scrollViewProps.contentContainerStyle,
        contentContainerStyle,
      ]}
    >
      {children}
    </ScrollView>
  );
} 