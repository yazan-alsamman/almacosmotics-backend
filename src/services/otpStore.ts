/** In-memory OTP + pending name (use Redis in production). */
type PendingAuth = {
  name: string;
  code: string;
  expiresAt: number;
};

const store = new Map<string, PendingAuth>();

const TTL_MS = 5 * 60 * 1000;

export function setPendingAuth(phoneE164: string, name: string, code: string): void {
  store.set(phoneE164, {
    name,
    code,
    expiresAt: Date.now() + TTL_MS,
  });
}

export function getPendingAuth(phoneE164: string): PendingAuth | undefined {
  const row = store.get(phoneE164);
  if (!row) return undefined;
  if (Date.now() > row.expiresAt) {
    store.delete(phoneE164);
    return undefined;
  }
  return row;
}

export function consumePendingAuth(phoneE164: string): PendingAuth | undefined {
  const row = getPendingAuth(phoneE164);
  if (!row) return undefined;
  store.delete(phoneE164);
  return row;
}

export function clearExpired(): void {
  const now = Date.now();
  for (const [k, v] of store.entries()) {
    if (now > v.expiresAt) store.delete(k);
  }
}
