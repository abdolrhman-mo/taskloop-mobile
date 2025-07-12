import { ThemedText } from '@/components/ThemedText';
import { darkTheme, lightTheme } from '@/constants/Colors';
import { useTheme } from '@/contexts/ThemeContext';
import { Task } from '@/types/session';
import {
  CheckCircle,
  Circle,
  MoreVertical,
  Pencil,
  Square,
  SquareCheck,
  Trash2
} from 'lucide-react-native';
import React, { useRef, useState } from 'react';
import { ActivityIndicator, Pressable, TextInput, View, Text, Animated } from 'react-native';
import { CustomModal } from '../common/CustomModal';

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
  const scaleAnim = useRef(new Animated.Value(1)).current;

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

  const handlePressIn = () => {
    Animated.spring(scaleAnim, {
      toValue: 0.97,
      useNativeDriver: true,
    }).start();
  };

  const handlePressOut = () => {
    Animated.spring(scaleAnim, {
      toValue: 1,
      useNativeDriver: true,
    }).start();
  };

  return (
    <Animated.View
      style={{
        transform: [{ scale: scaleAnim }],
      }}
      className={`py-3 rounded-lg ${isDeleting || isSaving ? 'opacity-50' : ''}`}
    >
      <View className="flex-row items-center gap-1">
        {/* Main pressable area for toggling */}
        <Pressable
          onPress={() => isColumnOwner && onToggle?.(task)}
          onPressIn={handlePressIn}
          onPressOut={handlePressOut}
          onLongPress={() => isColumnOwner && setShowActions(true)}
          disabled={isToggling || isDeleting || isEditing || !isColumnOwner}
          className="flex-1 flex-row items-center gap-1"
          style={({ pressed }) => [pressed && { opacity: 0.7 }]}
        >
          <View className="p-3">
          {isChecked ? (
            <SquareCheck size={16} color="#22C55E" style={{ backgroundColor: '#22C55E' }} />
          ) : (
            <Square size={16} color="#EAB308" />
          )}
          </View>
          <ThemedText 
            className={`flex-1 ${task.is_done ? 'line-through' : ''} ${(isToggling || isDeleting || isSaving) ? 'opacity-50' : ''}`}
          >
            {task.text}
          </ThemedText>
        </Pressable>
        {/* More icon (actions) */}
        {isColumnOwner && (
          <Pressable
            onPress={() => setShowActions(true)}
            className="p-3 rounded-full"
            style={({ pressed }) => [pressed && { opacity: 0.7 }]}
            hitSlop={10}
          >
            <MoreVertical size={20} color={theme.typography.secondary} />
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
    </Animated.View>
  );
}
