import { ThemedText } from '@/components/ThemedText';
import { darkTheme, lightTheme } from '@/constants/Colors';
import { useTheme } from '@/contexts/ThemeContext';
import { Task } from '@/types/session';
import {
  MoreVertical,
  Pencil,
  Square,
  Trash2
} from 'lucide-react-native';
import React, { useRef, useState } from 'react';
import { ActivityIndicator, Pressable, TextInput, View, Text } from 'react-native';
import { CustomModal } from '../common/CustomModal';
import { FontAwesome } from '@expo/vector-icons';

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
  const [showActions, setShowActions] = useState(false);

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

  const handleOpenEdit = () => {
    setEditText(task.text);
    setIsEditing(true);
  };

  const handleCloseEdit = () => {
    setIsEditing(false);
    setEditText(task.text);
  };

  const isChecked = task.is_done;

  return (
    <View className={`rounded-lg ${isDeleting || isSaving ? 'opacity-50' : ''}`}>
      <View 
        className="flex-row items-center"
        // style={{ borderColor: theme.border }}
      >
        {/* Only the checkbox is pressable for toggling */}
        <Pressable
          onPress={() => isColumnOwner && onToggle?.(task)}
          disabled={isToggling || isDeleting || isEditing || !isColumnOwner}
          className="p-4"
          style={({ pressed }) => [pressed && { opacity: 0.7 }]}
        >
          {isChecked ? (
            <FontAwesome name="check-square" size={24} color={theme.brand.background} />
          ) : (
            <Square size={24} color={theme.typography.secondary} />
          )}
        </Pressable>
        
        {/* Task text (not pressable) */}
        <ThemedText
          style={{ borderColor: theme.border }}
          className={`border-b py-2 flex-1 ${task.is_done ? 'line-through opacity-60' : ''} ${(isToggling || isDeleting || isSaving) ? 'opacity-50' : ''}`}
        >
          {task.text}
        </ThemedText>
        
        {/* Action button (three dots) */}
        {isColumnOwner && (
          <Pressable
            onPress={() => setShowActions(true)}
            className="p-4"
            style={({ pressed }) => [pressed && { opacity: 0.7 }]}
            hitSlop={10}
          >
            <MoreVertical size={24} color={theme.typography.secondary} />
          </Pressable>
        )}
      </View>

      {/* Actions Modal */}
      <CustomModal isVisible={showActions} onClose={() => setShowActions(false)}>
        <View className="gap-2">
          <Pressable
            onPress={() => {
              setShowActions(false);
              handleOpenEdit();
            }}
            className="py-3 rounded bg-blue-100 items-center flex-row justify-center gap-2"
          >
            <Pencil size={18} color="#2563eb" />
            <Text className="text-base font-medium text-blue-700">Edit</Text>
          </Pressable>
          <Pressable
            onPress={async () => {
              setShowActions(false);
              await handleDelete();
            }}
            className="py-3 rounded bg-red-100 items-center flex-row justify-center gap-2"
          >
            <Trash2 size={18} color="#dc2626" />
            <Text className="text-base font-medium text-red-700">Delete</Text>
          </Pressable>
          <Pressable
            onPress={() => setShowActions(false)}
            className="py-3 rounded bg-gray-100 items-center"
          >
            <Text className="text-base font-medium text-gray-700">Cancel</Text>
          </Pressable>
        </View>
      </CustomModal>

      {/* Edit Modal */}
      <CustomModal isVisible={isEditing} onClose={handleCloseEdit}>
        <View className="gap-4">
          <ThemedText className="text-lg font-semibold text-center">Edit Task</ThemedText>
          <ThemedText className="text-sm text-gray-500">Update your task below:</ThemedText>
          <TextInput
            ref={inputRef as React.RefObject<TextInput>}
            value={editText}
            onChangeText={setEditText}
            style={{
              backgroundColor: theme.background.secondary,
              color: theme.typography.primary,
              borderColor: theme.border,
              textAlignVertical: 'top',
            }}
            className="px-3 py-2 rounded border text-base min-h-[72px] max-h-[144px]"
            editable={!isSaving}
            autoFocus
            multiline
            numberOfLines={3}
            maxLength={300}
            returnKeyType="done"
            blurOnSubmit={true}
          />
          <View className="flex-row gap-2 mt-2">
            <Pressable
              onPress={handleCloseEdit}
              disabled={isSaving}
              className="flex-1 py-2 rounded bg-gray-200 items-center"
              style={({ pressed }) => [pressed && { opacity: 0.7 }]}
            >
              <ThemedText className="text-base font-medium" style={{ color: theme.typography.primary }}>
                Cancel
              </ThemedText>
            </Pressable>
            <Pressable
              onPress={handleEdit}
              className="flex-1 py-2 rounded items-center bg-blue-400"
            >
              {isSaving ? (
                <ActivityIndicator size="small" color={theme.brand.text} />
              ) : (
                <ThemedText style={{ color: theme.brand.text }} className="text-base font-semibold">
                  Save
                </ThemedText>
              )}
            </Pressable>
          </View>
        </View>
      </CustomModal>
    </View>
  );
}
