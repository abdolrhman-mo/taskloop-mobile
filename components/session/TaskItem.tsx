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
import React, { useState } from 'react';
import { Pressable, View, Text } from 'react-native';
import { CustomModal } from '../common/CustomModal';
import { FontAwesome } from '@expo/vector-icons';
import { TaskInputAccessory } from './TaskInputAccessory';

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
  const [pendingToggleState, setPendingToggleState] = useState<boolean | null>(null);
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
    const hasTextChanged = editText.trim() && editText !== task.text;
    const hasToggleChanged = pendingToggleState !== null && pendingToggleState !== task.is_done;
    
    // If nothing changed, just close the edit mode
    if (!hasTextChanged && !hasToggleChanged) {
      setIsEditing(false);
      setEditText(task.text);
      setPendingToggleState(null);
      return;
    }

    setIsSaving(true);
    try {
      // Update text if it changed
      if (hasTextChanged) {
        await onEdit?.(task.id, editText.trim());
      }
      
      // Apply pending toggle state if it was changed during editing
      if (hasToggleChanged) {
        await onToggle?.(task);
      }
      
      setIsEditing(false);
      setPendingToggleState(null);
    } catch (error) {
      console.error('Failed to edit task:', error);
      setEditText(task.text);
    } finally {
      setIsSaving(false);
    }
  };

  const handleOpenEdit = () => {
    setEditText(task.text);
    setPendingToggleState(null);
    setIsEditing(true);
  };

  const handleCloseEdit = () => {
    setIsEditing(false);
    setEditText(task.text);
    setPendingToggleState(null);
  };

  const handleToggleInEditMode = () => {
    const currentState = pendingToggleState !== null ? pendingToggleState : task.is_done;
    setPendingToggleState(!currentState);
  };

  const isChecked = task.is_done;
  const isCheckedInEditMode = pendingToggleState !== null ? pendingToggleState : task.is_done;

  return (
    <View className={`rounded-lg ${isDeleting || isSaving ? 'opacity-50' : ''}`}>
      <View 
        className="flex-row items-center"
        // style={{ borderColor: theme.border }}
      >
        {/* Main toggle button */}
        <Pressable
          onPress={() => onToggle?.(task)}
          disabled={isToggling || isDeleting || isEditing}
          className="p-4"
          style={({ pressed }) => [pressed && { opacity: 0.7 }]}
        >
          {isChecked ? (
            <FontAwesome name="check-square" size={24} color={theme.brand.background} />
          ) : (
            <Square size={24} color={theme.brand.background} />
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

      {/* Edit Input Accessory */}
      <TaskInputAccessory
        isVisible={isEditing}
        onClose={handleCloseEdit}
        mode="edit"
        text={editText}
        onTextChange={setEditText}
        isToggled={isCheckedInEditMode}
        onToggle={handleToggleInEditMode}
        onSubmit={handleEdit}
        isSubmitting={isSaving}
      />
    </View>
  );
}
