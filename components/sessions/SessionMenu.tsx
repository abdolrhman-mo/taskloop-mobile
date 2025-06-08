import { darkTheme, lightTheme } from '@/constants/Colors';
import { useTheme } from '@/contexts/ThemeContext';
import { Session, User } from '@/types/session';
import { LogOut, MoreVertical, Trash2 } from 'lucide-react-native';
import React, { useEffect, useState } from 'react';
import {
  Alert,
  BackHandler,
  Modal,
  Pressable,
  StyleSheet,
  TouchableWithoutFeedback,
  View
} from 'react-native';
import { DropdownMenu } from '../../components/common/DropdownMenu';

interface SessionMenuProps {
  session: Session;
  user: User | null;
  onLeave: (sessionId: string) => Promise<void>;
  onDelete: (sessionId: string) => Promise<void>;
  isLeaving: boolean;
  isDeleting: boolean;
  leaveError: string | null;
  deleteError: string | null;
}

export function SessionMenu({ 
  session, 
  user,
  onLeave, 
  onDelete,
  isLeaving,
  isDeleting,
  leaveError,
  deleteError 
}: SessionMenuProps) {
  const { resolvedTheme } = useTheme();
  const theme = resolvedTheme === 'dark' ? darkTheme : lightTheme;
  const [isOpen, setIsOpen] = useState(false);
  const [isPressed, setIsPressed] = useState(false);
  const isCreator = user && session.creator === user.id;
  const isParticipant = user && session.participants.some(p => p.id === user.id);

  // Close menu when pressing back button
  useEffect(() => {
    const handleBackPress = () => {
      if (isOpen) {
        setIsOpen(false);
        return true;
      }
      return false;
    };

    const backHandler = BackHandler.addEventListener('hardwareBackPress', handleBackPress);
    return () => backHandler.remove();
  }, [isOpen]);

  const handleAction = async () => {
    const action = isCreator ? 'delete' : 'leave';
    const title = isCreator ? 'Delete Session' : 'Leave Session';
    const message = isCreator 
      ? 'Are you sure you want to delete this session? This action cannot be undone.'
      : 'Are you sure you want to leave this session?';

    Alert.alert(
      title,
      message,
      [
        {
          text: 'Cancel',
          style: 'cancel',
          onPress: () => setIsOpen(false)
        },
        {
          text: isCreator ? 'Delete' : 'Leave',
          style: 'destructive',
          onPress: async () => {
    if (isCreator) {
              await onDelete(session.uuid);
      } else {
              await onLeave(session.uuid);
      }
        setIsOpen(false);
      }
    }
      ]
    );
  };

  // Don't show menu if user is not a participant
  if (!isParticipant) {
    return null;
  }

  // Build menu items
  const items = [
    {
      label: isCreator ? 'Delete Session' : 'Leave Session',
      icon: isCreator ? (
        <Trash2 size={16} color={theme.error.DEFAULT} />
      ) : (
        <LogOut size={16} color={theme.error.DEFAULT} />
      ),
      onPress: handleAction,
      isDestructive: true,
      isLoading: isDeleting || isLeaving,
      error: deleteError || leaveError,
    },
  ];

  return (
    <View style={styles.wrapper}>
      <Pressable
        onPress={() => setIsOpen(!isOpen)}
        onPressIn={() => setIsPressed(true)}
        onPressOut={() => setIsPressed(false)}
        style={[
          styles.menuButton,
          { 
            backgroundColor: `${theme.background.tertiary}${isPressed ? '30' : '20'}`,
          }
        ]}
        disabled={isLeaving || isDeleting}
      >
        <MoreVertical 
          size={20} 
          color={theme.typography.primary}
        />
      </Pressable>

      <Modal
        visible={isOpen}
        transparent
        animationType="fade"
        onRequestClose={() => setIsOpen(false)}
      >
        <TouchableWithoutFeedback onPress={() => setIsOpen(false)}>
          <View style={styles.modalOverlay}>
            <TouchableWithoutFeedback>
              <View style={styles.dropdownContainer}>
                <DropdownMenu 
                  items={items} 
                  isOpen={isOpen} 
                  style={styles.dropdown}
                />
              </View>
            </TouchableWithoutFeedback>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    position: 'absolute',
    top: 12, // top-3
    right: 12, // right-3
    zIndex: 1000,
  },
  menuButton: {
    padding: 6, // p-1.5
    borderRadius: 8, // rounded-lg
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    justifyContent: 'flex-start',
    alignItems: 'flex-end',
    paddingTop: 48, // Account for the menu button position
    paddingRight: 12, // Match the right padding of the wrapper
  },
  dropdownContainer: {
    backgroundColor: 'transparent',
    borderRadius: 8,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 4,
  },
  dropdown: {
    backgroundColor: 'transparent',
  },
}); 