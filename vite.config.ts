import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    port: 5173,
    // Bind IPv4 so http://127.0.0.1:5173 works (Vite default can be IPv6-only on Windows).
    host: '127.0.0.1',
    strictPort: false,
  },
})
