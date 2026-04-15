import { config } from '../config.js';

function formatBody(code: string): string {
  return config.otpMessageTemplate.replace(/\{\{code\}\}/g, code);
}

/** Sends OTP via Twilio WhatsApp, or logs in mock / dev mode. */
export async function sendWhatsAppOtp(toE164: string, code: string): Promise<{ ok: boolean; error?: string }> {
  const body = formatBody(code);
  const toWa = `whatsapp:${toE164.startsWith('+') ? toE164 : `+${toE164}`}`;

  if (config.twilioAccountSid && config.twilioAuthToken && config.twilioWhatsAppFrom) {
    const sid = config.twilioAccountSid;
    const auth = Buffer.from(`${sid}:${config.twilioAuthToken}`).toString('base64');
    const url = `https://api.twilio.com/2010-04-01/Accounts/${sid}/Messages.json`;
    const params = new URLSearchParams({
      From: config.twilioWhatsAppFrom.startsWith('whatsapp:')
        ? config.twilioWhatsAppFrom
        : `whatsapp:${config.twilioWhatsAppFrom}`,
      To: toWa,
      Body: body,
    });
    const res = await fetch(url, {
      method: 'POST',
      headers: {
        Authorization: `Basic ${auth}`,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: params.toString(),
    });
    if (!res.ok) {
      const text = await res.text();
      console.error('[whatsapp] Twilio error', res.status, text);
      return { ok: false, error: 'twilio_failed' };
    }
    return { ok: true };
  }

  console.info('[whatsapp/mock] OTP to', toE164, '—', code);
  console.info('[whatsapp/mock] Body:', body);
  return { ok: true };
}
