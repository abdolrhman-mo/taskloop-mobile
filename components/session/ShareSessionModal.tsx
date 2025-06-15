import { ThemedText } from '@/components/ThemedText';
import { CustomModal } from '@/components/common/CustomModal';
import { darkTheme, lightTheme } from '@/constants/Colors';
import { useTheme } from '@/contexts/ThemeContext';
import * as Clipboard from 'expo-clipboard';
import { Check, Copy } from 'lucide-react-native';
import React, { useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

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
      await Clipboard.setStringAsync(sessionUrl);
      setCopyState({ isCopied: true, error: null });
      setTimeout(() => setCopyState(prev => ({ ...prev, isCopied: false })), 2000);
    } catch {
      setCopyState({ isCopied: false, error: 'Failed to copy link' });
    }
  };

  return (
    <CustomModal isVisible={isOpen} onClose={onClose}>
      <View style={[styles.header, { borderBottomColor: theme.border }]}>
        <Text style={[styles.title, { color: theme.typography.primary }]}>Share Study Room</Text>
      </View>
      <View style={styles.descriptionContainer}>
        <Text style={[styles.description, { color: theme.typography.secondary }]}>
          Share this link with your friends to let them join.
        </Text>
      </View>
      <View style={[styles.container, { borderTopColor: theme.border }]}> 
        <TouchableOpacity
          onPress={handleCopyLink}
          style={[styles.button, { backgroundColor: `${theme.brand.background}20` }]}
          activeOpacity={0.7}
        >
          <View style={styles.buttonContent}>
            {copyState.isCopied ? (
              <>
                <Check size={20} color={theme.brand.background} />
                <ThemedText style={[styles.buttonText, { color: theme.brand.background }]}>
                  Link Copied!
                </ThemedText>
              </>
            ) : (
              <>
                <Copy size={20} color={theme.brand.background} />
                <ThemedText style={[styles.buttonText, { color: theme.brand.background }]}>
                  Copy Room Link
                </ThemedText>
              </>
            )}
          </View>
        </TouchableOpacity>
        {copyState.error && (
          <ThemedText style={[styles.error, { color: theme.error.DEFAULT }]}>
            {copyState.error}
          </ThemedText>
        )}
      </View>
    </CustomModal>
  );
}

const styles = StyleSheet.create({
  header: {
    padding: 16,
    borderBottomWidth: 1,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
  },
  descriptionContainer: {
    padding: 24,
  },
  description: {
    fontSize: 14,
    textAlign: 'center',
  },
  container: {
    padding: 16,
    borderTopWidth: 1,
  },
  button: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
  },
  buttonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: '500',
  },
  error: {
    fontSize: 14,
    marginTop: 8,
    textAlign: 'center',
  },
}); 
