import { darkTheme, lightTheme } from '@/constants/Colors';
import { useTheme } from '@/contexts/ThemeContext';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

interface Feature {
  icon: React.ComponentType<{ size?: number; color?: string; style?: any }>;
  title: string;
  description: string;
}

interface BaseCTAProps {
  icon: React.ComponentType<{ size?: number; color?: string; style?: any }>;
  title: string;
  description: string;
  features?: Feature[];
  actionButton: React.ReactNode;
  style?: any;
}

export function BaseCTA({ 
  icon: Icon,
  title,
  description,
  features,
  actionButton,
  style
}: BaseCTAProps) {
  const { resolvedTheme } = useTheme();
  const theme = resolvedTheme === 'dark' ? darkTheme : lightTheme;

  return (
    <View 
      style={[
        styles.container,
        { 
          backgroundColor: `${theme.brand.background}10`,
          borderColor: theme.border,
        },
        style
      ]}
    >
      <View style={styles.iconContainer}>
        <View style={[styles.iconWrapper, { backgroundColor: `${theme.brand.background}20` }]}>
          <Icon size={32} color={theme.brand.background} />
        </View>
      </View>

      <Text style={[styles.title, { color: theme.typography.primary }]}>
        {title}
      </Text>

      <View style={styles.content}>
        <Text style={[styles.description, { color: theme.typography.secondary }]}>
          {description}
        </Text>

        {features && (
          <View style={styles.featuresGrid}>
            {features.map((feature, index) => (
              <View 
                key={index}
                style={[
                  styles.featureCard,
                  { backgroundColor: `${theme.brand.background}15` }
                ]}
              >
                <feature.icon 
                  size={24} 
                  color={theme.brand.background}
                  style={styles.featureIcon}
                />
                <Text style={[styles.featureTitle, { color: theme.typography.primary }]}>
                  {feature.title}
                </Text>
                <Text style={[styles.featureDescription, { color: theme.typography.secondary }]}>
                  {feature.description}
                </Text>
              </View>
            ))}
          </View>
        )}
      </View>

      {actionButton}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 32,
    borderRadius: 8,
    borderWidth: 1,
    maxWidth: 800,
    alignSelf: 'center',
    width: '100%',
  },
  iconContainer: {
    alignItems: 'center',
    marginBottom: 16,
  },
  iconWrapper: {
    padding: 12,
    borderRadius: 9999,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 12,
  },
  content: {
    gap: 16,
    marginBottom: 32,
  },
  description: {
    fontSize: 16,
    textAlign: 'center',
  },
  featuresGrid: {
    marginTop: 24,
    gap: 16,
  },
  featureCard: {
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  featureIcon: {
    marginBottom: 8,
  },
  featureTitle: {
    fontSize: 14,
    fontWeight: '500',
    textAlign: 'center',
  },
  featureDescription: {
    fontSize: 12,
    marginTop: 4,
    textAlign: 'center',
  },
}); 