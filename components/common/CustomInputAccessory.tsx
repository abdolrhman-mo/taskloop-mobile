import { darkTheme, lightTheme } from '@/constants/Colors';
import { useTheme } from '@/contexts/ThemeContext';
import { Portal } from '@gorhom/portal';
import React from 'react';
import { KeyboardAvoidingView, Platform, TouchableWithoutFeedback, View } from 'react-native';

interface CustomInputAccessoryProps {
  isVisible: boolean;
  onClose: () => void;
  children: React.ReactNode;
}

export function CustomInputAccessory({
  isVisible,
  onClose,
  children,
}: CustomInputAccessoryProps) {
  const { resolvedTheme } = useTheme();
  const theme = resolvedTheme === 'dark' ? darkTheme : lightTheme;

  if (!isVisible) return null;

  return (
    <Portal>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          zIndex: 9999,
          elevation: 9999,
        }}
      >
        <View 
          className="flex-1 justify-end"
          style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }}
        >
          <TouchableWithoutFeedback onPress={onClose}>
            <View className="flex-1" />
          </TouchableWithoutFeedback>
          
          <View
            className="rounded-t-2xl py-4"
            style={{ backgroundColor: theme.background.secondary }}
          >
            {children}
          </View>
        </View>
      </KeyboardAvoidingView>
    </Portal>
  );
}
