import { config } from '../config.js';

function formatBody(code: string): string {
  return config.otpMessageTemplate.replace(/\{\{code\}\}/g, code);
}

/** Syria E.164 → Fonnte target (9 digits) + countryCode 963 */
function syriaTargetForFonnte(e164: string): { countryCode: string; target: string } | null {
  const n = e164.replace(/^\+/, '');
  if (n.startsWith('963') && n.length === 12 && /^\d{12}$/.test(n)) {
    return { countryCode: '963', target: n.slice(3) };
  }
  return null;
}

/**
 * Sends OTP via [Fonnte](https://fonnte.com) (Indonesia WhatsApp API gateway).
 * Set FONNTE_TOKEN from your Fonnte device dashboard. No Twilio.
 */
export async function sendWhatsAppOtp(toE164: string, code: string): Promise<{ ok: boolean; error?: string }> {
  const message = formatBody(code);
  const parsed = syriaTargetForFonnte(toE164);

  if (config.fonnteToken && parsed) {
    const params = new URLSearchParams();
    params.set('target', parsed.target);
    params.set('message', message);
    params.set('countryCode', parsed.countryCode);

    const res = await fetch(config.fonnteApiUrl, {
      method: 'POST',
      headers: {
        Authorization: config.fonnteToken,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: params.toString(),
    });

    const text = await res.text();
    let json: { status?: boolean; detail?: string } = {};
    try {
      json = JSON.parse(text) as typeof json;
    } catch {
      /* non-JSON error page */
    }

    if (!res.ok || json.status === false) {
      console.error('[fonnte] send failed', res.status, text.slice(0, 500));
      return { ok: false, error: 'fonnte_failed' };
    }

    console.info('[fonnte] queued:', json.detail ?? text.slice(0, 120));
    return { ok: true };
  }

  if (config.fonnteToken && !parsed) {
    console.error('[fonnte] unsupported phone format for Fonnte:', toE164);
    return { ok: false, error: 'invalid_phone' };
  }

  console.info('[whatsapp/mock] OTP to', toE164, '—', code);
  console.info('[whatsapp/mock] message:', message);
  return { ok: true };
}
