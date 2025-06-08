import { BaseCTA } from '@/components/common/BaseCTA';
import { ThemedText } from '@/components/ThemedText';
import { darkTheme, lightTheme } from '@/constants/Colors';
import { useTheme } from '@/contexts/ThemeContext';
import { useRouter } from 'expo-router';
import { ArrowRight, BookOpen, Eye, Target, Users } from 'lucide-react-native';
import React from 'react';
import { StyleSheet, TouchableOpacity } from 'react-native';

export function CreateRoomCTA() {
  const { resolvedTheme } = useTheme();
  const theme = resolvedTheme === 'dark' ? darkTheme : lightTheme;
  const router = useRouter();

  const features = [
    {
      icon: Eye,
      title: 'Live Task Updates',
      description: 'See what your friends have finished in real-time'
    },
    {
      icon: Target,
      title: 'Stay Accountable',
      description: 'Keep focused knowing your friends are watching'
    },
    {
      icon: Users,
      title: 'Group Motivation',
      description: 'Get inspired by your friends\' accomplishments'
    }
  ];

  const handleCreatePress = () => {
    // TODO: Update this when session create route is created
    router.push('/(tabs)');
  };

  const actionButton = (
    <TouchableOpacity
      onPress={handleCreatePress}
      style={[styles.button, { backgroundColor: theme.brand.background }]}
      activeOpacity={0.9}
    >
      <ThemedText style={[styles.buttonText, { color: theme.brand.text }]}>
        Start Study Room
      </ThemedText>
      <ArrowRight size={20} color={theme.brand.text} />
    </TouchableOpacity>
  );

  return (
    <BaseCTA
      icon={BookOpen}
      title="Start Your Study Journey"
      description="Create your first study room and begin studying with friends!"
      features={features}
      actionButton={actionButton}
    />
  );
}

const styles = StyleSheet.create({
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 8,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: '500',
  },
}); 