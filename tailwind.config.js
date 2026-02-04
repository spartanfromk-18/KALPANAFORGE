/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
        "./components/**/*.{js,ts,jsx,tsx}",
        "./App.tsx",
        "./index.tsx"
    ],
    darkMode: 'class',
    theme: {
        extend: {
            colors: {
                background: 'var(--background)',
                surface: 'var(--surface)',
                surfaceHighlight: 'var(--surface-highlight)',
                textPrimary: 'var(--text-primary)',
                textSecondary: 'var(--text-secondary)',
                border: 'var(--border)',
                primary: {
                    DEFAULT: 'var(--primary)',
                    dark: 'var(--primary-dark)',
                },
                secondary: 'var(--secondary)',
                accent: 'var(--accent)',
            },
            fontFamily: {
                sans: ['Manrope', 'sans-serif'],
                display: ['Manrope', 'sans-serif'],
            },
            animation: {
                'blob': 'blob 7s infinite',
                'float': 'float 6s ease-in-out infinite',
                'float-slow': 'float-slow 12s ease-in-out infinite',
                'float-medium': 'float-medium 9s ease-in-out infinite',
                'float-fast': 'float-fast 7s ease-in-out infinite',
            },
            keyframes: {
                blob: {
                    '0%': { transform: 'translate(0px, 0px) scale(1)' },
                    '33%': { transform: 'translate(30px, -50px) scale(1.1)' },
                    '66%': { transform: 'translate(-20px, 20px) scale(0.9)' },
                    '100%': { transform: 'translate(0px, 0px) scale(1)' },
                },
                float: {
                    '0%, 100%': { transform: 'translateY(0)' },
                    '50%': { transform: 'translateY(-20px)' },
                },
                'float-slow': {
                    '0%, 100%': { transform: 'translateY(0) rotate(0deg)' },
                    '50%': { transform: 'translateY(-30px) rotate(5deg)' },
                },
                'float-medium': {
                    '0%, 100%': { transform: 'translateY(0) scale(1)' },
                    '50%': { transform: 'translateY(-50px) scale(1.05)' },
                },
                'float-fast': {
                    '0%, 100%': { transform: 'translateY(0) translateX(0)' },
                    '33%': { transform: 'translateY(-40px) translateX(20px)' },
                    '66%': { transform: 'translateY(-20px) translateX(-20px)' },
                }
            }
        },
    },
    plugins: [],
}
