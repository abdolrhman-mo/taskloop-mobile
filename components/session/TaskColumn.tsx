import { ThemedText } from '@/components/ThemedText';
import { darkTheme, lightTheme } from '@/constants/Colors';
import { useTheme } from '@/contexts/ThemeContext';
import { Task } from '@/types/session';
import { CheckCircle, Circle } from 'lucide-react-native';
import React from 'react';
import { FlatList, View } from 'react-native';
import { TaskItem } from './TaskItem';

interface TaskColumnProps {
  title: string;
  tasks: Task[];
  isColumnOwner: boolean;
  onToggleTask: (task: Task) => Promise<void>;
  onDeleteTask: (taskId: number) => Promise<void>;
  onEditTask: (taskId: number, newText: string) => Promise<void>;
  togglingTaskId: number | null;
  completionPercentage?: number;
  isTasksLoading?: boolean;
}

interface TaskSectionProps {
  icon: React.ReactNode;
  title: string;
  tasks: Task[];
  emptyText: string;
  taskBg: string;
  emptyBg: string;
  emptyTextColor: string;
  isColumnOwner: boolean;
  onToggleTask: (task: Task) => Promise<void>;
  onDeleteTask: (taskId: number) => Promise<void>;
  onEditTask: (taskId: number, newText: string) => Promise<void>;
  togglingTaskId: number | null;
}

function SkeletonTaskItem() {
  return (
    <View className="rounded-lg bg-gray-200 h-10 mb-2 w-full animate-pulse" />
  );
}

function TaskSection({
  icon,
  title,
  tasks,
  emptyText,
  taskBg,
  emptyBg,
  emptyTextColor,
  isColumnOwner,
  onToggleTask,
  onDeleteTask,
  onEditTask,
  togglingTaskId,
}: TaskSectionProps) {
  // TODO: Add loading skeleton
  const { resolvedTheme } = useTheme();
  const theme = resolvedTheme === 'dark' ? darkTheme : lightTheme;

  return (
    <View className="gap-3 pb-4">
      <View 
        style={{ 
          // borderColor: theme.border,
          backgroundColor: theme.brand.background + '20',
        }}
        className="flex-row items-center justify-between gap-2 px-4 py-2 mx-4 rounded-lg"
      >
        <ThemedText className="text-base font-semibold">{title}</ThemedText>
        <ThemedText 
          style={{ backgroundColor: theme.background.secondary }}
          className="text-base font-semibold px-2 rounded-full"
        >
          {tasks.length}
        </ThemedText>
      </View>
      <View>
        {tasks.length > 0 ? (
          tasks.map((task) => (
            <View
              key={task.id}
              // style={{ backgroundColor: 'lightgray' }}
              className="overflow-hidden"
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
          <View style={{ backgroundColor: emptyBg }} className="p-4 mx-4 rounded-lg">
            <ThemedText style={{ color: emptyTextColor }} className="text-sm italic">
              {emptyText}
            </ThemedText>
          </View>
        )}
      </View>
    </View>
  );
}

export function TaskColumn({
  title,
  tasks,
  isColumnOwner,
  onToggleTask,
  onDeleteTask,
  onEditTask,
  togglingTaskId,
  completionPercentage,
}: TaskColumnProps) {
  const { resolvedTheme } = useTheme();
  const theme = resolvedTheme === 'dark' ? darkTheme : lightTheme;

  const activeTasks = tasks.filter(task => !task.is_done);
  const completedTasks = tasks.filter(task => task.is_done);

  // Section config for scalability
  const sections = [
    {
      key: 'todo',
      icon: <Circle size={16} color="#EAB308" />,
      title: 'Your Tasks',
      tasks: activeTasks,
      emptyText: 'No tasks',
      taskBg: theme.background.todo_task,
      emptyBg: theme.background.primary,
      emptyTextColor: theme.typography.secondary,
    },
    {
      key: 'done',
      icon: <CheckCircle size={16} color="#22C55E" />,
      title: 'Completed',
      tasks: completedTasks,
      emptyText: 'No tasks done',
      taskBg: theme.background.done_task,
      emptyBg: theme.background.primary,
      emptyTextColor: theme.typography.secondary,
    },
  ];

  return (
    // <View className="overflow-hidden">
    <View className='flex-1'>
      {/* Header section with user name */}
      <ThemedText
        style={{ borderBottomColor: theme.border }} 
        className="text-lg font-semibold border-b p-4"
      >
        {title}
      </ThemedText>

      {/* Task lists section */}
      <FlatList
        data={sections}
        className='py-4'
        renderItem={({ item }) => (
          <TaskSection
            key={item.key}
            icon={item.icon}
            title={item.title}
            tasks={item.tasks}
            emptyText={item.emptyText}
            taskBg={item.taskBg}
            emptyBg={item.emptyBg}
            emptyTextColor={item.emptyTextColor}
            isColumnOwner={isColumnOwner}
            onToggleTask={onToggleTask}
            onDeleteTask={onDeleteTask}
            onEditTask={onEditTask}
            togglingTaskId={togglingTaskId}
          />
        )}
      />
    </View>
  );
}