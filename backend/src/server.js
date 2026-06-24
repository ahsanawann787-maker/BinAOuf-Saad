import { env } from './config/env.js';
import { connectDB, disconnectDB } from './config/db.js';
import { createApp } from './app.js';

async function main() {
  await connectDB();
  const app = createApp();
  const server = app.listen(env.port, () => {
    console.log(`\n🧂 Bin Aouf API running`);
    console.log(`   → http://localhost:${env.port}`);
    console.log(`   → env: ${env.nodeEnv}`);
    console.log(`   → health: http://localhost:${env.port}/api/health\n`);
  });

  const shutdown = async (sig) => {
    console.log(`\n${sig} received — shutting down…`);
    server.close(async () => {
      await disconnectDB();
      process.exit(0);
    });
    setTimeout(() => process.exit(1), 10000).unref();
  };
  ['SIGINT', 'SIGTERM'].forEach((s) => process.on(s, () => shutdown(s)));
}

main().catch((err) => {
  console.error('✖ Fatal startup error:', err);
  process.exit(1);
});
