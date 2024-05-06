import { useState, useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { checkAuth } from '@/utils/supabase/auth';

const useAuth = () => {
  const router = useRouter();
  const pathname = usePathname();
  const [userId, setUserId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkAuthStatus = async () => {
      const authenticatedUserId = await checkAuth();
      setUserId(authenticatedUserId);
      setIsLoading(false);

      if (!authenticatedUserId) {
        const currentPath = pathname;
        if (currentPath !== '/login' && currentPath !== '/register') {
          router.replace('/login');
        }
      } else {
        if (pathname === '/login' || pathname === '/register') {
          router.replace('/account');
        }
      }
    };

    if (pathname !== '/') {
      checkAuthStatus();
    } else {
      setIsLoading(false);
    }
  }, [router, pathname]);

  return { userId, isLoading };
};

export default useAuth;