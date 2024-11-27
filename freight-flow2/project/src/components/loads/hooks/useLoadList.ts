import { useQuery } from '@tanstack/react-query';
import { supabase } from '../../../lib/supabase';
import { Load } from '../../../types/load';

export const useLoadList = () => {
  const {
    data: loads,
    isLoading,
    error,
    refetch
  } = useQuery<Load[]>({
    queryKey: ['loads'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('loads')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data;
    },
  });

  const deleteLoad = async (id: string) => {
    try {
      const { error } = await supabase
        .from('loads')
        .delete()
        .eq('id', id);

      if (error) throw error;
      refetch();
      return true;
    } catch (err) {
      console.error('Error deleting load:', err);
      return false;
    }
  };

  const bookLoad = async (id: string, userId: string) => {
    try {
      const { error } = await supabase
        .from('loads')
        .update({ status: 'BOOKED', booked_by: userId })
        .eq('id', id);

      if (error) throw error;
      refetch();
      return true;
    } catch (err) {
      console.error('Error booking load:', err);
      return false;
    }
  };

  return {
    loads,
    isLoading,
    error,
    deleteLoad,
    bookLoad,
    refetch,
  };
};