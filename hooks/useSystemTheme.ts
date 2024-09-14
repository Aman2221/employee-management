import { useEffect, useState } from 'react';

function useSystemTheme(): 'light' | 'dark' | null {
    const [theme, setTheme] = useState<'light' | 'dark' | null>(null);

    useEffect(() => {
        // Ensure this runs only on the client side
        if (typeof window !== 'undefined') {
            const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');

            // Set the initial theme based on system preferences
            setTheme(mediaQuery.matches ? 'dark' : 'light');

            // Listener for theme changes
            const handleThemeChange = (e: MediaQueryListEvent) => {
                setTheme(e.matches ? 'dark' : 'light');
            };

            mediaQuery.addEventListener('change', handleThemeChange);

            // Cleanup listener on component unmount
            return () => mediaQuery.removeEventListener('change', handleThemeChange);
        }
    }, []);

    return theme;
}

export default useSystemTheme;
