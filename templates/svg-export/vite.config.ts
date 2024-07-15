import { defineConfig, Plugin } from 'vite';
import vue from '@vitejs/plugin-vue';
import inject from '@rollup/plugin-inject';

const debounce = (
  fn: (...args: any[]) => void,
  delay: number,
) => {
  let timeout: NodeJS.Timeout;

  return (...args: any[]) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => fn(...args), delay);
  };
};

const fullReloadAlways: Plugin = {
    name: 'full-reload',
    handleHotUpdate({ server }) {
        server.ws.send({ type: "full-reload" });
        return [];
    },
};

const logReady = debounce(
  () => {
    console.log('\nYou can now reload the Simple Browser to see your design.\n');
  },
  500,
);

const logReadyPlugin: Plugin = {
  name: 'log-ready',
  transform() {
    logReady();
  },
  handleHotUpdate() {
    logReady();
  },
};

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    fullReloadAlways,
    inject({
      p5: 'p5',
    }),
    logReadyPlugin,
  ],
});
