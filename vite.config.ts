import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'

export default defineConfig({
  base: '/studenttools/',
  plugins: [react()],
  test: {
    environment: 'node',
  },
})
