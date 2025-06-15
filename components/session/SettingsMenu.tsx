import { BottomSheet } from '@/components/common/BottomSheet';
import { ConfirmationModal } from '@/components/common/ConfirmationModal';
import { ThemedText } from '@/components/ThemedText';
import { ENDPOINTS } from '@/config/endpoints';
import { darkTheme, lightTheme } from '@/constants/Colors';
import { useTheme } from '@/contexts/ThemeContext';
import { useApi } from '@/hooks/useApi';
import { Session } from '@/types/session';
import { useRouter } from 'expo-router';
import { Edit2, LogOut, Trash2, X } from 'lucide-react-native';
import React, { useState } from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { SessionNameEditForm } from './SessionNameEditForm';

interface SettingsMenuProps {
  isOpen: boolean;
  onClose: () => void;
  session: Session;
  isCreator: boolean;
  onSessionUpdate?: (updatedSession: Session) => void;
  onSessionLeave?: () => void;
  onSessionDelete?: () => void;
  taskSortOrder: 'newest' | 'oldest';
  onTaskSortChange: (order: 'newest' | 'oldest') => void;
  showRankings: boolean;
  onShowRankingsChange: (show: boolean) => void;
}

interface EditState {
  isLoading: boolean;
  error: string | null;
}

export function SettingsMenu({ 
  isOpen,
  onClose,
  session, 
  isCreator, 
  onSessionUpdate,
  onSessionLeave,
  onSessionDelete,
  taskSortOrder,
  onTaskSortChange,
  showRankings,
  onShowRankingsChange
}: SettingsMenuProps) {
  const { resolvedTheme } = useTheme();
  const theme = resolvedTheme === 'dark' ? darkTheme : lightTheme;
  const { put, post, delete: deleteRequest } = useApi();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditingName, setIsEditingName] = useState(false);
  const [showConfirmDelete, setShowConfirmDelete] = useState(false);
  const [showConfirmLeave, setShowConfirmLeave] = useState(false);
  const [editState, setEditState] = useState<EditState>({
    isLoading: false,
    error: null
  });
  const [actionState, setActionState] = useState<{
    isLoading: boolean;
    error: string | null;
  }>({
    isLoading: false,
    error: null
  });
  const router = useRouter();



  const handleEditName = () => {
    setIsEditingName(true);
    setEditState({ isLoading: false, error: null });
  };

  const handleNameSubmit = async (newName: string) => {
    if (!newName || newName === session.name) {
      setIsEditingName(false);
      return;
    }

    setEditState(prev => ({ ...prev, isLoading: true, error: null }));

    try {
      const updatedSession = await put<Session>(
        ENDPOINTS.SESSIONS.MANAGE.UPDATE.path(session.uuid),
        { name: newName }
      );
      if (onSessionUpdate) {
        onSessionUpdate(updatedSession);
      }
      setIsEditingName(false);
      setIsModalOpen(false);
    } catch (err) {
      console.error('Failed to update session name:', err);
      setEditState(prev => ({ 
        ...prev, 
        error: 'Failed to update session name. Please try again.' 
      }));
    } finally {
      setEditState(prev => ({ ...prev, isLoading: false }));
    }
  };

  const handleDeleteClick = () => {
    setShowConfirmDelete(true);
    setIsModalOpen(false);
  };

  const handleLeaveClick = () => {
    setShowConfirmLeave(true);
    setIsModalOpen(false);
  };

  return (
    <>
      {isOpen && (
        <BottomSheet isVisible={isOpen} onClose={onClose}>
          {/* Study Room Name */}
          <View style={styles.section}>
            <View style={{ 
              flexDirection: 'row', 
              alignItems: 'center', 
              justifyContent: 'space-between',
            }}>
              <ThemedText style={[styles.sectionTitle, { color: theme.typography.secondary }]}>
                Study Room Name
              </ThemedText>

              <TouchableOpacity
                onPress={onClose}
                hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                style={{
                  padding: 8,
                  borderRadius: 20,
                  backgroundColor: theme.background.primary + 'cc',
                }}
                activeOpacity={0.7}
              >
                <X size={24} color={theme.typography.primary} />
              </TouchableOpacity>
            </View>
            {isEditingName ? (
              <SessionNameEditForm
                initialName={session.name}
                isLoading={editState.isLoading}
                onSubmit={handleNameSubmit}
                onCancel={() => {
                  setIsEditingName(false);
                  setEditState({ isLoading: false, error: null });
                }}
              />
            ) : (
              <TouchableOpacity
                onPress={handleEditName}
                style={[styles.nameButton, { backgroundColor: `${theme.brand.background}10` }]}
                activeOpacity={0.7}
              >
                <ThemedText style={styles.nameText}>{session.name}</ThemedText>
                <Edit2 size={16} color={theme.typography.primary} />
              </TouchableOpacity>
            )}
          </View>

          {/* Task Display Settings */}
          {/* <View style={[styles.section, styles.borderTop, { borderTopColor: theme.border }]}> 
            <ThemedText style={[styles.sectionTitle, { color: theme.typography.secondary }]}>Task Display</ThemedText>
            <View style={styles.sortButtons}>
              <TouchableOpacity
                onPress={() => onTaskSortChange('newest')}
                style={[
                  styles.sortButton,
                  { backgroundColor: `${theme.brand.background}10` },
                  taskSortOrder === 'newest' ? styles.activeSort : styles.inactiveSort
                ]}
                activeOpacity={0.7}
              >
                <ArrowUpDown size={16} color={theme.typography.primary} />
                <ThemedText style={styles.sortButtonText}>Newest First</ThemedText>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => onTaskSortChange('oldest')}
                style={[
                  styles.sortButton,
                  { backgroundColor: `${theme.brand.background}10` },
                  taskSortOrder === 'oldest' ? styles.activeSort : styles.inactiveSort
                ]}
                activeOpacity={0.7}
              >
                <ArrowUpDown size={16} color={theme.typography.primary} style={styles.rotate180} />
                <ThemedText style={styles.sortButtonText}>Oldest First</ThemedText>
              </TouchableOpacity>
            </View>

            <TouchableOpacity
              onPress={() => onShowRankingsChange(!showRankings)}
              style={[
                styles.rankingsButton,
                { backgroundColor: `${theme.brand.background}10` }
              ]}
              activeOpacity={0.7}
            >
              <View style={styles.rankingsContent}>
                <View style={styles.rankingsLeft}>
                  <Trophy size={16} color={theme.typography.primary} />
                  <ThemedText style={styles.rankingsText}>Show Rankings</ThemedText>
                </View>
                <Switch
                  value={showRankings}
                  onValueChange={onShowRankingsChange}
                  trackColor={{ false: theme.border, true: theme.brand.background }}
                  thumbColor={theme.background.primary}
                />
              </View>
            </TouchableOpacity>
          </View> */}

          {/* Study Room Actions */}
          <View style={[styles.section, styles.borderTop, { borderTopColor: theme.border }]}> 
            <ThemedText style={[styles.sectionTitle, { color: theme.typography.secondary }]}>Study Room Actions</ThemedText>
            {isCreator ? (
              <TouchableOpacity
                onPress={handleDeleteClick}
                style={[
                  styles.actionButton,
                  { backgroundColor: `${theme.error.DEFAULT}10` }
                ]}
                disabled={actionState.isLoading}
                activeOpacity={0.7}
              >
                <Trash2 size={16} color={theme.error.DEFAULT} />
                <ThemedText style={[styles.actionButtonText, { color: theme.error.DEFAULT }]}> {actionState.isLoading ? 'Deleting...' : 'Delete Study Room'} </ThemedText>
              </TouchableOpacity>
            ) : (
              <TouchableOpacity
                onPress={handleLeaveClick}
                style={[
                  styles.actionButton,
                  { backgroundColor: `${theme.error.DEFAULT}10` }
                ]}
                disabled={actionState.isLoading}
                activeOpacity={0.7}
              >
                <LogOut size={16} color={theme.error.DEFAULT} />
                <ThemedText style={[styles.actionButtonText, { color: theme.error.DEFAULT }]}> {actionState.isLoading ? 'Leaving...' : 'Leave Study Room'} </ThemedText>
              </TouchableOpacity>
            )}
            {actionState.error && (
              <ThemedText style={[styles.error, { color: theme.error.DEFAULT }]}> {actionState.error} </ThemedText>
            )}
          </View>
        </BottomSheet>
      )}

      <ConfirmationModal
        isOpen={showConfirmDelete}
        onClose={() => setShowConfirmDelete(false)}
        onConfirm={async () => {
          await (async () => {
            setActionState({ ...actionState, isLoading: true });
            try {
              await deleteRequest(ENDPOINTS.SESSIONS.MANAGE.DELETE.path(session.uuid));
              onSessionDelete?.();
              setShowConfirmDelete(false);
              router.replace('/');
            } catch (err) {
              setActionState({ ...actionState, isLoading: false, error: 'Failed to delete session. Please try again.' });
            }
          })();
        }}
        title="Delete Study Room"
        message="Are you sure you want to delete this study room? This action cannot be undone and all participants will be removed."
        confirmText={actionState.isLoading ? 'Deleting...' : 'Delete Study Room'}
        isDestructive={true}
      />

      <ConfirmationModal
        isOpen={showConfirmLeave}
        onClose={() => setShowConfirmLeave(false)}
        onConfirm={async () => {
          await (async () => {
            setActionState({ ...actionState, isLoading: true });
            try {
              await post(ENDPOINTS.SESSIONS.LEAVE.path(session.uuid));
              onSessionLeave?.();
              setShowConfirmLeave(false);
              router.replace('/');
            } catch (err) {
              setActionState({ ...actionState, isLoading: false, error: 'Failed to leave session. Please try again.' });
            }
          })();
        }}
        title="Leave Study Room"
        message="Are you sure you want to leave this study room? You can rejoin later if you have the study room link."
        confirmText={actionState.isLoading ? 'Leaving...' : 'Leave Study Room'}
        isDestructive={true}
      />
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'relative',
  },
  triggerButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.3)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    width: '90%',
    maxHeight: '80%',
    borderRadius: 16,
    padding: 0,
    overflow: 'hidden',
  },
  closeButton: {
    marginTop: 12,
    alignSelf: 'center',
    paddingHorizontal: 24,
    paddingVertical: 8,
    borderRadius: 8,
    backgroundColor: '#eee',
  },
  closeButtonText: {
    fontSize: 16,
    fontWeight: '500',
  },
  section: {
    gap: 12,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '600',
  },
  borderTop: {
    borderTopWidth: 1,
    paddingTop: 16,
    marginTop: 16,
  },
  nameButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 12,
    borderRadius: 8,
  },
  nameText: {
    fontSize: 14,
  },
  sortButtons: {
    flexDirection: 'row',
    gap: 8,
  },
  sortButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    padding: 12,
    borderRadius: 8,
  },
  activeSort: {
    opacity: 1,
  },
  inactiveSort: {
    opacity: 0.5,
  },
  sortButtonText: {
    fontSize: 14,
  },
  rotate180: {
    transform: [{ rotate: '180deg' }],
  },
  rankingsButton: {
    padding: 12,
    borderRadius: 8,
  },
  rankingsContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  rankingsLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  rankingsText: {
    fontSize: 14,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    padding: 12,
    borderRadius: 8,
  },
  actionButtonText: {
    fontSize: 14,
  },
  error: {
    fontSize: 14,
    marginTop: 8,
  },
}); 