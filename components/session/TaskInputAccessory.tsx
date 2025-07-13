import { ThemedText } from '@/components/ThemedText';
import { darkTheme, lightTheme } from '@/constants/Colors';
import { useTheme } from '@/contexts/ThemeContext';
import { Task } from '@/types/session';
import { ActivityIndicator, Pressable, TextInput, View, TextInputProps } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import { Square, MoveRight, ClipboardCheck, Pen } from 'lucide-react-native';
import React, { useRef } from 'react';
import { CustomInputAccessory } from '../common/CustomInputAccessory';

interface TaskInputAccessoryProps {
  isVisible: boolean;
  onClose: () => void;
  mode: 'add' | 'edit';
  
  // Text input props
  text: string;
  onTextChange: (text: string) => void;
  placeholder?: string;
  
  // Toggle props
  isToggled: boolean;
  onToggle: () => void;
  
  // Submit props
  onSubmit: () => void;
  isSubmitting: boolean;
  
  // Optional props
  maxLength?: number;
  textInputProps?: Partial<TextInputProps>;
}

export function TaskInputAccessory({
  isVisible,
  onClose,
  mode,
  text,
  onTextChange,
  placeholder = "What do you need to do?",
  isToggled,
  onToggle,
  onSubmit,
  isSubmitting,
  maxLength = 300,
  textInputProps,
}: TaskInputAccessoryProps) {
  const { resolvedTheme } = useTheme();
  const theme = resolvedTheme === 'dark' ? darkTheme : lightTheme;
  const inputRef = useRef<TextInput>(null);

  const handleSubmit = () => {
    if (!text.trim() || isSubmitting) return;
    onSubmit();
  };

  const headerIcon = mode === 'add' ? (
    <ClipboardCheck size={14} color={theme.typography.primary} />
  ) : (
    <Pen size={14} color={theme.typography.primary} />
  );

  const headerText = mode === 'add' ? 'Add Task' : 'Edit Task';

  return (
    <CustomInputAccessory isVisible={isVisible} onClose={onClose}>
      <View className="flex-row gap-2 items-center pb-2 px-4">
        {headerIcon}
        <ThemedText className="text-base font-semibold text-center">{headerText}</ThemedText>
      </View>
      <View className="flex-row items-center">
        {/* Toggle button */}
        <Pressable
          onPress={onToggle}
          disabled={isSubmitting}
          className="p-4"
          style={({ pressed }) => [pressed && { opacity: 0.7 }]}
        >
          {isToggled ? (
            <FontAwesome name="check-square" size={24} color={theme.brand.background} />
          ) : (
            <Square size={24} color={theme.brand.background} />
          )}
        </Pressable>
        
        {/* Text input */}
        <TextInput
          ref={inputRef}
          value={text}
          onChangeText={onTextChange}
          placeholder={placeholder}
          placeholderTextColor={theme.typography.secondary}
          style={{
            backgroundColor: theme.background.secondary,
            color: theme.typography.primary,
            borderColor: theme.border,
            borderWidth: 1,
            paddingHorizontal: 16,
            paddingVertical: 8,
            borderRadius: 8,
          }}
          className="flex-1 text-base"
          editable={!isSubmitting}
          autoFocus
          maxLength={maxLength}
          returnKeyType="done"
          onSubmitEditing={handleSubmit}
          {...textInputProps}
        />
        
        {/* Submit button */}
        <Pressable
          onPress={handleSubmit}
          disabled={!text.trim() || isSubmitting}
          className="items-center rounded-full p-4"
          style={({ pressed }) => [
            pressed && { opacity: 0.7 },
            (!text.trim() || isSubmitting) && { opacity: 0.5 }
          ]}
        >
          {isSubmitting ? (
            <ActivityIndicator size="small" color={theme.brand.background} />
          ) : (
            <MoveRight size={24} color={theme.brand.background} />
          )}
        </Pressable>
      </View>
    </CustomInputAccessory>
  );
} 