import React, { createContext, useEffect, useState } from 'react';
import { UserProfile } from '@/types/types';
import useAuth from '@/hooks/useAuth';
import { supabaseClient } from '@/utils/supabase/client';

interface UserContextData {
  userId: string | null;
  fullName: string | null;
  avatarUrl: string | null;
}

const UserContext = createContext<UserContextData>({
  userId: null,
  fullName: null,
  avatarUrl: null,
});

const UserContextProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { userId } = useAuth();
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);

  useEffect(() => {
    const fetchUserProfile = async () => {
      if (userId) {
        const { data, error } = await supabaseClient
          .from('profiles')
          .select('*')
          .eq('id', userId)
          .single();

        if (error) {
          console.error('Error fetching user profile:', error);
        } else {
          setUserProfile(data);
          // Fetch the avatar URL from Supabase storage
          const { data: avatarData, error: avatarError } = await supabaseClient
            .storage
            .from('avatars')
            .download(data.avatar_url);

          if (avatarError) {
            console.error('Error fetching avatar URL:', avatarError);
          } else {
            // Create a URL for the downloaded avatar image
            const avatarUrl = URL.createObjectURL(avatarData);
            setAvatarUrl(avatarUrl);
          }
        }
      }
    };

    fetchUserProfile();
  }, [userId]);

  const contextData: UserContextData = {
    userId,
    fullName: userProfile?.full_name || null,
    avatarUrl,
  };

  return <UserContext.Provider value={contextData}>{children}</UserContext.Provider>;
};

export { UserContext, UserContextProvider };