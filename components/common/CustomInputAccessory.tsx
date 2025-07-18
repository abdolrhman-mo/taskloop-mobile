import { darkTheme, lightTheme } from '@/constants/Colors';
import { useTheme } from '@/contexts/ThemeContext';
import React from 'react';
import { KeyboardAvoidingView, Platform, TouchableWithoutFeedback, View } from 'react-native';
import { Portal } from '@gorhom/portal';

interface CustomInputAccessoryProps {
  isVisible: boolean;
  onClose: () => void;
  overlayFlag?: boolean;
  children: React.ReactNode;
}

export function CustomInputAccessory({
  isVisible,
  onClose,
  overlayFlag = true,
  children,
}: CustomInputAccessoryProps) {
  const { resolvedTheme } = useTheme();
  const theme = resolvedTheme === 'dark' ? darkTheme : lightTheme;

  if (!isVisible) return null;

  const renderContent = () => (
    <View
      className="rounded-t-2xl py-4"
      style={{ backgroundColor: theme.background.secondary }}
    >
      {children}
    </View>
  );

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
        pointerEvents='box-none' // parent is transparent but children can be touched
      >
        {overlayFlag ? (
          <View 
            className="flex-1 justify-end"
            style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }}
          >
            <TouchableWithoutFeedback onPress={onClose}>
              <View className="flex-1" />
            </TouchableWithoutFeedback>
            {renderContent()}
          </View>
        ) : (
          <>
            <View className='flex-1' pointerEvents='none' />
            {renderContent()}
          </>
        )}
      </KeyboardAvoidingView>
    </Portal>
  );
}
