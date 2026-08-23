import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// GitHub Pages deployment:
// Change base to '/<REPO_NAME>/' if deploying to https://user.github.io/<REPO_NAME>/
// Use './' for relative paths (works for most deployments)
export default defineConfig({
  plugins: [react()],
  base: './',
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    sourcemap: false,
  },
})
