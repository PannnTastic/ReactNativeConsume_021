import { useState, useCallback } from 'react';
import { HewanRepoImpl } from '@/data/repositories/hewanRepoImpl';
import { Hewan } from '@/domain/entities/hewan';

const hewanRepo = new HewanRepoImpl();

export const useHewanViewModel = () => {
  const [hewanList, setHewanList] = useState<Hewan[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchHewan = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await hewanRepo.getAll();
      if (res.success) setHewanList(res.data);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Gagal mengambil data hewan');
    } finally {
      setLoading(false);
    }
  }, []);

  const addHewan = async (payload: Omit<Hewan, 'id'>, onSuccess: () => void) => {
    setLoading(true);
    try {
      const res = await hewanRepo.create(payload);
      if (res.success) {
        await fetchHewan();
        onSuccess();
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Gagal menambahkan hewan');
    } finally {
      setLoading(false);
    }
  };

  const updateHewan = async (id: number, payload: Omit<Hewan, 'id'>, onSuccess: () => void) => {
    setLoading(true);
    try {
      const res = await hewanRepo.update(id, payload);
      if (res.success) {
        await fetchHewan();
        onSuccess();
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Gagal mengupdate hewan');
    } finally {
      setLoading(false);
    }
  };

  const deleteHewan = async (id: number) => {
    try {
      const res = await hewanRepo.delete(id);
      if (res.success) {
        setHewanList((prev) => prev.filter((item) => item.id !== id));
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Gagal menghapus data');
    }
  };

  return { hewanList, loading, error, fetchHewan, addHewan, updateHewan, deleteHewan };
};
