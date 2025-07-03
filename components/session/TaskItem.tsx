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
import React from 'react';
import { useRef, useState } from 'react';
import { ActivityIndicator, Pressable, TextInput, View } from 'react-native';

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
    <View 
      className={`px-2 py-3 rounded-lg ${isDeleting || isSaving ? 'opacity-50' : ''}`}
    >
      <View className="flex-row items-center gap-1">
        {/* Checkbox */}
        <Pressable
          onPress={() => isColumnOwner && onToggle?.(task)}
          disabled={isToggling || isDeleting || isEditing || !isColumnOwner}
          className="p-1"
          style={({ pressed }) => [pressed && { opacity: 0.7 }]}
        >
          {isChecked ? (
            <CheckCircle size={16} color="#22C55E" />
          ) : (
            <Circle size={16} color="#EAB308" />
          )}
        </Pressable>
        
        {/* Edit input or task text */}
        {isEditing ? (
          <View className="flex-1 flex-row gap-2 items-center">
            <TextInput
              ref={inputRef as React.RefObject<TextInput>}
              value={editText}
              onChangeText={setEditText}
              style={{
                backgroundColor: theme.background.secondary,
                color: theme.typography.primary,
                borderColor: theme.border,
              }}
              className="flex-1 px-2 py-1 rounded border text-base"
              editable={!isSaving}
              autoFocus
            />
            <Pressable
              onPress={handleEdit}
              disabled={isSaving || !editText.trim() || editText === task.text}
              style={({ pressed }) => [
                { backgroundColor: theme.brand.background },
                pressed && { opacity: 0.7 },
                (isSaving || !editText.trim() || editText === task.text) && { opacity: 0.5 },
              ]}
              className="px-3 py-1 rounded justify-center items-center"
            >
              {isSaving ? (
                <ActivityIndicator size="small" color={theme.brand.text} />
              ) : (
                <ThemedText style={{ color: theme.brand.text }} className="text-sm font-medium">
                  Save
                </ThemedText>
              )}
            </Pressable>
          </View>
        ) : (
          <>
            <ThemedText 
              className={`flex-1 ${task.is_done ? 'line-through' : ''} ${(isToggling || isDeleting || isSaving) ? 'opacity-50' : ''}`}
            >
              {task.text}
            </ThemedText>
            {isColumnOwner && !isEditing && (
              <View className="flex-row gap-2">
                <Pressable
                  onPress={() => setIsEditing(true)}
                  disabled={isDeleting || isSaving}
                  className="p-1 rounded"
                  style={({ pressed }) => [pressed && { opacity: 0.7 }]}
                >
                  <Pencil size={16} color={theme.typography.secondary} />
                </Pressable>
                <Pressable
                  onPress={handleDelete}
                  disabled={isDeleting || isSaving}
                  className="p-1 rounded"
                  style={({ pressed }) => [pressed && { opacity: 0.7 }]}
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
