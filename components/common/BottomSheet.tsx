import { darkTheme, lightTheme } from '@/constants/Colors';
import { useTheme } from '@/contexts/ThemeContext';
import { Portal } from '@gorhom/portal';
import React, { useEffect, useRef } from 'react';
import { Animated, Dimensions, ScrollView, StyleSheet, TouchableWithoutFeedback, View } from 'react-native';

interface BottomSheetProps {
  isVisible: boolean;
  onClose: () => void;
  children: React.ReactNode;
}

export function BottomSheet({ isVisible, onClose, children }: BottomSheetProps) {
  const { resolvedTheme } = useTheme();
  const theme = resolvedTheme === 'dark' ? darkTheme : lightTheme;
  const { height } = Dimensions.get('window');
  const translateY = useRef(new Animated.Value(height)).current;
  const opacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (isVisible) {
      // Reset to bottom
      translateY.setValue(height);
      opacity.setValue(0);
      // Animate up with a gentle spring
      Animated.parallel([
        Animated.spring(translateY, {
          toValue: 0,
          useNativeDriver: true,
          tension: 65,
          friction: 11,
          restDisplacementThreshold: 0.01,
          restSpeedThreshold: 0.01,
        }),
        Animated.timing(opacity, {
          toValue: 1,
          duration: 200,
          useNativeDriver: true,
        })
      ]).start();
    }
  }, [isVisible, height]);

  const handleClose = () => {
    // Use a snappier spring for closing
    Animated.parallel([
      Animated.spring(translateY, {
        toValue: height,
        useNativeDriver: true,
        tension: 100,
        friction: 8,
        velocity: 0.3,
        restDisplacementThreshold: 0.01,
        restSpeedThreshold: 0.01,
      }),
      Animated.timing(opacity, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      })
    ]).start(onClose);
  };

  if (!isVisible) return null;

  return (
    <Portal>
      <Animated.View style={[styles.container, { opacity, backgroundColor: 'rgba(0,0,0,0.3)' }]}>
        <TouchableWithoutFeedback onPress={handleClose}>
          <View style={styles.overlay}>
            <TouchableWithoutFeedback>
              <Animated.View 
                style={[
                  styles.content, 
                  { 
                    backgroundColor: theme.background.primary,
                    height: height * 0.4,
                    transform: [{ translateY }]
                  }
                ]}
              >
                <View style={styles.handle} />
                <ScrollView style={styles.scrollContent}>
                  {children}
                </ScrollView>
              </Animated.View>
            </TouchableWithoutFeedback>
          </View>
        </TouchableWithoutFeedback>
      </Animated.View>
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
    justifyContent: 'flex-end',
  },
  content: {
    width: '100%',
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    overflow: 'hidden',
    position: 'absolute',
    bottom: 0,
  },
  handle: {
    width: 40,
    height: 4,
    backgroundColor: '#666',
    borderRadius: 2,
    alignSelf: 'center',
    marginTop: 8,
    marginBottom: 8,
  },
  scrollContent: {
    padding: 16,
  },
}); 