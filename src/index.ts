import { createApp } from './app.js';
import { config } from './config.js';

const app = createApp();

app.listen(config.port, () => {
  console.log(`[alma-backend] http://localhost:${config.port}`);
  console.log(`[alma-backend] health: http://localhost:${config.port}/health`);
});
