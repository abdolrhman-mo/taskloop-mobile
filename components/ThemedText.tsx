import { Text, type TextProps } from 'react-native';

import { useThemeColor } from '@/hooks/useThemeColor';

export type ThemedTextProps = TextProps & {
  lightColor?: string;
  darkColor?: string;
  type?: 'default' | 'title' | 'defaultSemiBold' | 'subtitle' | 'link';
  className?: string;
};

export function ThemedText({
  style,
  lightColor,
  darkColor,
  type = 'default',
  className = '',
  ...rest
}: ThemedTextProps) {
  const color = useThemeColor(
    { light: lightColor, dark: darkColor },
    type === 'link' ? 'brand.background' : 'typography.primary'
  );

  const getTypeClassName = () => {
    switch (type) {
      case 'title':
        return 'text-3xl font-bold leading-8';
      case 'defaultSemiBold':
        return 'text-base leading-6 font-semibold';
      case 'subtitle':
        return 'text-xl font-bold';
      case 'link':
        return 'text-base leading-8';
      case 'default':
      default:
        return 'text-base leading-6';
    }
  };

  return (
    <Text
      style={[{ color }, style]}
      className={`${getTypeClassName()} ${className}`}
      {...rest}
    />
  );
}


