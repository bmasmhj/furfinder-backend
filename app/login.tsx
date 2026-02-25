import { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  Pressable,
  Platform,
  ActivityIndicator,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { router, Redirect } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import Colors from '@/constants/colors';
import { useAuth } from '@/lib/auth-context';

export default function LoginScreen() {
  const insets = useSafeAreaInsets();
  const { login, isAuthenticated } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const webTopPadding = Platform.OS === 'web' ? 67 : 0;
  const webBottomPadding = Platform.OS === 'web' ? 34 : 0;

  const canSubmit = email.trim().length > 0 && password.length >= 6;

  if (isAuthenticated) {
    return <Redirect href="/(tabs)" />;
  }

  const handleLogin = async () => {
    if (!canSubmit || isSubmitting) return;
    setError('');
    setIsSubmitting(true);
    try {
      await login(email.trim(), password);
      router.replace('/(tabs)');
    } catch (e: any) {
      setError(e.message || 'Login failed');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top + webTopPadding }]}>
      <View style={styles.content}>
        <View style={styles.iconContainer}>
          <Ionicons name="paw" size={48} color={Colors.primary} />
        </View>

        <Text style={styles.title}>Welcome Back</Text>
        <Text style={styles.subtitle}>
          Sign in to access your pet reports and profiles
        </Text>

        {error ? (
          <View style={styles.errorCard}>
            <Ionicons name="alert-circle" size={18} color={Colors.danger} />
            <Text style={styles.errorText}>{error}</Text>
          </View>
        ) : null}

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Email</Text>
          <View style={styles.inputWrapper}>
            <Ionicons name="mail-outline" size={18} color={Colors.textLight} style={styles.inputIcon} />
            <TextInput
              style={styles.input}
              value={email}
              onChangeText={setEmail}
              placeholder="your@email.com"
              placeholderTextColor={Colors.textLight}
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
              testID="login-email"
            />
          </View>
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Password</Text>
          <View style={styles.inputWrapper}>
            <Ionicons name="lock-closed-outline" size={18} color={Colors.textLight} style={styles.inputIcon} />
            <TextInput
              style={[styles.input, { flex: 1 }]}
              value={password}
              onChangeText={setPassword}
              placeholder="Min. 6 characters"
              placeholderTextColor={Colors.textLight}
              secureTextEntry={!showPassword}
              testID="login-password"
            />
            <Pressable onPress={() => setShowPassword(!showPassword)} style={styles.eyeBtn}>
              <Ionicons name={showPassword ? 'eye-off-outline' : 'eye-outline'} size={20} color={Colors.textLight} />
            </Pressable>
          </View>
        </View>

        <Pressable
          style={[styles.loginBtn, !canSubmit && styles.loginBtnDisabled]}
          onPress={handleLogin}
          disabled={!canSubmit || isSubmitting}
          testID="login-submit"
        >
          {isSubmitting ? (
            <ActivityIndicator color="#fff" size="small" />
          ) : (
            <Text style={[styles.loginBtnText, !canSubmit && styles.loginBtnTextDisabled]}>
              Sign In
            </Text>
          )}
        </Pressable>

        <View style={styles.divider}>
          <View style={styles.dividerLine} />
          <Text style={styles.dividerText}>or</Text>
          <View style={styles.dividerLine} />
        </View>

        <Pressable
          style={styles.registerBtn}
          onPress={() => router.push('/register')}
          testID="goto-register"
        >
          <Text style={styles.registerBtnText}>Create an Account</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  content: {
    flex: 1,
    padding: 24,
    justifyContent: 'center',
  },
  iconContainer: {
    width: 80,
    height: 80,
    borderRadius: 24,
    backgroundColor: '#FFF0ED',
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
    marginBottom: 20,
  },
  title: {
    fontSize: 28,
    fontFamily: 'Poppins_700Bold',
    color: Colors.text,
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    fontFamily: 'Poppins_400Regular',
    color: Colors.textSecondary,
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 32,
  },
  errorCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#FEF2F2',
    borderRadius: 12,
    padding: 12,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#FECACA',
  },
  errorText: {
    flex: 1,
    fontSize: 13,
    fontFamily: 'Poppins_400Regular',
    color: Colors.danger,
    lineHeight: 18,
  },
  inputGroup: {
    marginBottom: 18,
  },
  label: {
    fontSize: 13,
    fontFamily: 'Poppins_600SemiBold',
    color: Colors.text,
    marginBottom: 6,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surface,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.border,
    paddingHorizontal: 14,
  },
  inputIcon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    height: 48,
    fontSize: 15,
    fontFamily: 'Poppins_400Regular',
    color: Colors.text,
  },
  eyeBtn: {
    padding: 6,
  },
  loginBtn: {
    backgroundColor: Colors.primary,
    borderRadius: 14,
    paddingVertical: 16,
    alignItems: 'center',
    marginTop: 8,
  },
  loginBtnDisabled: {
    backgroundColor: Colors.borderLight,
  },
  loginBtnText: {
    fontSize: 16,
    fontFamily: 'Poppins_600SemiBold',
    color: '#fff',
  },
  loginBtnTextDisabled: {
    color: Colors.textLight,
  },
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 24,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: Colors.border,
  },
  dividerText: {
    fontSize: 13,
    fontFamily: 'Poppins_400Regular',
    color: Colors.textLight,
    marginHorizontal: 16,
  },
  registerBtn: {
    borderWidth: 2,
    borderColor: Colors.secondary,
    borderRadius: 14,
    paddingVertical: 14,
    alignItems: 'center',
  },
  registerBtnText: {
    fontSize: 15,
    fontFamily: 'Poppins_600SemiBold',
    color: Colors.secondary,
  },
});
