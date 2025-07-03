import { darkTheme, lightTheme } from '@/constants/Colors';
import { useTheme } from '@/contexts/ThemeContext';
import { Portal } from '@gorhom/portal';
import React, { useRef } from 'react';
import { KeyboardAvoidingView, Platform, ScrollView, StyleSheet, TouchableWithoutFeedback, View } from 'react-native';
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
        style={styles.container}
      >
        <View style={[styles.container, { backgroundColor: 'rgba(0,0,0,0.3)' }]}>
          <TouchableWithoutFeedback onPress={handleClose}>
            <View style={styles.overlay}>
              <TouchableWithoutFeedback>
                <Animatable.View 
                  ref={animRef}
                  animation={isVisible ? "fadeIn" : undefined}
                  duration={300}
                  easing="ease-in-out"
                  style={[styles.content, { backgroundColor: theme.background.primary }]}
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

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 9999,
    elevation: 9999,
  },
  overlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    padding: 16,
    width: '90%',
    maxHeight: '80%',
    borderRadius: 16,
    overflow: 'hidden',
  },
}); 