import app from './app';
import env from './config/env';
import prisma from './config/prisma';

async function startServer() {
  try {
    await prisma.$connect();
    console.log('✅ Database connected');
  } catch (err) {
    console.error('❌ Database connection failed:', err);
    process.exit(1);
  }

  const server = app.listen(env.PORT, () => {
    console.log(`🚀 Server running on port ${env.PORT} [${env.NODE_ENV}]`);
    console.log(`📡 Health: http://localhost:${env.PORT}/api/health`);
  });

  const gracefulShutdown = async (signal: string) => {
    console.log(`\n${signal} — shutting down...`);
    server.close(async () => {
      await prisma.$disconnect();
      console.log('Server and DB closed');
      process.exit(0);
    });
    setTimeout(() => process.exit(1), 10_000);
  };

  process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
  process.on('SIGINT', () => gracefulShutdown('SIGINT'));
}

startServer().catch((err) => {
  console.error('Failed to start server:', err);
  process.exit(1);
});
