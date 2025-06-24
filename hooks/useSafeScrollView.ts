import { useSafeAreaInsets } from 'react-native-safe-area-context';

export function useSafeScrollView() {
  const insets = useSafeAreaInsets();
  
  const scrollViewProps = {
    showsVerticalScrollIndicator: false,
    keyboardShouldPersistTaps: "handled" as const,
    contentContainerStyle: {
      flexGrow: 1,
      paddingBottom: insets.bottom + 20,
    },
  };

  return {
    insets,
    scrollViewProps,
  };
} 