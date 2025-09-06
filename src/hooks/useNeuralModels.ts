import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { LayerConfig } from '@/types/neural-network';
import { toast } from 'sonner';

export interface NeuralModel {
  id: string;
  user_id: string;
  name: string;
  description?: string;
  model_data: any; // Using any to match Supabase Json type
  is_public: boolean;
  created_at: string;
  updated_at: string;
}

export const useNeuralModels = () => {
  const { user } = useAuth();
  const [userModels, setUserModels] = useState<NeuralModel[]>([]);
  const [publicModels, setPublicModels] = useState<NeuralModel[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchUserModels = useCallback(async () => {
    if (!user) return;
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('neural_models')
        .select('*')
        .eq('user_id', user.id)
        .order('updated_at', { ascending: false });
      if (error) throw error;
      setUserModels((data as NeuralModel[]) || []);
    } catch (error) {
      console.error('Error fetching user models:', error);
      toast.error('Failed to fetch your models');
    } finally {
      setLoading(false);
    }
  }, [user]);

  const fetchPublicModels = useCallback(async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('neural_models')
        .select('*')
        .eq('is_public', true)
        .order('created_at', { ascending: false })
        .limit(50);
      if (error) throw error;
      setPublicModels((data as NeuralModel[]) || []);
    } catch (error) {
      console.error('Error fetching public models:', error);
      toast.error('Failed to fetch public models');
    } finally {
      setLoading(false);
    }
  }, []);

  const saveModel = useCallback(async (
    name: string, 
    layers: LayerConfig[], 
    description?: string,
    isPublic: boolean = true
  ) => {
    if (!user) {
      toast.error('Please sign in to save models');
      return null;
    }

    try {
      const { data, error } = await supabase
        .from('neural_models')
        .insert({
          user_id: user.id,
          name,
          description,
          model_data: { layers } as any,
          is_public: isPublic
        })
        .select()
        .single();

      if (error) throw error;
      toast.success('Model saved successfully!');
      await fetchUserModels();
      return data;
    } catch (error) {
      console.error('Error saving model:', error);
      toast.error('Failed to save model');
      return null;
    }
  }, [user, fetchUserModels]);

  const updateModel = useCallback(async (
    id: string,
    updates: any
  ) => {
    if (!user) {
      toast.error('Please sign in to update models');
      return null;
    }

    try {
      const { data, error } = await supabase
        .from('neural_models')
        .update(updates)
        .eq('id', id)
        .eq('user_id', user.id)
        .select()
        .single();

      if (error) throw error;
      toast.success('Model updated successfully!');
      await fetchUserModels();
      return data;
    } catch (error) {
      console.error('Error updating model:', error);
      toast.error('Failed to update model');
      return null;
    }
  }, [user, fetchUserModels]);

  const deleteModel = useCallback(async (id: string) => {
    if (!user) {
      toast.error('Please sign in to delete models');
      return false;
    }

    try {
      const { error } = await supabase
        .from('neural_models')
        .delete()
        .eq('id', id)
        .eq('user_id', user.id);

      if (error) throw error;
      toast.success('Model deleted successfully!');
      await fetchUserModels();
      return true;
    } catch (error) {
      console.error('Error deleting model:', error);
      toast.error('Failed to delete model');
      return false;
    }
  }, [user, fetchUserModels]);

  useEffect(() => {
    if (user) {
      fetchUserModels();
    }
  }, [user, fetchUserModels]);

  return {
    userModels,
    publicModels,
    loading,
    saveModel,
    updateModel,
    deleteModel,
    fetchUserModels,
    fetchPublicModels
  };
};