import { ThemedText } from '@/components/ThemedText';
import { darkTheme, lightTheme } from '@/constants/Colors';
import { useTheme } from '@/contexts/ThemeContext';
import { Task } from '@/types/session';
import {
  CheckCircle,
  Circle,
  Pencil,
  Trash2
} from 'lucide-react-native';
import React, { useRef, useState } from 'react';
import { ActivityIndicator, Pressable, StyleSheet, TextInput, View } from 'react-native';

interface TaskItemProps {
  task: Task;
  onToggle?: (task: Task) => Promise<void>;
  onDelete?: (taskId: number) => Promise<void>;
  onEdit?: (taskId: number, newText: string) => Promise<void>;
  isToggling: boolean;
  isColumnOwner: boolean;
}

export function TaskItem({ task, onToggle, onDelete, onEdit, isToggling, isColumnOwner }: TaskItemProps) {
  const { resolvedTheme } = useTheme();
  const theme = resolvedTheme === 'dark' ? darkTheme : lightTheme;
  const [isDeleting, setIsDeleting] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editText, setEditText] = useState(task.text);
  const [isSaving, setIsSaving] = useState(false);
  const inputRef = useRef<TextInput>(null);

  const handleDelete = async () => {
    if (isDeleting) return;
    
    setIsDeleting(true);
    try {
      await onDelete?.(task.id);
    } catch (error) {
      console.error('Failed to delete task:', error);
    } finally {
      setIsDeleting(false);
    }
  };

  const handleEdit = async () => {
    if (!editText.trim() || editText === task.text) {
      setIsEditing(false);
      setEditText(task.text);
      return;
    }

    setIsSaving(true);
    try {
      await onEdit?.(task.id, editText.trim());
      setIsEditing(false);
    } catch (error) {
      console.error('Failed to edit task:', error);
      setEditText(task.text);
    } finally {
      setIsSaving(false);
    }
  };

  const isChecked = task.is_done;

  return (
    <View style={[
      styles.container,
      (isDeleting || isSaving) && styles.disabled
    ]}>
      <View style={styles.content}>
        {/* Checkbox */}
        <Pressable
          onPress={() => isColumnOwner && onToggle?.(task)}
          disabled={isToggling || isDeleting || isEditing || !isColumnOwner}
          style={({ pressed }) => [
            styles.checkbox,
            pressed && styles.pressed
          ]}
        >
          {isChecked ? (
            <CheckCircle size={16} color="#22C55E" />
          ) : (
            <Circle size={16} color="#EAB308" />
          )}
        </Pressable>
        
        {/* Edit input or task text */}
        {isEditing ? (
          <View style={styles.editContainer}>
            <TextInput
              ref={inputRef as React.RefObject<TextInput>}
              value={editText}
              onChangeText={setEditText}
              style={[
                styles.input,
                { 
                  backgroundColor: theme.background.secondary,
                  color: theme.typography.primary,
                  borderColor: theme.border
                }
              ]}
              editable={!isSaving}
              autoFocus
            />
            <Pressable
              onPress={handleEdit}
              disabled={isSaving || !editText.trim() || editText === task.text}
              style={[
                styles.saveButton,
                { backgroundColor: theme.brand.background },
                (isSaving || !editText.trim() || editText === task.text) && styles.disabledButton
              ]}
            >
              {isSaving ? (
                <ActivityIndicator size="small" color={theme.brand.text} />
              ) : (
                <ThemedText style={[styles.saveButtonText, { color: theme.brand.text }]}>
                  Save
                </ThemedText>
              )}
            </Pressable>
          </View>
        ) : (
          <>
            <ThemedText 
              style={[
                styles.taskText,
                task.is_done && styles.completedTask,
                (isToggling || isDeleting || isSaving) && styles.disabledText
              ]}
            >
              {task.text}
            </ThemedText>
            {isColumnOwner && !isEditing && (
              <View style={styles.actions}>
                <Pressable
                  onPress={() => setIsEditing(true)}
                  disabled={isDeleting || isSaving}
                  style={({ pressed }) => [
                    styles.actionButton,
                    pressed && styles.pressed
                  ]}
                >
                  <Pencil size={16} color={theme.typography.secondary} />
                </Pressable>
                <Pressable
                  onPress={handleDelete}
                  disabled={isDeleting || isSaving}
                  style={({ pressed }) => [
                    styles.actionButton,
                    pressed && styles.pressed
                  ]}
                >
                  {isDeleting ? (
                    <ActivityIndicator size="small" color={theme.error.DEFAULT} />
                  ) : (
                    <Trash2 size={16} color={theme.error.DEFAULT} />
                  )}
                </Pressable>
              </View>
            )}
          </>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 8,
    paddingVertical: 12,
    borderRadius: 8,
  },
  disabled: {
    opacity: 0.5,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  checkbox: {
    padding: 4,
  },
  pressed: {
    opacity: 0.7,
  },
  editContainer: {
    flex: 1,
    flexDirection: 'row',
    gap: 8,
    alignItems: 'center',
  },
  input: {
    flex: 1,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
    borderWidth: 1,
    fontSize: 16,
  },
  saveButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 4,
    justifyContent: 'center',
    alignItems: 'center',
  },
  saveButtonText: {
    fontSize: 14,
    fontWeight: '500',
  },
  disabledButton: {
    opacity: 0.5,
  },
  taskText: {
    flex: 1,
    fontSize: 16,
  },
  completedTask: {
    textDecorationLine: 'line-through',
  },
  disabledText: {
    opacity: 0.5,
  },
  actions: {
    flexDirection: 'row',
    gap: 8,
  },
  actionButton: {
    padding: 4,
    borderRadius: 4,
  },
});
