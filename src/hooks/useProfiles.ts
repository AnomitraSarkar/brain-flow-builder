import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

export interface Profile {
  id: string;
  user_id: string;
  display_name: string | null;
  bio: string | null;
  created_at: string;
  updated_at: string;
}

export const useProfiles = () => {
  const [profiles, setProfiles] = useState<Record<string, Profile>>({});
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();

  // Fetch current user's profile
  useEffect(() => {
    if (user?.id) {
      fetchProfile(user.id).then(setProfile);
    }
  }, [user?.id]);

  const fetchProfile = async (userId: string): Promise<Profile | null> => {
    if (profiles[userId]) return profiles[userId];

    try {
      setLoading(true);
      const { data: profile, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('user_id', userId)
        .single();

      if (profile && !error) {
        setProfiles(prev => ({ ...prev, [userId]: profile }));
        return profile;
      }

      return null;
    } catch (error) {
      console.error('Error fetching profile:', error);
      return null;
    } finally {
      setLoading(false);
    }
  };

  const createProfile = async (displayName: string) => {
    if (!user) return { error: 'No user logged in' };

    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('profiles')
        .insert({
          user_id: user.id,
          display_name: displayName,
        })
        .select()
        .single();

      if (error) return { error };

      setProfiles(prev => ({ ...prev, [user.id]: data }));
      setProfile(data);
      return { data };
    } catch (error) {
      return { error };
    } finally {
      setLoading(false);
    }
  };

  const updateProfile = async (updates: Partial<Pick<Profile, 'display_name' | 'bio'>>) => {
    if (!user) throw new Error('No user logged in');

    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('profiles')
        .update(updates)
        .eq('user_id', user.id)
        .select()
        .single();

      if (error) throw error;

      if (data) {
        setProfiles(prev => ({ ...prev, [user.id]: data }));
        setProfile(data);
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  return {
    profiles,
    profile,
    loading,
    fetchProfile,
    createProfile,
    updateProfile,
  };
};