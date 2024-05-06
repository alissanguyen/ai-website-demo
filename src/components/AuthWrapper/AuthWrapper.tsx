import React, { useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import useAuth from '@/hooks/useAuth';

/**
 * - Check if user is authenticated on every route
 * - Redirect unauthenticated users to login page
 * - Redirect authenticated users to home page if they try to access login or register routes
 * - Allow unauthenticated users to access login and register pages without redirection
 * @param param0
 * @returns 
 */
const AuthWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const router = useRouter();
    const { userId, isLoading } = useAuth();
    const pathname: string = usePathname()

    useEffect(() => {
        if (!isLoading) {
            if (!userId) {
                const currentPath = pathname;
                if (currentPath !== '/login' && currentPath !== '/register') {
                    router.push('/login');
                }
            } else {
                if (pathname === '/login' || pathname === '/register') {
                    router.push('/');
                }
            }
        }
    }, [userId, isLoading, router, pathname]);


    return <>{children}</>;
};

export default AuthWrapper;