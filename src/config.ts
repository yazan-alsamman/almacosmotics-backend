import 'dotenv/config';

function parseOrigins(raw: string | undefined): string[] | true {
  if (!raw || raw.trim() === '*') return true;
  return raw.split(',').map((s) => s.trim()).filter(Boolean);
}

export const config = {
  port: Number(process.env.PORT) || 4000,
  nodeEnv: process.env.NODE_ENV ?? 'development',
  corsOrigins: parseOrigins(process.env.CORS_ORIGINS),
};
