import { darkTheme, lightTheme } from '@/constants/Colors';
import { useTheme } from '@/contexts/ThemeContext';
import { StatusBar as ExpoStatusBar } from 'expo-status-bar';
import { Platform, StatusBar as RNStatusBar, View } from 'react-native';

interface ThemedStatusBarProps {
  backgroundColor?: string;
}

export function ThemedStatusBar({ backgroundColor }: ThemedStatusBarProps) {
  const { resolvedTheme } = useTheme();
  const theme = resolvedTheme === 'dark' ? darkTheme : lightTheme;
  
  // Use provided background color or fallback to theme
  const bgColor = backgroundColor || theme.background.primary;
  
  return (
    <View style={{ 
      height: Platform.OS === 'ios' ? 0 : RNStatusBar.currentHeight,
      backgroundColor: bgColor,
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      zIndex: 9999,
    }}>
      <ExpoStatusBar 
        style={resolvedTheme === 'dark' ? 'light' : 'dark'} 
        // Android-only prop
        backgroundColor={Platform.OS === 'android' ? bgColor : undefined}
        // Make status bar translucent on Android
        translucent={Platform.OS === 'android'}
      />
    </View>
  );
} 