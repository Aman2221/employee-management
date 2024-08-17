// hooks/useAuth.js
"use client";
import { useRouter } from 'next/router';
import { useEffect } from 'react';

export function useAuth(redirectTo = '/login') {
  const router = useRouter();
  const isLoggedIn = false; /* your logic to check if the user is logged in */;

  useEffect(() => {
    if (!isLoggedIn) {
      router.push(redirectTo);
    }
  }, [isLoggedIn, router, redirectTo]);

  return isLoggedIn;
}
