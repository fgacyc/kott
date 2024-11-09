import unfonts from 'unplugin-fonts/vite';
import { defineConfig } from 'vite';
import nodePolyfills from 'vite-plugin-node-stdlib-browser';
import solidPlugin from 'vite-plugin-solid';
import tsconfigPaths from 'vite-tsconfig-paths';

export default defineConfig({
  plugins: [
    solidPlugin(),
    nodePolyfills(),
    tsconfigPaths(),
    unfonts({
      custom: {
        families: [
          { name: 'Geist', src: './public/fonts/Geist-*.woff2' },
          { name: 'GeistMono', src: './public/fonts/GeistMono-*.woff2' },
        ],
      },
    }),
  ],
  build: {
    target: 'esnext',
    rollupOptions: {
      external: ['http-proxy-agent', 'https-proxy-agent', 'socks-proxy-agent'],
    },
  },
  optimizeDeps: { include: ['http-proxy-agent', 'https-proxy-agent', 'socks-proxy-agent'] },
});
