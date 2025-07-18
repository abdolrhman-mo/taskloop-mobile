import { darkTheme, lightTheme } from '@/constants/Colors';
import { useTheme } from '@/contexts/ThemeContext';
import React from 'react';
import { Text, View } from 'react-native';
import { BottomSheet } from '../common/BottomSheet';
import { WhatsAppShareButton } from './WhatsAppShareButton';
import { CopyLinkButton } from './CopyLinkButton';
interface ShareSessionBottomSheetProps {
  isOpen: boolean;
  onClose: () => void;
  sessionId: string;
}

export function ShareSessionBottomSheet({ isOpen, onClose, sessionId }: ShareSessionBottomSheetProps) {
  const { resolvedTheme } = useTheme();
  const theme = resolvedTheme === 'dark' ? darkTheme : lightTheme;

  return (
    <BottomSheet isVisible={isOpen} onClose={onClose}>
      <View className="p-4 pb-2">
        <Text style={{ color: theme.typography.primary }} className="text-lg font-semibold">Share Study Room</Text>
      </View>
      <View style={{ borderBottomColor: theme.border }} className="pb-6 mb-4 mx-4 border-b">
        <Text style={{ color: theme.typography.secondary }} className="text-sm">
          Share this link with your friends to let them join.
        </Text>
      </View>
      <View className="p-4 flex-row gap-2">
        <WhatsAppShareButton sessionId={sessionId} />
        <CopyLinkButton sessionId={sessionId} theme={theme} />
      </View>
    </BottomSheet>
  );
} 
