import { ThemedText } from '@/components/ThemedText';
import { darkTheme, lightTheme } from '@/constants/Colors';
import { useTheme } from '@/contexts/ThemeContext';
import { Share2 } from 'lucide-react-native';
import React from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';

interface ShareSessionButtonProps {
  onPress: () => void;
  disabled?: boolean;
  isSharing?: boolean;
}

export function ShareSessionButton({ onPress, disabled, isSharing }: ShareSessionButtonProps) {
  const { resolvedTheme } = useTheme();
  const theme = resolvedTheme === 'dark' ? darkTheme : lightTheme;

  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled || isSharing}
      style={[
        styles.button,
        { backgroundColor: theme.brand.background },
        (disabled || isSharing) && styles.disabled
      ]}
      activeOpacity={0.9}
    >
      <View style={styles.content}>
        <Share2 size={16} color={theme.brand.text} />
        <ThemedText style={[styles.text, { color: theme.brand.text }]}>
          {isSharing ? 'Sharing...' : 'Share Session'}
        </ThemedText>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  disabled: {
    opacity: 0.5,
  },
  text: {
    fontSize: 14,
    fontWeight: '500',
  },
}); 