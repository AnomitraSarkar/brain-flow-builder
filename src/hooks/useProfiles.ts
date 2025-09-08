import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

export interface Profile {
  id: string;
  user_id: string;
  display_name: string | null;
  avatar_url: string | null;
  bio: string | null;
  created_at: string;
  updated_at: string;
}

export const useProfiles = () => {
  const [profiles, setProfiles] = useState<Record<string, Profile>>({});
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();

  const fetchProfile = async (userId: string) => {
    if (profiles[userId]) return profiles[userId];

    try {
      // First try to get profile
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('user_id', userId)
        .single();

      if (profile && !profileError) {
        setProfiles(prev => ({ ...prev, [userId]: profile }));
        return profile;
      }

      // If no profile found, create a basic one with email
      // For now, we'll return null and let the calling code handle it
      // The actual user email fetching would need admin access
      return null;
    } catch (error) {
      console.error('Error fetching profile:', error);
      return null;
    }
  };

  const createProfile = async (displayName: string) => {
    if (!user) return { error: 'No user logged in' };

    try {
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
      return { data };
    } catch (error) {
      return { error };
    }
  };

  const updateProfile = async (updates: Partial<Profile>) => {
    if (!user) return { error: 'No user logged in' };

    try {
      const { data, error } = await supabase
        .from('profiles')
        .update(updates)
        .eq('user_id', user.id)
        .select()
        .single();

      if (error) return { error };

      setProfiles(prev => ({ ...prev, [user.id]: data }));
      return { data };
    } catch (error) {
      return { error };
    }
  };

  return {
    profiles,
    loading,
    fetchProfile,
    createProfile,
    updateProfile,
  };
};