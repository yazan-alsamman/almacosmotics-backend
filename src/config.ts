import 'dotenv/config';

function parseOrigins(raw: string | undefined): string[] | true {
  if (!raw || raw.trim() === '*') return true;
  return raw.split(',').map((s) => s.trim()).filter(Boolean);
}

export const config = {
  port: Number(process.env.PORT) || 4000,
  nodeEnv: process.env.NODE_ENV ?? 'development',
  corsOrigins: parseOrigins(process.env.CORS_ORIGINS),

  /** Fonnte (Indonesia) — device token from https://fonnte.com dashboard */
  fonnteToken: process.env.FONNTE_TOKEN ?? '',
  fonnteApiUrl: process.env.FONNTE_API_URL ?? 'https://api.fonnte.com/send',

  /** Only if OTP_DEV_REVEAL=true: response includes debugCode (local testing; never enable in production) */
  otpDevReveal: process.env.OTP_DEV_REVEAL === 'true',

  otpMessageTemplate:
    process.env.OTP_MESSAGE_TEMPLATE ??
    'Alma Cosmetics — رمز التحقق: {{code}} (صالح 5 دقائق). لا تشاركي هذا الرمز.',
};
