import { useEffect } from 'react';
import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  StatusBar,
  FlatList,
  ActivityIndicator,
  RefreshControl,
} from 'react-native';
import { useHewanViewModel } from '@/hooks/useHewanViewModel';
import { Hewan } from '@/domain/entities/hewan';

export default function HewanListScreen() {
  const { hewanList, loading, error, fetchHewan } = useHewanViewModel();

  useEffect(() => {
    fetchHewan();
  }, []);

  const renderItem = ({ item }: { item: Hewan }) => (
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        <Text style={styles.cardName}>{item.nama}</Text>
        <View style={[
          styles.statusBadge,
          item.status === 'tersedia' ? styles.statusTersedia : styles.statusTerjual,
        ]}>
          <Text style={styles.statusText}>
            {item.status === 'tersedia' ? 'Tersedia' : 'Terjual'}
          </Text>
        </View>
      </View>

      <View style={styles.cardBody}>
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Jenis</Text>
          <Text style={styles.infoValue}>{item.jenis}</Text>
        </View>
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Harga</Text>
          <Text style={styles.infoValue}>
            Rp {item.harga?.toLocaleString('id-ID')}
          </Text>
        </View>
        {item.tanggal_lahir && (
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Tanggal Lahir</Text>
            <Text style={styles.infoValue}>
              {new Date(item.tanggal_lahir).toLocaleDateString('id-ID')}
            </Text>
          </View>
        )}
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#0f172a" />
      <View style={styles.header}>
        <View style={styles.headerRow}>
          <Text style={styles.headerTitle}>🐄 Ternak App</Text>
          {hewanList.length > 0 && (
            <View style={styles.countBadge}>
              <Text style={styles.countText}>{hewanList.length}</Text>
            </View>
          )}
        </View>
        <Text style={styles.headerSubtitle}>Manajemen Data Hewan</Text>
      </View>

      {error && (
        <View style={styles.errorBox}>
          <Text style={styles.errorText}>{error}</Text>
        </View>
      )}

      {loading && hewanList.length === 0 ? (
        <View style={styles.centerContent}>
          <ActivityIndicator size="large" color="#3b82f6" />
          <Text style={styles.loadingText}>Memuat data...</Text>
        </View>
      ) : (
        <FlatList
          data={hewanList}
          renderItem={renderItem}
          keyExtractor={(item) => String(item.id)}
          contentContainerStyle={styles.listContent}
          refreshControl={
            <RefreshControl
              refreshing={loading}
              onRefresh={fetchHewan}
              tintColor="#3b82f6"
              colors={['#3b82f6']}
            />
          }
          ListEmptyComponent={
            <View style={styles.centerContent}>
              <Text style={styles.emptyIcon}>📭</Text>
              <Text style={styles.emptyText}>Belum ada data hewan</Text>
              <Text style={styles.emptySubtext}>Tambahkan hewan pertama Anda</Text>
            </View>
          }
        />
      )}
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
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#f8fafc',
  },
  countBadge: {
    backgroundColor: '#3b82f6',
    paddingHorizontal: 10,
    paddingVertical: 2,
    borderRadius: 12,
  },
  countText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#94a3b8',
    marginTop: 4,
  },
  errorBox: {
    backgroundColor: '#7f1d1d',
    marginHorizontal: 24,
    padding: 12,
    borderRadius: 10,
    marginBottom: 8,
  },
  errorText: {
    color: '#fca5a5',
    fontSize: 14,
    textAlign: 'center',
  },
  centerContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  loadingText: {
    color: '#94a3b8',
    fontSize: 16,
    marginTop: 12,
  },
  emptyIcon: {
    fontSize: 48,
    marginBottom: 12,
  },
  emptyText: {
    color: '#64748b',
    fontSize: 18,
    fontWeight: '600',
  },
  emptySubtext: {
    color: '#475569',
    fontSize: 14,
    marginTop: 4,
  },
  listContent: {
    paddingHorizontal: 16,
    paddingBottom: 100,
  },
  card: {
    backgroundColor: '#1e293b',
    borderRadius: 16,
    marginBottom: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: '#334155',
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  cardName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#f8fafc',
    flex: 1,
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 20,
  },
  statusTersedia: {
    backgroundColor: '#064e3b',
  },
  statusTerjual: {
    backgroundColor: '#7f1d1d',
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#f8fafc',
  },
  cardBody: {
    gap: 6,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  infoLabel: {
    color: '#94a3b8',
    fontSize: 14,
  },
  infoValue: {
    color: '#e2e8f0',
    fontSize: 14,
    fontWeight: '500',
  },
});
