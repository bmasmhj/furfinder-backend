import { StyleSheet, Text, View } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useTheme } from '@/hooks/useTheme';

interface EmptyStateProps {
  icon: string;
  title: string;
  subtitle: string;
}

export default function EmptyState({ icon, title, subtitle }: EmptyStateProps) {
  const Colors = useTheme();
  const styles = getStyles(Colors);
  return (
    <View style={styles.container}>
      <MaterialCommunityIcons name={icon as any} size={56} color={Colors.textLight} />
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.subtitle}>{subtitle}</Text>
    </View>
  );
}

const getStyles = (Colors: any) => StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 40,
    gap: 12,
  },
  title: {
    fontSize: 18,
    fontFamily: 'Poppins_600SemiBold',
    color: Colors.text,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 14,
    fontFamily: 'Poppins_400Regular',
    color: Colors.textSecondary,
    textAlign: 'center',
    lineHeight: 20,
  },
});
