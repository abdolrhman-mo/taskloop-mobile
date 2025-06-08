/**
 * Learn more about light and dark modes:
 * https://docs.expo.dev/guides/color-schemes/
 */

import { darkTheme, lightTheme, type Theme } from '@/constants/Colors';
import { useTheme } from '@/contexts/ThemeContext';

type ThemeColorKey = keyof Theme | 'brand.background' | 'brand.text' | 'typography.primary' | 'typography.secondary' | 'background.primary' | 'background.secondary' | 'background.tertiary' | 'background.fourth' | 'background.todo_task' | 'background.done_task' | 'error.DEFAULT' | 'error.text';

export function useThemeColor(
  props: { light?: string; dark?: string },
  colorName: ThemeColorKey
) {
  const { resolvedTheme } = useTheme();
  const colorFromProps = props[resolvedTheme];
  const theme = resolvedTheme === 'dark' ? darkTheme : lightTheme;

  if (colorFromProps) {
    return colorFromProps;
  }

  // Handle nested properties
  const parts = colorName.split('.');
  let value: any = theme;
  for (const part of parts) {
    value = value[part];
  }
  return value;
}
