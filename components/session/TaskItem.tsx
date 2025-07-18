import { ThemedText } from '@/components/ThemedText';
import { darkTheme, lightTheme } from '@/constants/Colors';
import { useTheme } from '@/contexts/ThemeContext';
import { Task } from '@/types/session';
import {
  Pencil,
  Square,
  Trash2
} from 'lucide-react-native';
import React, { useState, useRef, useEffect } from 'react';
import { Pressable, View, Text, TouchableOpacity } from 'react-native';
import { Swipeable } from 'react-native-gesture-handler';
import { FontAwesome } from '@expo/vector-icons';
import { TaskInputAccessory } from './TaskInputAccessory';

// Simple global swipeable manager - no React state, just direct refs
class SwipeableManager {
  private currentSwipeable: Swipeable | null = null;

  openSwipeable(swipeable: Swipeable) {
    // Close previous if different
    if (this.currentSwipeable && this.currentSwipeable !== swipeable) {
      this.currentSwipeable.close();
    }
    this.currentSwipeable = swipeable;
  }

  // Close any open swipeable immediately when user interacts with another item
  closeCurrentIfDifferent(swipeable: Swipeable) {
    if (this.currentSwipeable && this.currentSwipeable !== swipeable) {
      this.currentSwipeable.close();
      this.currentSwipeable = null;
    }
  }

  closeAll() {
    if (this.currentSwipeable) {
      this.currentSwipeable.close();
      this.currentSwipeable = null;
    }
  }
}

// Global instance - shared across all TaskItems
const swipeableManager = new SwipeableManager();

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
  const swipeableRef = useRef<Swipeable>(null);

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
    // Close any open swipeables when opening edit
    swipeableManager.closeAll();
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

  const handleSwipeableOpen = () => {
    if (swipeableRef.current) {
      swipeableManager.openSwipeable(swipeableRef.current);
    }
  };

  // Close any open swipeable immediately when user starts interacting with this item
  const handleTouchStart = () => {
    if (swipeableRef.current) {
      swipeableManager.closeCurrentIfDifferent(swipeableRef.current);
    }
  };

  // Close any open swipeable immediately when user starts swiping this item
  const handleSwipeableWillOpen = () => {
    if (swipeableRef.current) {
      swipeableManager.closeCurrentIfDifferent(swipeableRef.current);
    }
  };

  const isChecked = task.is_done;
  const isCheckedInEditMode = pendingToggleState !== null ? pendingToggleState : task.is_done;

  // Render swipe actions for edit and delete
  const renderRightActions = () => {
    if (!isColumnOwner) return null;

  return (
      <View className="flex-row items-stretch">
        <TouchableOpacity 
          className="justify-center items-center w-[60px] bg-blue-500"
          onPress={handleOpenEdit}
        >
          <Pencil size={16} color="#fff" />
        </TouchableOpacity>
        <TouchableOpacity 
          className="justify-center items-center w-[60px] bg-red-500"
          onPress={handleDelete}
        >
          <Trash2 size={16} color="#fff" />
        </TouchableOpacity>
      </View>
    );
  };

  // Task content component
  const taskContent = (
      <View 
        className="flex-row items-center border-b"
        style={{ backgroundColor: theme.background.secondary, borderColor: theme.border }}
        onTouchStart={handleTouchStart}
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
        className={`py-2 flex-1 ${task.is_done ? 'line-through opacity-60' : ''} ${(isToggling || isDeleting || isSaving) ? 'opacity-50' : ''}`}
        >
          {task.text}
        </ThemedText>
      </View>
  );

  return (
    <View className={`${isDeleting || isSaving ? 'opacity-50' : ''}`}>
      {isColumnOwner ? (
        <Swipeable 
          ref={swipeableRef}
          renderRightActions={renderRightActions}
          onSwipeableOpen={handleSwipeableOpen}
          onSwipeableWillOpen={handleSwipeableWillOpen}
        >
          {taskContent}
        </Swipeable>
      ) : (
        taskContent
      )}
      
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
