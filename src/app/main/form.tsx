import { useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
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
  Platform,
  Alert,
} from 'react-native';
import DateTimePicker, { DateTimePickerEvent } from '@react-native-community/datetimepicker';
import { HewanRepoImpl } from '@/data/repositories/hewanRepoImpl';

const hewanRepo = new HewanRepoImpl();

export default function HewanFormScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id?: string }>();
  const isEdit = !!id;

  const [nama, setNama] = useState('');
  const [jenis, setJenis] = useState('');
  const [harga, setHarga] = useState('');
  const [tanggalLahir, setTanggalLahir] = useState(new Date());
  const [status, setStatus] = useState<'tersedia' | 'terjual'>('tersedia');
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showStatusDropdown, setShowStatusDropdown] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const onDateChange = (event: DateTimePickerEvent, selectedDate?: Date) => {
    if (Platform.OS === 'android') {
      setShowDatePicker(false);
    }
    if (selectedDate) {
      setTanggalLahir(selectedDate);
    }
  };

  useEffect(() => {
    if (isEdit && id) {
      const loadHewan = async () => {
        setLoading(true);
        try {
          const res = await hewanRepo.getById(Number(id));
          if (res.success && res.data) {
            setNama(res.data.nama);
            setJenis(res.data.jenis);
            setHarga(String(res.data.harga));
            if (res.data.tanggal_lahir) {
              setTanggalLahir(new Date(res.data.tanggal_lahir));
            }
            if (res.data.status) {
              setStatus(res.data.status);
            }
          }
        } catch (err: any) {
          setError('Gagal memuat data hewan');
        } finally {
          setLoading(false);
        }
      };
      loadHewan();
    }
  }, [id]);

  const handleBack = () => {
    if (nama || jenis || harga) {
      Alert.alert(
        'Batal',
        'Apakah Anda yakin ingin kembali? Data yang belum disimpan akan hilang.',
        [
          { text: 'Tetap di sini', style: 'cancel' },
          { text: 'Kembali', style: 'destructive', onPress: () => router.back() },
        ]
      );
    } else {
      router.back();
    }
  };

  const handleSubmit = async () => {
    if (!nama.trim()) {
      setError('Nama hewan harus diisi');
      return;
    }
    if (!jenis.trim()) {
      setError('Jenis hewan harus diisi');
      return;
    }
    if (!harga.trim() || isNaN(Number(harga))) {
      setError('Harga harus berupa angka yang valid');
      return;
    }

    setLoading(true);
    setError(null);

    const payload = {
      nama: nama.trim(),
      jenis: jenis.trim(),
      harga: Number(harga),
      tanggal_lahir: tanggalLahir.toISOString().split('T')[0],
      status,
    };

    try {
      if (isEdit && id) {
        await hewanRepo.update(Number(id), payload);
      } else {
        await hewanRepo.create(payload);
      }
      router.back();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Gagal menyimpan data');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#0f172a" />

      <View style={styles.header}>
        <Pressable
          style={({ pressed }) => [
            styles.backButton,
            pressed && styles.backButtonPressed,
          ]}
          onPress={handleBack}
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

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Tanggal Lahir</Text>
          <Pressable
            style={styles.dateButton}
            onPress={() => setShowDatePicker(true)}
          >
            <Text style={styles.dateButtonText}>
              {tanggalLahir.toLocaleDateString('id-ID', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })}
            </Text>
          </Pressable>
          {showDatePicker && (
            <DateTimePicker
              value={tanggalLahir}
              mode="date"
              display={Platform.OS === 'ios' ? 'spinner' : 'default'}
              onChange={onDateChange}
              maximumDate={new Date()}
            />
          )}
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Status</Text>
          <Pressable
            style={styles.dropdownButton}
            onPress={() => setShowStatusDropdown(!showStatusDropdown)}
          >
            <Text style={styles.dropdownButtonText}>
              {status === 'tersedia' ? '✅ Tersedia' : '❌ Terjual'}
            </Text>
            <Text style={styles.dropdownArrow}>
              {showStatusDropdown ? '▲' : '▼'}
            </Text>
          </Pressable>
          {showStatusDropdown && (
            <View style={styles.dropdownList}>
              <Pressable
                style={[
                  styles.dropdownItem,
                  status === 'tersedia' && styles.dropdownItemSelected,
                ]}
                onPress={() => {
                  setStatus('tersedia');
                  setShowStatusDropdown(false);
                }}
              >
                <Text style={[
                  styles.dropdownItemText,
                  status === 'tersedia' && styles.dropdownItemTextSelected,
                ]}>
                  ✅ Tersedia
                </Text>
              </Pressable>
              <Pressable
                style={[
                  styles.dropdownItem,
                  status === 'terjual' && styles.dropdownItemSelected,
                ]}
                onPress={() => {
                  setStatus('terjual');
                  setShowStatusDropdown(false);
                }}
              >
                <Text style={[
                  styles.dropdownItemText,
                  status === 'terjual' && styles.dropdownItemTextSelected,
                ]}>
                  ❌ Terjual
                </Text>
              </Pressable>
            </View>
          )}
        </View>

        <Pressable
          style={({ pressed }) => [
            styles.submitBtn,
            pressed && styles.submitBtnPressed,
            loading && styles.submitBtnDisabled,
          ]}
          disabled={loading}
          onPress={handleSubmit}
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
  dateButton: {
    backgroundColor: '#1e293b',
    borderRadius: 12,
    padding: 14,
    borderWidth: 1,
    borderColor: '#334155',
  },
  dateButtonText: {
    color: '#f8fafc',
    fontSize: 16,
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
  dropdownButton: {
    backgroundColor: '#1e293b',
    borderRadius: 12,
    padding: 14,
    borderWidth: 1,
    borderColor: '#334155',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  dropdownButtonText: {
    color: '#f8fafc',
    fontSize: 16,
  },
  dropdownArrow: {
    color: '#94a3b8',
    fontSize: 12,
  },
  dropdownList: {
    backgroundColor: '#1e293b',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#334155',
    overflow: 'hidden',
    marginTop: 4,
  },
  dropdownItem: {
    padding: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#334155',
  },
  dropdownItemSelected: {
    backgroundColor: '#1e3a5f',
  },
  dropdownItemText: {
    color: '#e2e8f0',
    fontSize: 16,
  },
  dropdownItemTextSelected: {
    color: '#60a5fa',
    fontWeight: '600',
  },
});
