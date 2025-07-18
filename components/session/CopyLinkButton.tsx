import { ThemedText } from '@/components/ThemedText';
import * as Clipboard from 'expo-clipboard';
import { Check, Copy } from 'lucide-react-native';
import React, { useState } from 'react';
import { TouchableOpacity, View } from 'react-native';

interface CopyLinkButtonProps {
  sessionId: string;
  theme: any;
  className?: string;
  style?: any;
}

export function CopyLinkButton({ sessionId, theme, className = "", style }: CopyLinkButtonProps) {
  const [copyState, setCopyState] = useState({
    isCopied: false,
    error: null as string | null,
  });

  const handleCopyLink = async () => {
    try {
      const sessionUrl = `https://tasklooop.vercel.app/session/${sessionId}`;
      await Clipboard.setStringAsync(sessionUrl);
      setCopyState({ isCopied: true, error: null });
      setTimeout(() => setCopyState(prev => ({ ...prev, isCopied: false })), 2000);
    } catch {
      setCopyState({ isCopied: false, error: 'Failed to copy link' });
    }
  };

  return (
    <View className="flex-1">
      <TouchableOpacity
        onPress={handleCopyLink}
        className={`flex-1 flex-row items-center justify-center gap-2 py-3 px-4 rounded-lg ${className}`}
        style={{ backgroundColor: `${theme.brand.background}20`, ...style }}
        activeOpacity={0.7}
      >
        <View className="flex-row items-center gap-2">
          {copyState.isCopied ? (
            <>
              <Check size={20} color={theme.brand.background} />
              <ThemedText style={{ color: theme.brand.background }} className="text-base font-medium">
                Link Copied!
              </ThemedText>
            </>
          ) : (
            <>
              <Copy size={20} color={theme.brand.background} />
              <ThemedText style={{ color: theme.brand.background }} className="text-base font-medium">
                Copy Link
              </ThemedText>
            </>
          )}
        </View>
      </TouchableOpacity>
      {copyState.error && (
        <ThemedText style={{ color: theme.error.DEFAULT }} className="text-sm mt-2 text-center">
          {copyState.error}
        </ThemedText>
      )}
    </View>
  );
} 