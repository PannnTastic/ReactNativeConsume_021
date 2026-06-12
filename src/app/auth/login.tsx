import { useRouter } from 'expo-router';
import { useState } from 'react';
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { AuthRepoImpl } from '@/data/repositories/authRepoImpl';
import * as SecureStore from 'expo-secure-store';

const authRepo = new AuthRepoImpl();

export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handleLogin = async () => {
    if (!email || !password) {
      setError('Email dan password harus diisi');
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const result = await authRepo.login(email, password);
      await SecureStore.setItemAsync('user_token', result.token);
      router.replace('/main');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Login gagal');
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <View style={styles.card}>
        <Text style={styles.title}>🐄 Ternak App</Text>
        <Text style={styles.subtitle}>Masuk ke akun Anda</Text>

        {error && (
          <View style={styles.errorBox}>
            <Text style={styles.errorText}>{error}</Text>
          </View>
        )}

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Email</Text>
          <TextInput
            style={styles.input}
            placeholder="Masukkan email"
            placeholderTextColor="#999"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Password</Text>
          <TextInput
            style={styles.input}
            placeholder="Masukkan password"
            placeholderTextColor="#999"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
          />
        </View>

        <Pressable
          style={({ pressed }) => [
            styles.button,
            pressed && styles.buttonPressed,
            loading && styles.buttonDisabled,
          ]}
          onPress={handleLogin}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.buttonText}>Masuk</Text>
          )}
        </Pressable>

        <Pressable onPress={() => router.push('/auth/register')}>
          <Text style={styles.linkText}>
            Belum punya akun? <Text style={styles.linkBold}>Daftar</Text>
          </Text>
        </Pressable>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0f172a',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  card: {
    width: '100%',
    maxWidth: 400,
    backgroundColor: '#1e293b',
    borderRadius: 20,
    padding: 32,
    gap: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 12,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#f8fafc',
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: '#94a3b8',
    textAlign: 'center',
    marginBottom: 8,
  },
  errorBox: {
    backgroundColor: '#7f1d1d',
    padding: 12,
    borderRadius: 10,
  },
  errorText: {
    color: '#fca5a5',
    fontSize: 14,
    textAlign: 'center',
  },
  inputGroup: {
    gap: 6,
  },
  label: {
    color: '#cbd5e1',
    fontSize: 14,
    fontWeight: '600',
  },
  input: {
    backgroundColor: '#334155',
    borderRadius: 12,
    padding: 14,
    fontSize: 16,
    color: '#f8fafc',
    borderWidth: 1,
    borderColor: '#475569',
  },
  button: {
    backgroundColor: '#2563eb',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 8,
  },
  buttonPressed: {
    backgroundColor: '#1d4ed8',
  },
  buttonDisabled: {
    opacity: 0.7,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  linkText: {
    color: '#94a3b8',
    textAlign: 'center',
    fontSize: 14,
    marginTop: 4,
  },
  linkBold: {
    color: '#60a5fa',
    fontWeight: 'bold',
  },
});
