import { useEffect } from 'react';
import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  StatusBar,
} from 'react-native';
import { useHewanViewModel } from '@/hooks/useHewanViewModel';

export default function HewanListScreen() {
  const { hewanList, loading, error, fetchHewan } = useHewanViewModel();

  useEffect(() => {
    fetchHewan();
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#0f172a" />
      <View style={styles.header}>
        <Text style={styles.headerTitle}>🐄 Ternak App</Text>
        <Text style={styles.headerSubtitle}>Manajemen Data Hewan</Text>
      </View>

      <View style={styles.content}>
        {loading && <Text style={styles.loadingText}>Memuat data...</Text>}
        {error && <Text style={styles.errorText}>{error}</Text>}
        {!loading && hewanList.length === 0 && (
          <Text style={styles.emptyText}>Belum ada data hewan</Text>
        )}
      </View>
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
    paddingTop: 16,
    paddingBottom: 16,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#f8fafc',
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#94a3b8',
    marginTop: 4,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  loadingText: {
    color: '#94a3b8',
    fontSize: 16,
  },
  errorText: {
    color: '#fca5a5',
    fontSize: 14,
  },
  emptyText: {
    color: '#64748b',
    fontSize: 16,
  },
});
