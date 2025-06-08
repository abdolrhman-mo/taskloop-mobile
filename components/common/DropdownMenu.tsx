import { darkTheme, lightTheme } from '@/constants/Colors';
import { useTheme } from '@/contexts/ThemeContext';
import { AlertCircle } from 'lucide-react-native';
import { useEffect, useRef, useState } from 'react';
import { ActivityIndicator, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import * as Animatable from 'react-native-animatable';

interface MenuItem {
  label: string;
  icon?: React.ReactNode;
  onPress: () => void;
  isDestructive?: boolean;
  isLoading?: boolean;
  error?: string | null;
}

interface DropdownMenuProps {
  items: MenuItem[];
  isOpen: boolean;
  style?: any;
}

export function DropdownMenu({ items, isOpen, style }: DropdownMenuProps) {
  const { resolvedTheme } = useTheme();
  const theme = resolvedTheme === 'dark' ? darkTheme : lightTheme;

  const [visible, setVisible] = useState(isOpen);
  const viewRef = useRef<Animatable.View & View>(null);


  useEffect(() => {
    if (isOpen) {
      setVisible(true); // Show immediately
    } else if (viewRef.current && typeof viewRef.current.fadeOut === 'function') {
      viewRef.current.fadeOut(250).then(() => {
        setVisible(false); // Hide after animation ends
      });
    } else {
      // fallback if fadeOut is not available
      setVisible(false);
    }
  }, [isOpen]);

  if (!visible) return null;

  return (
    <Animatable.View 
      ref={viewRef}
      animation="fadeIn"
      duration={250}
      easing="ease-in-out"
      style={[
        styles.container,
        { 
          backgroundColor: theme.background.secondary,
          borderColor: theme.border,
          shadowColor: theme.border,
        },
        style
      ]}
    >
      <View style={styles.menu}>
        {items.map((item, index) => (
          <TouchableOpacity
            key={index}
            onPress={item.onPress}
            disabled={item.isLoading}
            style={[
              styles.menuItem,
              item.isLoading && { 
                backgroundColor: `${item.isDestructive ? theme.error.DEFAULT : theme.brand.background}10` 
              }
            ]}
          >
            {item.isLoading ? (
              <View style={styles.menuItemContent}>
                <ActivityIndicator 
                  size="small" 
                  color={item.isDestructive ? theme.error.DEFAULT : theme.brand.background} 
                />
                <Text style={[styles.menuItemText, { color: item.isDestructive ? theme.error.DEFAULT : theme.typography.primary }]}>
                  {item.label}...
                </Text>
              </View>
            ) : item.error ? (
              <View style={styles.menuItemContent}>
                <AlertCircle 
                  size={16} 
                  color={theme.error.DEFAULT} 
                  style={styles.icon}
                />
                <Text style={[styles.menuItemText, { color: theme.error.DEFAULT }]}>
                  {item.error}
                </Text>
              </View>
            ) : (
              <View style={styles.menuItemContent}>
                {item.icon}
                <Text 
                  style={[
                    styles.menuItemText,
                    { color: item.isDestructive ? theme.error.DEFAULT : theme.typography.primary }
                  ]}
                >
                  {item.label}
                </Text>
              </View>
            )}
          </TouchableOpacity>
        ))}
      </View>
    </Animatable.View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    right: 0,
    top: '70%',
    // marginTop: 4,
    width: 192, // 48 * 4
    borderRadius: 8,
    borderWidth: 1,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 4,
    overflow: 'hidden',
  },
  menu: {
    paddingVertical: 4,
  },
  menuItem: {
    paddingVertical: 8,
    paddingHorizontal: 16,
  },
  menuItemContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  menuItemText: {
    fontSize: 14,
  },
  icon: {
    marginTop: 1,
  },
}); 