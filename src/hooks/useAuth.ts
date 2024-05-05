import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { checkAuth } from '@/utils/supabase/auth';

const useAuth = () => {
    const router = useRouter();
    const [userId, setUserId] = useState<string | null>(null);

    useEffect(() => {
        const checkAuthStatus = async () => {
            const authenticatedUserId = await checkAuth();
            if (authenticatedUserId) {
                setUserId(authenticatedUserId);
            } else {
                router.push('/login');
            }
        };

        checkAuthStatus();
    }, [router]);

    return userId;
};

export default useAuth;