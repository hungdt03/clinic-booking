/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],

    theme: {
        extend: {
            colors: {
                primary: '#1975DC'
            },
            boxShadow: {
                'text-sm': '1px 1px 2px rgba(0, 0, 0, 0.5)',
                'text-md': '2px 2px 4px rgba(0, 0, 0, 0.5)',
                'text-lg': '3px 3px 6px rgba(0, 0, 0, 0.5)',
            }
        },

    },
    plugins: [
        require('@tailwindcss/typography'),
        function ({ addUtilities }) {
            addUtilities({
                '.text-shadow-sm': { textShadow: '1px 1px 2px rgba(0, 0, 0, 0.5)' },
                '.text-shadow-md': { textShadow: '2px 2px 4px rgba(0, 0, 0, 0.5)' },
                '.text-shadow-lg': { textShadow: '3px 3px 6px rgba(0, 0, 0, 0.5)' },
            });
        }
    ],
}

