import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
// https://vitejs.dev/config/
export default defineConfig({
    plugins: [react()],
    server: {
        port: 5173,
        proxy: {
            // Frontend talks to the FastAPI layer through /api during development.
            '/api': {
                target: 'http://localhost:8000',
                changeOrigin: true,
            },
        },
    },
});
