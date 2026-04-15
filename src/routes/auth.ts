import { Router } from 'express';
import { config } from '../config.js';
import { setPendingAuth, getPendingAuth, consumePendingAuth, clearExpired } from '../services/otpStore.js';
import { sendWhatsAppOtp } from '../services/sendWhatsAppOtp.js';

export const authRouter = Router();

function syriaE164(local9: string): string | null {
  if (!/^\d{9}$/.test(local9)) return null;
  return `+963${local9}`;
}

function randomOtp6(): string {
  return String(Math.floor(100000 + Math.random() * 900000));
}

authRouter.post('/request-otp', async (req, res) => {
  clearExpired();
  const name = typeof req.body?.name === 'string' ? req.body.name.trim() : '';
  const phoneLocal =
    typeof req.body?.phone === 'string' ? req.body.phone.replace(/\D/g, '').slice(0, 9) : '';

  if (!name || name.length < 2) {
    return res.status(400).json({ error: 'invalid_name' });
  }

  const e164 = syriaE164(phoneLocal);
  if (!e164) {
    return res.status(400).json({ error: 'invalid_phone' });
  }

  const code = randomOtp6();
  setPendingAuth(e164, name, code);

  const send = await sendWhatsAppOtp(e164, code);
  if (!send.ok) {
    return res.status(502).json({ error: send.error ?? 'send_failed' });
  }

  const payload: {
    ok: true;
    expiresIn: number;
    debugCode?: string;
  } = {
    ok: true,
    expiresIn: 300,
  };

  if (config.otpDevReveal && config.nodeEnv !== 'production') {
    payload.debugCode = code;
  }

  return res.json(payload);
});

authRouter.post('/verify-otp', (req, res) => {
  clearExpired();
  const phoneLocal =
    typeof req.body?.phone === 'string' ? req.body.phone.replace(/\D/g, '').slice(0, 9) : '';
  const codeRaw = typeof req.body?.code === 'string' ? req.body.code.replace(/\D/g, '') : '';

  const e164 = syriaE164(phoneLocal);
  if (!e164 || codeRaw.length !== 6) {
    return res.status(400).json({ error: 'invalid_input' });
  }

  const pending = getPendingAuth(e164);
  if (!pending || pending.code !== codeRaw) {
    return res.status(401).json({ error: 'invalid_code' });
  }

  consumePendingAuth(e164);

  return res.json({
    ok: true,
    verified: true,
    phone: e164,
    name: pending.name,
  });
});
