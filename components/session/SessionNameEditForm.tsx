import { darkTheme, lightTheme } from '@/constants/Colors';
import { useTheme } from '@/contexts/ThemeContext';
import { Check, X } from 'lucide-react-native';
import React, { useEffect, useRef, useState } from 'react';
import { ActivityIndicator, StyleSheet, TextInput, TouchableOpacity, View } from 'react-native';

interface SessionNameEditFormProps {
  initialName: string;
  isLoading: boolean;
  onSubmit: (name: string) => void;
  onCancel: () => void;
}

export function SessionNameEditForm({ 
  initialName, 
  isLoading, 
  onSubmit, 
  onCancel 
}: SessionNameEditFormProps) {
  const { resolvedTheme } = useTheme();
  const theme = resolvedTheme === 'dark' ? darkTheme : lightTheme;
  const [editedName, setEditedName] = useState(initialName);
  const inputRef = useRef<TextInput>(null);

  useEffect(() => {
    // Focus input after it's rendered
    const timer = setTimeout(() => {
      inputRef.current?.focus();
    }, 100);
    return () => clearTimeout(timer);
  }, []);

  const handleSubmit = () => {
    if (!editedName.trim() || isLoading) return;
    onSubmit(editedName.trim());
  };

  return (
    <View style={styles.container}>
      <View style={styles.form}>
        <TextInput
          ref={inputRef}
          value={editedName}
          onChangeText={setEditedName}
          style={[
            styles.input,
            { 
              color: theme.typography.primary,
              borderBottomColor: theme.border,
            }
          ]}
          placeholderTextColor={theme.typography.secondary}
          autoFocus
          editable={!isLoading}
          onSubmitEditing={handleSubmit}
          returnKeyType="done"
        />
        <View style={styles.buttons}>
          <TouchableOpacity
            onPress={onCancel}
            style={[
              styles.button,
              styles.cancelButton,
              { backgroundColor: `${theme.error.DEFAULT}20` },
              isLoading && styles.disabled
            ]}
            disabled={isLoading}
            activeOpacity={0.7}
          >
            <X size={20} color={theme.error.DEFAULT} />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={handleSubmit}
            style={[
              styles.button,
              styles.submitButton,
              { backgroundColor: `${theme.brand.background}20` },
              (!editedName.trim() || isLoading) && styles.disabled
            ]}
            disabled={!editedName.trim() || isLoading}
            activeOpacity={0.7}
          >
            {isLoading ? (
              <ActivityIndicator size="small" color={theme.brand.background} />
            ) : (
              <Check size={20} color={theme.brand.background} />
            )}
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  label: {
    fontSize: 24,
    fontWeight: '800',
    letterSpacing: -0.5,
    marginBottom: 8,
  },
  form: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  input: {
    flex: 1,
    paddingVertical: 4,
    borderBottomWidth: 2,
  },
  buttons: {
    flexDirection: 'row',
    gap: 8,
  },
  button: {
    width: 36,
    height: 36,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cancelButton: {
    backgroundColor: 'rgba(239, 68, 68, 0.1)',
  },
  submitButton: {
    backgroundColor: 'rgba(38, 157, 217, 0.1)',
  },
  disabled: {
    opacity: 0.5,
  },
}); 