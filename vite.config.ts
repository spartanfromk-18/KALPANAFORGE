import path from 'path';
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default defineConfig(({ mode }) => {
  loadEnv(mode, '.', '');

  return {
    // Development server configuration
    server: {
      port: 3000,
      host: true, // Listen on all local IPs
    },

    // Preview server (production build preview)
    preview: {
      port: 4173,
      host: '0.0.0.0',
    },

    // Plugins
    plugins: [react()],

    // Path aliases
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      }
    },

    // Build configuration for production
    build: {
      // Output directory
      outDir: 'dist',

      // Generate source maps for debugging (optional in production)
      sourcemap: false,

      // Minification
      minify: 'esbuild',

      // Chunk size warnings
      chunkSizeWarningLimit: 1000,

      // Rollup options for code splitting
      rollupOptions: {
        output: {
          manualChunks: {
            // Separate vendor chunks for better caching
            'vendor-react': ['react', 'react-dom'],
            'vendor-motion': ['framer-motion'],
          },
        },
      },
    },

    // Environment variable prefix (only VITE_ prefixed vars are exposed to client)
    envPrefix: 'VITE_',

    // Define global constants
    define: {
      __APP_VERSION__: JSON.stringify(process.env.npm_package_version || '1.0.0'),
    },
  };
});
