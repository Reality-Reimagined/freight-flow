import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '../../lib/supabase';
import LoadCard from './LoadCard';
import type { Load } from '../../types';

const FindLoads = () => {
  // Using only react-query for state management
  const { 
    data: loadData, // Changed name from 'loads' to 'loadData' to avoid conflict
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

  const handleDelete = async (id: string) => {
    try {
      await supabase.from('loads').delete().eq('id', id);
      refetch(); // Refresh the data after deletion
    } catch (error) {
      console.error('Error deleting load:', error);
    }
  };

  const handleEdit = (id: string) => {
    // Handle edit functionality
    console.log('Edit load:', id);
  };

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error loading loads: {error.message}</div>;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {loadData?.map(load => (
        <LoadCard
          key={load.id}
          load={load}
          onDelete={handleDelete}
          onEdit={handleEdit}
        />
      ))}
    </div>
  );
};

export default FindLoads;