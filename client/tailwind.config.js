/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                'conch-dark': '#0f172a',
                'conch-light': '#38bdf8',
                'conch-accent': '#c084fc',
            }
        },
    },
    plugins: [],
}
