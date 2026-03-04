import { useColorScheme } from 'react-native';
import Colors from '@/constants/colors';
import DarkColors from '@/constants/dark-colors';

export function useTheme() {
  const scheme = useColorScheme();
  return scheme === 'dark' ? DarkColors : Colors;
}
