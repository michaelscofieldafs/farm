import path from 'path';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
    plugins: [react()],
    server: {
        host: true,          // permite acessar pela rede local
        port: 5173,          // opcional, pra fixar a porta
    },
    resolve: {
        alias: {
            '@': path.resolve(__dirname, './src'),
            'components': path.resolve(__dirname, './src/components'),
            'utils': path.resolve(__dirname, './src/lib/utils'),
            'ui': path.resolve(__dirname, './src/components/ui'),
            'lib': path.resolve(__dirname, './src/lib'),
            'hooks': path.resolve(__dirname, './src/hooks'),
            'contracts': path.resolve(__dirname, './src/contracts'),
            'interfaces': path.resolve(__dirname, './src/interfaces'),
            'enums': path.resolve(__dirname, './src/enums'),
        },
    },
});