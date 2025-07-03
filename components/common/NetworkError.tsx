import React from 'react';
import { View, Text, Pressable } from 'react-native';

interface NetworkErrorProps {
  message?: string;
  onRetry: () => void;
  className?: string;
  style?: any;
}

export function NetworkError({ message = 'Network error. Please check your connection and try again.', onRetry, className = '', style }: NetworkErrorProps) {
  return (
    <View className={`items-center justify-center p-6 ${className}`} style={style}>
      <Text className="text-lg font-semibold text-red-600 mb-2 text-center">
        {message}
      </Text>
      <Pressable
        onPress={onRetry}
        className="bg-blue-500 px-6 py-2 rounded mt-2"
        style={({ pressed }) => [pressed && { opacity: 0.7 }]}
      >
        <Text className="text-white text-base font-semibold">Try Again</Text>
      </Pressable>
    </View>
  );
} 