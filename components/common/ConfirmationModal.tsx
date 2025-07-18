import { darkTheme, lightTheme } from '@/constants/Colors';
import { useTheme } from '@/contexts/ThemeContext';
import { AlertTriangle } from 'lucide-react-native';
import { useEffect } from 'react';
import { BackHandler, Platform, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { CustomModal } from './CustomModal';

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
    <CustomModal isVisible={isOpen} onClose={onClose}>
      <View style={styles.modal}>
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
      </View>
    </CustomModal>
  );
}

const styles = StyleSheet.create({
  modal: {
    maxWidth: 400,
    borderRadius: 12,
    overflow: 'hidden',
    backgroundColor: 'transparent',
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
    paddingVertical: 16,
    gap: 16,
    borderTopWidth: 1,
    justifyContent: 'space-between',
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