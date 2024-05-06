import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { checkAuth } from '@/utils/supabase/auth';

const useAuth = () => {
  const [userId, setUserId] = useState<string | null>(null);
  // isLoading state to indicate if authentication check is in progress
  // isLoading to true initially and update it to false after authentication check
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkAuthStatus = async () => {
      const authenticatedUserId = await checkAuth();
      setUserId(authenticatedUserId);
      setIsLoading(false);
    };
    checkAuthStatus();
  }, []);

  return { userId, isLoading };
};

export default useAuth;