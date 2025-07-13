import { darkTheme, lightTheme } from '@/constants/Colors';
import { useTheme } from '@/contexts/ThemeContext';
import { Portal } from '@gorhom/portal';
import React, { useRef } from 'react';
import { KeyboardAvoidingView, Platform, ScrollView, TouchableWithoutFeedback, View } from 'react-native';
import * as Animatable from 'react-native-animatable';

interface CustomModalProps {
  isVisible: boolean;
  onClose: () => void;
  children: React.ReactNode;
}

export function CustomModal({ isVisible, onClose, children }: CustomModalProps) {
  const { resolvedTheme } = useTheme();
  const theme = resolvedTheme === 'dark' ? darkTheme : lightTheme;
  const animRef = useRef<Animatable.View & { fadeOut: (duration: number) => Promise<void> }>(null);

  const handleClose = () => {
    animRef.current?.fadeOut(200).then(() => {
      onClose();
    });
  };

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
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            zIndex: 9999,
            elevation: 9999,
            backgroundColor: 'rgba(0,0,0,0.3)',
          }}
        >
          <TouchableWithoutFeedback onPress={handleClose}>
            <View className="flex-1 justify-center items-center">
              <TouchableWithoutFeedback>
                <Animatable.View 
                  ref={animRef}
                  animation={isVisible ? "fadeIn" : undefined}
                  duration={300}
                  easing="ease-in-out"
                  className="p-4 overflow-hidden"
                  style={{ 
                    backgroundColor: theme.background.secondary,
                    width: '90%',
                    maxHeight: '80%',
                    borderRadius: 16,
                  }}
                >
                  <ScrollView>
                    {children}
                  </ScrollView>
                </Animatable.View>
              </TouchableWithoutFeedback>
            </View>
          </TouchableWithoutFeedback>
        </View>
      </KeyboardAvoidingView>
    </Portal>
  );
}