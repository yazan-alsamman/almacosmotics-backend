import 'dotenv/config';

function parseOrigins(raw: string | undefined): string[] | true {
  if (!raw || raw.trim() === '*') return true;
  return raw.split(',').map((s) => s.trim()).filter(Boolean);
}

export const config = {
  port: Number(process.env.PORT) || 4000,
  nodeEnv: process.env.NODE_ENV ?? 'development',
  corsOrigins: parseOrigins(process.env.CORS_ORIGINS),

  /** Twilio WhatsApp: From must be approved in Twilio (often whatsapp:+1...) */
  twilioAccountSid: process.env.TWILIO_ACCOUNT_SID ?? '',
  twilioAuthToken: process.env.TWILIO_AUTH_TOKEN ?? '',
  twilioWhatsAppFrom: process.env.TWILIO_WHATSAPP_FROM ?? '',

  /** Only if OTP_DEV_REVEAL=true: response includes debugCode (local testing; never enable in production) */
  otpDevReveal: process.env.OTP_DEV_REVEAL === 'true',

  otpMessageTemplate:
    process.env.OTP_MESSAGE_TEMPLATE ??
    'Alma Cosmetics — رمز التحقق: {{code}} (صالح 5 دقائق)',
};
