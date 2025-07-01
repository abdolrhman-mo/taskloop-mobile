import { ThemedText } from '@/components/ThemedText';
import { darkTheme, lightTheme } from '@/constants/Colors';
import { useTheme } from '@/contexts/ThemeContext';
import { Task } from '@/types/session';
import { CheckCircle, Circle, Trophy } from 'lucide-react-native';
import React from 'react';
import { StyleSheet, View } from 'react-native';
import { TaskItem } from './TaskItem';

interface TaskColumnProps {
  title: string;
  tasks: Task[];
  isColumnOwner: boolean;
  onToggleTask: (task: Task) => Promise<void>;
  onDeleteTask: (taskId: number) => Promise<void>;
  onEditTask: (taskId: number, newText: string) => Promise<void>;
  togglingTaskId: number | null;
  position?: number;
  completionPercentage?: number;
}

export function TaskColumn({
  title,
  tasks,
  isColumnOwner,
  onToggleTask,
  onDeleteTask,
  onEditTask,
  togglingTaskId,
  position,
  completionPercentage
}: TaskColumnProps) {
  const { resolvedTheme } = useTheme();
  const theme = resolvedTheme === 'dark' ? darkTheme : lightTheme;
  
  const activeTasks = tasks.filter(task => !task.is_done);
  const completedTasks = tasks.filter(task => task.is_done);

  const getPositionColor = (pos: number) => {
    switch (pos) {
      case 1: return '#EAB308'; // Gold
      case 2: return '#9CA3AF'; // Silver
      case 3: return '#B45309'; // Bronze
      default: return '#6B7280'; // Default
    }
  };

  const getPositionText = (pos: number) => {
    switch (pos) {
      case 1: return '1st';
      case 2: return '2nd';
      case 3: return '3rd';
      default: return `${pos}th`;
    }
  };

  return (
    <View style={[
      styles.container,
    ]}>
      {/* Header section with user name and position */}
      <View style={[styles.header, { backgroundColor: `${theme.brand.background}10` }]}>
        <View style={styles.headerContent}>
          <View style={styles.titleContainer}>
            {position && position <= 3 && (
              <Trophy 
                size={20} 
                color={getPositionColor(position)} 
              />
            )}
            <ThemedText style={styles.title}>
              {position ? `${getPositionText(position)} ${title}` : title}
            </ThemedText>
          </View>
          {completionPercentage !== undefined && (
            <View style={[
              styles.completionBadge,
              { backgroundColor: `${theme.brand.background}20` }
            ]}>
              <ThemedText style={styles.completionText}>
              {completionPercentage.toFixed(0)}% done
              </ThemedText>
            </View>
          )}
        </View>
      </View>

      {/* Task lists section */}
      <View style={[styles.contentContainer]}>
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Circle size={16} color="#EAB308" />
            <ThemedText style={styles.sectionTitle}>To Do</ThemedText>
          </View>
          <View style={styles.taskList}>
            {activeTasks.length > 0 ? (
              activeTasks.map((task) => (
                <View
                  key={task.id}
                  style={[
                    styles.taskItem,
                    { backgroundColor: theme.background.todo_task }
                  ]}
                >
                  <TaskItem
                    task={task}
                    onToggle={isColumnOwner ? onToggleTask : undefined}
                    onDelete={isColumnOwner ? onDeleteTask : undefined}
                    onEdit={isColumnOwner ? onEditTask : undefined}
                    isToggling={togglingTaskId === task.id}
                    isColumnOwner={isColumnOwner}
                  />
                </View>
              ))
            ) : (
              <View style={[
                styles.emptyState,
                { backgroundColor: theme.background.primary }
              ]}>
                <ThemedText style={[styles.emptyStateText, { color: theme.typography.secondary }]}>
                No tasks
                </ThemedText>
              </View>
            )}
          </View>
        </View>

        <View style={[styles.section, { borderTopColor: theme.border }]}>
          <View style={styles.sectionHeader}>
            <CheckCircle size={16} color="#22C55E" />
            <ThemedText style={styles.sectionTitle}>Done</ThemedText>
          </View>
          <View style={styles.taskList}>
            {completedTasks.length > 0 ? (
              completedTasks.map((task) => (
                <View
                  key={task.id}
                  style={[
                    styles.taskItem,
                    { backgroundColor: theme.background.done_task }
                  ]}
                >
                  <TaskItem
                    task={task}
                    onToggle={isColumnOwner ? onToggleTask : undefined}
                    onDelete={isColumnOwner ? onDeleteTask : undefined}
                    onEdit={isColumnOwner ? onEditTask : undefined}
                    isToggling={togglingTaskId === task.id}
                    isColumnOwner={isColumnOwner}
                  />
                </View>
              ))
            ) : (
              <View style={[
                styles.emptyState,
                { backgroundColor: theme.background.primary }
              ]}>
                <ThemedText style={[styles.emptyStateText, { color: theme.typography.secondary }]}>
                No tasks done
                </ThemedText>
              </View>
            )}
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    overflow: 'hidden',
  },
  header: {
    padding: 16,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  title: {
    fontSize: 20,
    fontWeight: '600',
  },
  completionBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  completionText: {
    fontSize: 14,
    fontWeight: '500',
  },
  contentContainer: {
    paddingVertical: 16,
    gap: 16,
  },
  section: {
    gap: 12,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
  },
  taskList: {
    gap: 4,
  },
  taskItem: {
    borderRadius: 8,
    overflow: 'hidden',
  },
  emptyState: {
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  emptyStateText: {
    fontSize: 14,
    fontStyle: 'italic',
  },
}); 