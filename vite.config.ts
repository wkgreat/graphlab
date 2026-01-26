import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { resolve } from 'path';
import path from 'path'
import fs from 'fs'

function getDemoEntries(dir: string) {
  const entries: Record<string, string> = {}

  function walk(current: string) {
    for (const file of fs.readdirSync(current)) {
      const fullPath = path.join(current, file)
      const stat = fs.statSync(fullPath)

      if (stat.isDirectory()) {
        walk(fullPath)
      } else if (file.endsWith('.html')) {
        const relative = path
          .relative(dir, fullPath)
          .replace(/\\/g, '/')
        const demo = relative.split("/")[1];
        entries[demo] = resolve(__dirname, fullPath)
      }
    }
  }

  walk(dir)
  return entries
}

const entries = getDemoEntries("src");

export default defineConfig(({ command }) => ({
  base: './',
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        ...entries
      },
    },
  },
  plugins: [
    react()
  ]
}))