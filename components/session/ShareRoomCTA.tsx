import { BaseCTA } from '@/components/common/BaseCTA';
import { ThemedText } from '@/components/ThemedText';
import { darkTheme, lightTheme } from '@/constants/Colors';
import { useTheme } from '@/contexts/ThemeContext';
import { Check, Copy, Eye, Sparkles, Target, Users } from 'lucide-react-native';
import React, { useState } from 'react';
import { Clipboard, StyleSheet, TouchableOpacity, View } from 'react-native';

interface ShareRoomCTAProps {
  sessionId: string;
}

export function ShareRoomCTA({ sessionId }: ShareRoomCTAProps) {
  const { resolvedTheme } = useTheme();
  const theme = resolvedTheme === 'dark' ? darkTheme : lightTheme;
  const [copyState, setCopyState] = useState({
    isCopied: false,
    error: null as string | null
  });

  const handleCopyLink = async () => {
    try {
      const sessionUrl = `https://taskloop.app/session/${sessionId}`;
      await Clipboard.setString(sessionUrl);
      setCopyState({ isCopied: true, error: null });
      setTimeout(() => setCopyState(prev => ({ ...prev, isCopied: false })), 2000);
    } catch {
      setCopyState({ isCopied: false, error: 'Failed to copy link' });
    }
  };

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
      icon: Sparkles,
      title: 'Group Motivation',
      description: 'Get inspired by your friends\' accomplishments'
    }
  ];

  const actionButton = (
    <View>
      <TouchableOpacity
        onPress={handleCopyLink}
        style={[
          styles.button,
          { backgroundColor: `${theme.brand.background}20` }
        ]}
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
                Copy Room Link
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
  );

  return (
    <BaseCTA
      icon={Users}
      title="Study Together, Achieve More!"
      description="Share this study room with your friends to collaborate on tasks together"
      features={features}
      actionButton={actionButton}
    />
  );
}

const styles = StyleSheet.create({
  button: {
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