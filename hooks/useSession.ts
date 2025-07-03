import { ENDPOINTS } from '@/config/endpoints';
import { useApi } from '@/hooks/useApi';
import { Participant, ParticipantWithStats, Session, Task, User } from '@/types/session';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect, useState } from 'react';

interface UseSessionReturn {
  session: Session | null;
  tasks: Task[];
  user: User | null;
  loading: boolean;
  error: string | null;
  isParticipant: boolean;
  currentParticipant: Participant | null;
  taskState: {
    addingTask: boolean;
    togglingTaskId: number | null;
    error: string | null;
    isAddingTask: boolean;
  };
  handleAddTask: (text: string) => Promise<void>;
  handleToggleTask: (task: Task) => Promise<void>;
  handleDeleteTask: (taskId: number) => Promise<void>;
  handleEditTask: (taskId: number, newText: string) => Promise<void>;
  handleLeaveSession: () => Promise<void>;
  handleDeleteSession: () => Promise<void>;
  getSortedTasks: (tasks: Task[]) => Task[];
  getSortedParticipants: (participants: Session['participants']) => ParticipantWithStats[];
  loadingTasks: boolean;
}

export function useSession(): UseSessionReturn {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { get, post, put, delete: deleteRequest } = useApi();

  // State management
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loadingTasks, setLoadingTasks] = useState(true);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [userLoading, setUserLoading] = useState(true);
  const [session, setSession] = useState<Session | null>(null);
  const [taskState, setTaskState] = useState({
    addingTask: false,
    togglingTaskId: null as number | null,
    error: null as string | null,
    isAddingTask: false
  });

  // Session participant checks
  const isParticipant = Boolean(user && session && session.participants.some(p => p.id === user.id));
  const currentParticipant = user && session ? session.participants.find(p => p.id === user.id) ?? null : null;

  // Fetch current user data
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        setUserLoading(true);
        const userData = await get<User>(ENDPOINTS.AUTH.ME.path);
        setUser(userData);
      } catch (err) {
        console.error('Failed to fetch user data:', err);
      } finally {
        setUserLoading(false);
      }
    };

    fetchUserData();
  }, [get]);

  // Fetch session data
  useEffect(() => {
    const fetchSession = async (isInitialLoad: boolean = false) => {
      try {
        if (isInitialLoad) {
          setLoading(true);
        }
        const sessionResponse = await get<Session>(ENDPOINTS.SESSIONS.READ.path(id));
        setSession(sessionResponse);
      } catch (err) {
        console.error(err);
        setError('Failed to load session');
      } finally {
        if (isInitialLoad) {
          setLoading(false);
        }
      }
    };

    if (id) {
      fetchSession(true);
      const intervalId = setInterval(() => fetchSession(false), 5000);
      return () => clearInterval(intervalId);
    }
  }, [get, id]);

  // Periodic task updates
  useEffect(() => {
    const fetchTasks = async () => {
      setLoadingTasks(true);
      try {
        const tasksResponse = await get<Task[]>(ENDPOINTS.SESSIONS.TASKS.LIST.path(id));
        setTasks(tasksResponse);
      } catch (err) {
        console.error('Failed to fetch tasks', err);
      } finally {
        setLoadingTasks(false);
      }
    };

    if (id) {
      fetchTasks();
      const intervalId = setInterval(fetchTasks, 5000);
      return () => clearInterval(intervalId);
    }
  }, [get, id]);

  // Task management handlers
  const handleAddTask = async (text: string) => {
    if (!session || !currentParticipant) return;

    setTaskState(prev => ({ ...prev, addingTask: true, error: null }));

    try {
      const createdTask = await post<Task>(
        ENDPOINTS.SESSIONS.TASKS.ADD.path(session.uuid),
        { text, user_id: currentParticipant.id }
      );
      setTasks(prevTasks => [...prevTasks, createdTask]);
    } catch (err) {
      console.error('Failed to add task', err);
      setTaskState(prev => ({
        ...prev,
        error: 'Failed to add task. Please try again.'
      }));
    } finally {
      setTaskState(prev => ({ ...prev, addingTask: false }));
    }
  };

  const handleToggleTask = async (task: Task) => {
    setTaskState(prev => ({ ...prev, togglingTaskId: task.id, error: null }));

    try {
      const updatedTask = await put<Task>(
        ENDPOINTS.SESSIONS.TASKS.UPDATE.path(id, task.id.toString()),
        { ...task, is_done: !task.is_done }
      );
      setTasks(prevTasks => prevTasks.map(t =>
        t.id === task.id ? updatedTask : t
      ));
    } catch (err) {
      console.error('Failed to update task status', err);
      setTaskState(prev => ({
        ...prev,
        error: 'Failed to update task status. Please try again.'
      }));
    } finally {
      setTaskState(prev => ({ ...prev, togglingTaskId: null }));
    }
  };

  const handleDeleteTask = async (taskId: number) => {
    try {
      await deleteRequest(ENDPOINTS.SESSIONS.TASKS.DELETE.path(id, taskId.toString()));
      setTasks(prevTasks => prevTasks.filter(t => t.id !== taskId));
    } catch (err) {
      console.error('Failed to delete task', err);
    }
  };

  const handleEditTask = async (taskId: number, newText: string) => {
    try {
      const updatedTask = await put<Task>(
        ENDPOINTS.SESSIONS.TASKS.UPDATE.path(id, taskId.toString()),
        { text: newText }
      );
      setTasks(prevTasks => prevTasks.map(t =>
        t.id === taskId ? updatedTask : t
      ));
    } catch (err) {
      console.error('Failed to update task', err);
      setTaskState(prev => ({
        ...prev,
        error: 'Failed to update task. Please try again.'
      }));
    }
  };

  const handleLeaveSession = async () => {
    if (!session) return;

    try {
      await post(ENDPOINTS.SESSIONS.LEAVE.path(session.uuid));
      router.replace('/');
    } catch (err) {
      console.error('Failed to leave study room:', err);
      setError('Failed to leave study room. Please try again.');
    }
  };

  const handleDeleteSession = async () => {
    if (!session) return;

    try {
      await deleteRequest(ENDPOINTS.SESSIONS.MANAGE.DELETE.path(session.uuid));
      router.replace('/');
    } catch (err) {
      console.error('Failed to delete study room:', err);
      setError('Failed to delete study room. Please try again.');
    }
  };

  // Helper functions
  const getSortedTasks = (tasks: Task[]) => {
    return [...tasks].sort((a, b) => {
      const timeA = new Date(a.created_at).getTime();
      const timeB = new Date(b.created_at).getTime();
      return timeB - timeA; // Default to newest first
    });
  };

  const getSortedParticipants = (participants: Session['participants']): ParticipantWithStats[] => {
    const stats = participants.map(participant => {
      const participantTasks = tasks.filter(task => task.user === participant.id);
      const totalTasks = participantTasks.length;
      const completedTasks = participantTasks.filter(task => task.is_done).length;
      const completionPercentage = totalTasks > 0
        ? (completedTasks / totalTasks) * 100
        : 0;

      return {
        id: participant.id,
        username: participant.username,
        totalTasks,
        completedTasks,
        completionPercentage,
        position: 0 // Will be set after sorting
      };
    });

    return stats
      .sort((a, b) => b.completionPercentage - a.completionPercentage)
      .map((stats, index) => ({
        ...stats,
        position: index + 1
      }));
  };

  return {
    session,
    tasks,
    user,
    loading: loading || userLoading,
    loadingTasks,
    error,
    isParticipant,
    currentParticipant,
    taskState,
    handleAddTask,
    handleToggleTask,
    handleDeleteTask,
    handleEditTask,
    handleLeaveSession,
    handleDeleteSession,
    getSortedTasks,
    getSortedParticipants,
  };
} 