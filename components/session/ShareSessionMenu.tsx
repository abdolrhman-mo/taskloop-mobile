import { ThemedText } from '@/components/ThemedText';
import { darkTheme, lightTheme } from '@/constants/Colors';
import { useTheme } from '@/contexts/ThemeContext';
import * as Clipboard from 'expo-clipboard';
import { Check, Copy } from 'lucide-react-native';
import { MessageCircle } from 'lucide-react-native';
import React, { useState } from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import { BottomSheet } from '../common/BottomSheet';
import { Linking } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
interface ShareSessionMenuProps {
  isOpen: boolean;
  onClose: () => void;
  sessionId: string;
}

export function ShareSessionMenu({ isOpen, onClose, sessionId }: ShareSessionMenuProps) {
  const { resolvedTheme } = useTheme();
  const theme = resolvedTheme === 'dark' ? darkTheme : lightTheme;
  const [copyState, setCopyState] = useState({
    isCopied: false,
    error: null as string | null,
  });

  const handleCopyLink = async () => {
    try {
      const sessionUrl = `https://tasklooop.vercel.app/session/${sessionId}`;
      // const sessionUrl = `taskloopmobile://session/${sessionId}`;
      await Clipboard.setStringAsync(sessionUrl);
      setCopyState({ isCopied: true, error: null });
      setTimeout(() => setCopyState(prev => ({ ...prev, isCopied: false })), 2000);
    } catch {
      setCopyState({ isCopied: false, error: 'Failed to copy link' });
    }
  };

  const handleShareWhatsApp = async () => {
    const sessionUrl = `https://tasklooop.vercel.app/session/${sessionId}`;
    const message = encodeURIComponent(`Join my study room: ${sessionUrl}`);
    const whatsappUrl = `whatsapp://send?text=${message}`;
    try {
      await Linking.openURL(whatsappUrl);
    } catch {
      // Optionally handle error (e.g., WhatsApp not installed)
    }
  };

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
        {/* WhatsApp Share Button */}
        <TouchableOpacity
          onPress={handleShareWhatsApp}
          className="flex-1 flex-row items-center justify-center gap-2 py-3 px-4 rounded-lg"
          style={{ backgroundColor: '#25D36620' }}
          activeOpacity={0.7}
        >
          <FontAwesome name="whatsapp" size={20} color="#25D366" />
          <ThemedText style={{ color: '#25D366' }} className="text-base font-medium">
            WhatsApp
          </ThemedText>
        </TouchableOpacity>
        {/* Copy Link Button */}
        <TouchableOpacity
          onPress={handleCopyLink}
          className="flex-1 flex-row items-center justify-center gap-2 py-3 px-4 rounded-lg"
          style={{ backgroundColor: `${theme.brand.background}20` }}
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
    </BottomSheet>
  );
} 
