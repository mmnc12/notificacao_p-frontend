import { useEffect, useState } from 'react';

export const useTheme = () => {
    const [isDark, setIsDark] = useState(() => {
        if (typeof document !== 'undefined') {
            // Garante que a classe 'dark' está no <html>
            document.documentElement.classList.add('dark');
            return true;
        }
        return true;
    });

    useEffect(() => {
        // Garante que a classe 'dark' está sempre no <html>
        document.documentElement.classList.add('dark');

        // Observa mudanças
        const observer = new MutationObserver(() => {
            const temDark = document.documentElement.classList.contains('dark');
            if (!temDark) {
                document.documentElement.classList.add('dark');
            }
            setIsDark(true);
        });

        observer.observe(document.documentElement, {
            attributes: true,
            attributeFilter: ['class'],
        });

        return () => observer.disconnect();
    }, []);

    return { isDark };
};