import { darkTheme, lightTheme } from '@/constants/Colors';
import { useTheme } from '@/contexts/ThemeContext';
import { useSafeScrollView } from '@/hooks/useSafeScrollView';
import { Portal } from '@gorhom/portal';
import React, { useEffect, useRef } from 'react';
import {
    Animated,
    Dimensions,
    PanResponder,
    ScrollView,
    StyleSheet,
    TouchableWithoutFeedback,
    View
} from 'react-native';

interface BottomSheetProps {
  isVisible: boolean;
  onClose: () => void;
  children: React.ReactNode;
}

export function BottomSheet({ isVisible, onClose, children }: BottomSheetProps) {
  const { resolvedTheme } = useTheme();
  const theme = resolvedTheme === 'dark' ? darkTheme : lightTheme;
  const { height } = Dimensions.get('window');
  const { insets } = useSafeScrollView();
  const translateY = useRef(new Animated.Value(height)).current;
  const opacity = useRef(new Animated.Value(0)).current;
  const lastGestureDy = useRef(0);
  const currentPosition = useRef(0);

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: (_, gestureState) => {
        // Only respond to downward gestures
        return gestureState.dy > 0;
      },
      onPanResponderGrant: () => {
        currentPosition.current = 0;
        translateY.setOffset(0);
        translateY.setValue(0);
      },
      onPanResponderMove: (_, gestureState) => {
        // Only allow dragging down
        if (gestureState.dy > 0) {
          currentPosition.current = gestureState.dy;
          translateY.setValue(gestureState.dy);
          // Fade out overlay as sheet is dragged down
          opacity.setValue(1 - (gestureState.dy / (height * 0.4)));
        }
      },
      onPanResponderRelease: (_, gestureState) => {
        translateY.flattenOffset();
        lastGestureDy.current = gestureState.dy;

        // If dragged down more than 40% of the sheet height, close it
        if (gestureState.dy > height * 0.16) { // 40% of 0.4 height
          Animated.parallel([
            Animated.spring(translateY, {
              toValue: height,
              useNativeDriver: true,
              tension: 100,
              friction: 8,
              velocity: gestureState.vy,
              restDisplacementThreshold: 0.01,
              restSpeedThreshold: 0.01,
            }),
            Animated.timing(opacity, {
              toValue: 0,
              duration: 200,
              useNativeDriver: true,
            })
          ]).start(onClose);
        } else {
          // Spring back to open position
          Animated.spring(translateY, {
            toValue: 0,
            useNativeDriver: true,
            tension: 65,
            friction: 11,
            velocity: -gestureState.vy,
            restDisplacementThreshold: 0.01,
            restSpeedThreshold: 0.01,
          }).start();
          // Fade overlay back in
          Animated.timing(opacity, {
            toValue: 1,
            duration: 200,
            useNativeDriver: true,
          }).start();
        }
      },
    })
  ).current;

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
            <Animated.View 
              {...panResponder.panHandlers}
              style={[
                styles.content, 
                { 
                  backgroundColor: theme.background.secondary,
                  height: height * 0.4,
                  transform: [{ translateY }],
                  paddingBottom: insets.bottom
                }
              ]}
            >
              <View style={styles.handle} />
              <ScrollView style={styles.scrollContent}>
                {children}
              </ScrollView>
            </Animated.View>
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