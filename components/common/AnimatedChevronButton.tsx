import React, { useRef, useEffect } from 'react';
import { TouchableOpacity, Animated, View } from 'react-native';
import { ChevronLeft } from 'lucide-react-native';
import { darkTheme, lightTheme } from '@/constants/Colors';
import { useTheme } from '@/contexts/ThemeContext';

interface AnimatedChevronButtonProps {
  show: boolean;
  onPress: () => void;
}

export function AnimatedChevronButton({ show, onPress }: AnimatedChevronButtonProps) {
  const { resolvedTheme } = useTheme();
  const theme = resolvedTheme === 'dark' ? darkTheme : lightTheme;
  
  const chevronOpacity = useRef(new Animated.Value(0)).current;
  const chevronTranslateX = useRef(new Animated.Value(-50)).current;

  // Animate chevron when show prop changes
  useEffect(() => {
    if (show) {
      Animated.parallel([
        Animated.timing(chevronOpacity, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(chevronTranslateX, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      Animated.parallel([
        Animated.timing(chevronOpacity, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(chevronTranslateX, {
          toValue: -50,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [show, chevronOpacity, chevronTranslateX]);

  return (
    <Animated.View
      style={{
        position: 'absolute',
        left: 20,
        bottom: 50,
        opacity: chevronOpacity,
        transform: [{ translateX: chevronTranslateX }],
      }}
      pointerEvents={show ? 'auto' : 'none'}
    >
      <TouchableOpacity
        onPress={onPress}
        className='flex-row items-center justify-center p-4 '
        activeOpacity={0.7}
      >
        <View 
            style={{
                backgroundColor: theme.brand.background + '80',
                // width: 32,
                // height: 32,
            }}
            className='flex-row items-center justify-center rounded-full w-8 h-8'
        >
          <ChevronLeft size={16} color={theme.typography.primary} />
        </View>
      </TouchableOpacity>
    </Animated.View>
  );
} 