import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { Logo } from '@/components/common/Logo';
import { darkTheme, lightTheme } from '@/constants/Colors';
import { useTheme } from '@/contexts/ThemeContext';
import { useSafeScrollView } from '@/hooks/useSafeScrollView';
import { Slot, useRouter } from 'expo-router';
import React from 'react';
import { SafeAreaView, StyleSheet, TouchableOpacity, View } from 'react-native';

export default function AuthLayout() {
  const router = useRouter();
  const { resolvedTheme } = useTheme();
  const theme = resolvedTheme === 'dark' ? darkTheme : lightTheme;
  const { insets } = useSafeScrollView();

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <ThemedView style={styles.container}>
        {/* Header */}
        <View style={[
          styles.header,
          { 
            backgroundColor: theme.background.secondary,
            borderBottomColor: theme.border,
            paddingTop: insets.top,
          }
        ]}>
          <View style={styles.headerContent}>
            <Logo size="sm" />
            <View style={styles.nav}>
              <TouchableOpacity
                onPress={() => router.push('/(auth)/login')}
                style={styles.navItem}
                activeOpacity={0.7}
              >
                <ThemedText style={[
                  styles.navText,
                  { color: theme.typography.secondary }
                ]}>
                  Login
                </ThemedText>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => router.push('/(auth)/register')}
                style={styles.navItem}
                activeOpacity={0.7}
              >
                <ThemedText style={[
                  styles.navText,
                  { color: theme.typography.secondary }
                ]}>
                  Register
                </ThemedText>
              </TouchableOpacity>
            </View>
          </View>
        </View>

        {/* Main Content */}
        <View style={[styles.main, { paddingBottom: insets.bottom + 16 }]}>
          <Slot />
        </View>
      </ThemedView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    borderBottomWidth: 1,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  nav: {
    flexDirection: 'row',
    gap: 16,
  },
  navItem: {
    paddingVertical: 4,
    paddingHorizontal: 8,
  },
  navText: {
    fontSize: 16,
    fontWeight: '500',
  },
  main: {
    flex: 1,
    padding: 16,
  },
}); 