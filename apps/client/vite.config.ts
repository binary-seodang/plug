import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'
// https://vitejs.dev/config/
export default ({ mode }) => {
  process.env = { ...process.env, ...loadEnv(mode, process.cwd()) }
  return defineConfig({
    plugins: [react()],
    server: {
      port: 3000,
    },

    resolve: {
      alias: [
        {
          find: 'screen',
          replacement: path.resolve(__dirname, 'src/screen'),
        },
        {
          find: 'context',
          replacement: path.resolve(__dirname, 'src/context'),
        },
        {
          find: 'hooks',
          replacement: path.resolve(__dirname, 'src/hooks'),
        },
        {
          find: 'layout',
          replacement: path.resolve(__dirname, 'src/layout'),
        },
        {
          find: 'libs',
          replacement: path.resolve(__dirname, 'src/libs'),
        },
        {
          find: 'store',
          replacement: path.resolve(__dirname, 'src/store'),
        },
      ],
    },
  })
}
