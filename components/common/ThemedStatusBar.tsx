import { darkTheme, lightTheme } from '@/constants/Colors';
import { useTheme } from '@/contexts/ThemeContext';
import { RootState } from '@/store';
import { StatusBar as ExpoStatusBar } from 'expo-status-bar';
import { Platform, StatusBar as RNStatusBar, View } from 'react-native';
import { useSelector } from 'react-redux';

export function ThemedStatusBar() {
  const { resolvedTheme } = useTheme();
  const theme = resolvedTheme === 'dark' ? darkTheme : lightTheme;
  
  // Get status bar state from Redux
  const { backgroundColor, style } = useSelector((state: RootState) => state.statusBar);
  
  // Determine background color
  const bgColor = backgroundColor || theme.background.primary;
  
  // Determine status bar style
  const statusBarStyle = style === 'auto' 
    ? (resolvedTheme === 'dark' ? 'light' : 'dark')
    : style;
  
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
        style={statusBarStyle}
        backgroundColor={Platform.OS === 'android' ? bgColor : undefined}
        translucent={Platform.OS === 'android'}
      />
    </View>
  );
} 