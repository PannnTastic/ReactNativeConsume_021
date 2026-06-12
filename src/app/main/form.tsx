import { useLocalSearchParams, useRouter } from 'expo-router';
import { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  StatusBar,
  ScrollView,
  TextInput,
  Pressable,
  ActivityIndicator,
} from 'react-native';

export default function HewanFormScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id?: string }>();
  const isEdit = !!id;

  const [nama, setNama] = useState('');
  const [jenis, setJenis] = useState('');
  const [harga, setHarga] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#0f172a" />

      <View style={styles.header}>
        <Pressable
          style={({ pressed }) => [
            styles.backButton,
            pressed && styles.backButtonPressed,
          ]}
          onPress={() => router.back()}
        >
          <Text style={styles.backButtonText}>← Kembali</Text>
        </Pressable>
        <Text style={styles.headerTitle}>
          {isEdit ? 'Edit Data Hewan' : 'Tambah Data Hewan'}
        </Text>
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.formContent}
        keyboardShouldPersistTaps="handled"
      >
        {error && (
          <View style={styles.errorBox}>
            <Text style={styles.errorText}>{error}</Text>
          </View>
        )}

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Nama Hewan</Text>
          <TextInput
            style={styles.input}
            placeholder="Masukkan nama hewan"
            placeholderTextColor="#64748b"
            value={nama}
            onChangeText={setNama}
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Jenis</Text>
          <TextInput
            style={styles.input}
            placeholder="Masukkan jenis hewan"
            placeholderTextColor="#64748b"
            value={jenis}
            onChangeText={setJenis}
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Harga (Rp)</Text>
          <TextInput
            style={styles.input}
            placeholder="Masukkan harga"
            placeholderTextColor="#64748b"
            value={harga}
            onChangeText={setHarga}
            keyboardType="numeric"
          />
        </View>

        <Pressable
          style={({ pressed }) => [
            styles.submitBtn,
            pressed && styles.submitBtnPressed,
            loading && styles.submitBtnDisabled,
          ]}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.submitBtnText}>
              {isEdit ? 'Update Data' : 'Simpan Data'}
            </Text>
          )}
        </Pressable>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0f172a',
  },
  header: {
    paddingHorizontal: 24,
    paddingTop: 12,
    paddingBottom: 16,
    gap: 8,
  },
  backButton: {
    alignSelf: 'flex-start',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 10,
    backgroundColor: '#1e293b',
  },
  backButtonPressed: {
    backgroundColor: '#334155',
  },
  backButtonText: {
    color: '#60a5fa',
    fontSize: 15,
    fontWeight: '600',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#f8fafc',
  },
  scrollView: {
    flex: 1,
  },
  formContent: {
    padding: 24,
    gap: 16,
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
    backgroundColor: '#1e293b',
    borderRadius: 12,
    padding: 14,
    fontSize: 16,
    color: '#f8fafc',
    borderWidth: 1,
    borderColor: '#334155',
  },
  submitBtn: {
    backgroundColor: '#2563eb',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 8,
  },
  submitBtnPressed: {
    backgroundColor: '#1d4ed8',
  },
  submitBtnDisabled: {
    opacity: 0.7,
  },
  submitBtnText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
