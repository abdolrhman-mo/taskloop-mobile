import { ThemedText } from '@/components/ThemedText';
import { darkTheme, lightTheme } from '@/constants/Colors';
import { useTheme } from '@/contexts/ThemeContext';
import { Pencil } from 'lucide-react-native';
import React from 'react';
import { StyleSheet, TouchableOpacity } from 'react-native';

interface EditSessionButtonProps {
  onPress: () => void;
  disabled?: boolean;
}

export function EditSessionButton({ onPress, disabled }: EditSessionButtonProps) {
  const { resolvedTheme } = useTheme();
  const theme = resolvedTheme === 'dark' ? darkTheme : lightTheme;

  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled}
      style={[
        styles.button,
        { backgroundColor: theme.background.secondary },
        disabled && styles.disabled
      ]}
      activeOpacity={0.7}
    >
      <Pencil size={16} color={theme.typography.primary} />
      <ThemedText style={styles.text}>Edit</ThemedText>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
  },
  disabled: {
    opacity: 0.5,
  },
  text: {
    fontSize: 14,
    fontWeight: '500',
  },
}); 