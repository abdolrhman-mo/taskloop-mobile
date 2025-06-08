import { darkTheme, lightTheme } from '@/constants/Colors';
import { useTheme } from '@/contexts/ThemeContext';
import { AlertTriangle } from 'lucide-react-native';
import { useEffect } from 'react';
import { BackHandler, Modal, Platform, Pressable, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

interface ConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmText: string;
  isDestructive?: boolean;
  isConfirming?: boolean;
}

export function ConfirmationModal({ 
  isOpen, 
  onClose, 
  onConfirm,
  title,
  message,
  confirmText,
  isDestructive = false,
  isConfirming = false
}: ConfirmationModalProps) {
  const { resolvedTheme } = useTheme();
  const theme = resolvedTheme === 'dark' ? darkTheme : lightTheme;

  // Handle back button on Android
  useEffect(() => {
    let subscription: { remove: () => void } | undefined;

    if (Platform.OS === 'android') {
      subscription = BackHandler.addEventListener('hardwareBackPress', () => {
        if (isOpen) {
        onClose();
          return true;
        }
        return false;
      });
    }

    return () => {
      subscription?.remove();
    };
  }, [isOpen, onClose]);

  return (
    <Modal
      visible={isOpen}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <Pressable 
        style={[styles.overlay, { backgroundColor: 'rgba(0, 0, 0, 0.2)' }]}
        onPress={onClose}
      >
        <Pressable 
          style={[
            styles.modal,
            { 
          backgroundColor: theme.background.primary,
              shadowColor: '#000',
              shadowOffset: { width: 0, height: 4 },
              shadowOpacity: 0.1,
              shadowRadius: 32,
              elevation: 8,
            }
          ]}
          onPress={e => e.stopPropagation()}
      >
        {/* Header */}
          <View style={[styles.header, { borderBottomColor: theme.border }]}>
            <Text style={[styles.title, { color: theme.typography.primary }]}>
            {title}
            </Text>
          </View>

        {/* Message */}
          <View style={styles.messageContainer}>
            <View style={styles.messageContent}>
            <AlertTriangle 
                size={20}
                color={isDestructive ? theme.error.DEFAULT : theme.typography.secondary}
                style={styles.icon}
            />
              <Text style={[styles.message, { color: theme.typography.secondary }]}>
              {message}
              </Text>
            </View>
          </View>

        {/* Actions */}
          <View style={[styles.actions, { borderTopColor: theme.border }]}>
            <TouchableOpacity
              onPress={onConfirm}
            disabled={isConfirming}
              style={[
                styles.button,
                styles.confirmButton,
                { 
              backgroundColor: isDestructive ? theme.error.DEFAULT : theme.brand.background,
                  opacity: isConfirming ? 0.5 : 1,
                }
              ]}
          >
              <Text style={[styles.buttonText, { color: theme.brand.text }]}>
            {confirmText}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={onClose}
            disabled={isConfirming}
              style={[
                styles.button,
                styles.cancelButton,
                { 
              backgroundColor: `${theme.typography.secondary}20`,
                  opacity: isConfirming ? 0.5 : 1,
                }
              ]}
          >
              <Text style={[styles.buttonText, { color: theme.typography.secondary }]}>
            Cancel
              </Text>
            </TouchableOpacity>
          </View>
        </Pressable>
      </Pressable>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modal: {
    width: '90%',
    maxWidth: 400,
    borderRadius: 12,
    overflow: 'hidden',
  },
  header: {
    padding: 16,
    borderBottomWidth: 1,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
  },
  messageContainer: {
    padding: 24,
  },
  messageContent: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
  },
  icon: {
    marginTop: 2,
  },
  message: {
    flex: 1,
    fontSize: 14,
    lineHeight: 20,
  },
  actions: {
    flexDirection: 'row',
    padding: 16,
    gap: 12,
    borderTopWidth: 1,
  },
  button: {
    flex: 1,
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  confirmButton: {
    minHeight: 40,
  },
  cancelButton: {
    minHeight: 40,
  },
  buttonText: {
    fontSize: 14,
    fontWeight: '500',
  },
}); 