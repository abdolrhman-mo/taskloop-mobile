import { StyleSheet, Switch, View } from 'react-native';

import { useTheme } from '@/contexts/ThemeContext';

export function ThemeSwitch() {
  const { theme, setTheme, resolvedTheme } = useTheme();

  const toggleTheme = () => {
    setTheme(resolvedTheme === 'light' ? 'dark' : 'light');
  };

  return (
    <View style={styles.container}>
      <Switch
        value={resolvedTheme === 'dark'}
        onValueChange={toggleTheme}
        style={styles.switch}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  switch: {
    transform: [{ scale: 0.8 }], // Make the switch slightly smaller
  },
}); 