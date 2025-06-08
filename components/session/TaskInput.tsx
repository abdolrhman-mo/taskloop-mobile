import { ThemedText } from '@/components/ThemedText';
import { darkTheme, lightTheme } from '@/constants/Colors';
import { useTheme } from '@/contexts/ThemeContext';
import React, { useState } from 'react';
import { ActivityIndicator, StyleSheet, TextInput, TouchableOpacity, View } from 'react-native';

interface TaskInputProps {
  onSubmit: (text: string) => Promise<void>;
  isAdding: boolean | null;
  error: string | null;
}

export function TaskInput({ onSubmit, isAdding, error }: TaskInputProps) {
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
          placeholder="What do you need to do?"
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
          returnKeyType="done"
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
            <View style={styles.buttonContent}>
              <ActivityIndicator size="small" color={theme.brand.text} />
              <ThemedText style={[styles.buttonText, { color: theme.brand.text }]}>
                Adding to your todo...
              </ThemedText>
            </View>
          ) : (
            <ThemedText style={[styles.buttonText, { color: theme.brand.text }]}>
              Add to your todo
            </ThemedText>
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
  },
  input: {
    flex: 1,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    fontSize: 16,
    borderWidth: 1,
  },
  disabledInput: {
    opacity: 0.5,
  },
  button: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  disabledButton: {
    opacity: 0.5,
  },
  buttonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  buttonText: {
    fontSize: 14,
    fontWeight: '500',
  },
  error: {
    fontSize: 14,
    marginTop: 8,
  },
}); 