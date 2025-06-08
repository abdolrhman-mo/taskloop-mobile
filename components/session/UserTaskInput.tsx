import { ThemedText } from '@/components/ThemedText';
import { darkTheme, lightTheme } from '@/constants/Colors';
import { useTheme } from '@/contexts/ThemeContext';
import { Send } from 'lucide-react-native';
import React, { useState } from 'react';
import { ActivityIndicator, StyleSheet, TextInput, TouchableOpacity, View } from 'react-native';

interface UserTaskInputProps {
  onSubmit: (text: string) => Promise<void>;
  isAdding: boolean | null;
  error: string | null;
  placeholder?: string;
}

export function UserTaskInput({ 
  onSubmit, 
  isAdding, 
  error,
  placeholder = "What do you need to do?"
}: UserTaskInputProps) {
  const { resolvedTheme } = useTheme();
  const theme = resolvedTheme === 'dark' ? darkTheme : lightTheme;
  const [newTask, setNewTask] = useState('');

  const handleSubmit = async () => {
    if (!newTask.trim() || isAddingTask) return;

    try {
      await onSubmit(newTask.trim());
      setNewTask('');
    } catch {
      // Error is handled by parent component
    }
  };

  const isAddingTask = isAdding ?? false;

  return (
    <View style={styles.container}>
      <View style={styles.form}>
        <TextInput 
          value={newTask}
          onChangeText={setNewTask}
          placeholder={placeholder}
          placeholderTextColor={theme.typography.secondary}
          style={[
            styles.input,
            { 
              backgroundColor: theme.background.secondary,
              color: theme.typography.primary,
              borderColor: theme.border,
            },
            isAddingTask && styles.disabledInput
          ]}
          editable={!isAddingTask}
          onSubmitEditing={handleSubmit}
          returnKeyType="send"
          multiline
        />
        <TouchableOpacity 
          onPress={handleSubmit}
          style={[
            styles.button,
            { backgroundColor: theme.brand.background },
            (!newTask.trim() || isAddingTask) && styles.disabledButton
          ]}
          disabled={!newTask.trim() || isAddingTask}
          activeOpacity={0.9}
        >
          {isAddingTask ? (
            <ActivityIndicator size="small" color={theme.brand.text} />
          ) : (
            <Send size={16} color={theme.brand.text} />
          )}
        </TouchableOpacity>
      </View>
      {error && (
        <ThemedText style={[styles.error, { color: theme.error.DEFAULT }]}>
          {error}
        </ThemedText>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
  },
  form: {
    flexDirection: 'row',
    gap: 8,
    alignItems: 'flex-end',
  },
  input: {
    flex: 1,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 8,
    fontSize: 16,
    borderWidth: 1,
    minHeight: 44,
    maxHeight: 120,
  },
  disabledInput: {
    opacity: 0.5,
  },
  button: {
    width: 44,
    height: 44,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  disabledButton: {
    opacity: 0.5,
  },
  error: {
    fontSize: 14,
    marginTop: 8,
  },
}); 