import { darkTheme, lightTheme } from '@/constants/Colors';
import { useTheme } from '@/contexts/ThemeContext';
import { useRouter } from 'expo-router';
import { Repeat } from 'lucide-react-native';
import { StyleSheet, Text, TouchableOpacity } from 'react-native';

interface LogoProps {
  style?: any;
  showIcon?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

export function Logo({ 
  style, 
  showIcon = true,
  size = 'sm'
}: LogoProps) {
  const { resolvedTheme } = useTheme();
  const theme = resolvedTheme === 'dark' ? darkTheme : lightTheme;
  const router = useRouter();

  const sizeStyles = {
    sm: { fontSize: 18 },
    md: { fontSize: 24 },
    lg: { fontSize: 32 }
  };

  const iconSize = size === 'sm' ? 20 : 24;

  return (
    <TouchableOpacity 
      onPress={() => router.push('/')}
      style={[styles.container, style]}
    >
      {showIcon && (
        <Repeat 
          size={iconSize} 
          color={theme.brand.background}
          style={styles.icon}
        />
      )}
      <Text 
        style={[
          styles.text,
          sizeStyles[size],
          { color: theme.typography.primary }
        ]}
      >
        TaskLoop
      </Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    height: 40,
    gap: 4,
  },
  icon: {
    marginTop: 2, // Slight adjustment to align with text
  },
  text: {
    fontWeight: 'bold',
    letterSpacing: -0.5,
  },
}); 