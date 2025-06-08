import { ThemedText } from '@/components/ThemedText';
import { darkTheme, lightTheme } from '@/constants/Colors';
import { useTheme } from '@/contexts/ThemeContext';
import { Check, Copy } from 'lucide-react-native';
import React, { useEffect, useState } from 'react';
import { BackHandler, Clipboard, Modal, StyleSheet, TouchableOpacity, View } from 'react-native';


interface ShareSessionModalProps {
  isOpen: boolean;
  onClose: () => void;
  sessionId: string;
}

export function ShareSessionModal({ isOpen, onClose, sessionId }: ShareSessionModalProps) {
  const { resolvedTheme } = useTheme();
  const theme = resolvedTheme === 'dark' ? darkTheme : lightTheme;
  const [copyState, setCopyState] = useState({
    isCopied: false,
    error: null as string | null
  });

  useEffect(() => {
    const backHandler = BackHandler.addEventListener('hardwareBackPress', () => {
      if (isOpen) {
        onClose();
        return true;
      }
      return false;
    });

    return () => backHandler.remove();
  }, [isOpen, onClose]);

  const handleCopyLink = async () => {
    try {
      const sessionUrl = `https://taskloop.app/session/${sessionId}`;
      await Clipboard.setString(sessionUrl);
      setCopyState({ isCopied: true, error: null });
      setTimeout(() => setCopyState(prev => ({ ...prev, isCopied: false })), 2000);
    } catch (err) {
      console.error('Failed to copy link:', err);
      setCopyState({ isCopied: false, error: 'Failed to copy link' });
    }
  };

  return (
    <Modal
      visible={isOpen}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <TouchableOpacity
        style={styles.backdrop}
        activeOpacity={1}
        onPress={onClose}
      >
        <View 
          style={[
            styles.modal,
            { 
              backgroundColor: theme.background.primary,
              borderColor: theme.border,
            }
          ]}
        >
          {/* Header */}
          <View style={[styles.header, { borderBottomColor: theme.border }]}>
            <ThemedText style={styles.headerText}>
              Share Session
            </ThemedText>
          </View>

          {/* Instructions */}
          <View style={styles.instructions}>
            <ThemedText style={[styles.instructionsText, { color: theme.typography.secondary }]}>
              Copy and share this link with your friends to let them join your session
            </ThemedText>
          </View>

          {/* Copy Link Section */}
          <View style={[styles.copySection, { borderTopColor: theme.border }]}>
            <TouchableOpacity
              onPress={handleCopyLink}
              style={[styles.copyButton, { backgroundColor: `${theme.brand.background}20` }]}
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
                      Copy Session Link
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
        </View>
      </TouchableOpacity>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modal: {
    width: '90%',
    maxWidth: 400,
    borderRadius: 12,
    borderWidth: 1,
    overflow: 'hidden',
  },
  header: {
    padding: 16,
    borderBottomWidth: 1,
  },
  headerText: {
    fontSize: 18,
    fontWeight: '600',
  },
  instructions: {
    padding: 24,
  },
  instructionsText: {
    fontSize: 14,
    textAlign: 'center',
  },
  copySection: {
    padding: 16,
    borderTopWidth: 1,
  },
  copyButton: {
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