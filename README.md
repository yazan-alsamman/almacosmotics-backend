# Alma Cosmetics — Backend API

Express + TypeScript. Separate repo from the storefront.

## Run locally

```bash
npm install
cp .env.example .env
npm run dev
```

- Health: `GET http://localhost:4000/health`
- API root: `GET http://localhost:4000/api`

## Build

```bash
npm run build
npm start
```

## Auth / WhatsApp OTP

- `POST /api/auth/request-otp` — body: `{ "name": "...", "phone": "939421195" }` (9 digits, Syria)
- `POST /api/auth/verify-otp` — body: `{ "phone": "...", "code": "123456" }`

**Fonnte** ([fonnte.com](https://fonnte.com)) — unofficial WhatsApp gateway; **no Twilio**. The **free “Text Only” plan includes about 1,000 text messages per month** (check current pricing on their site). The **sender number is the WhatsApp account you link to Fonnte** (e.g. company line `0939421195`): connect that phone in the Fonnte dashboard, then copy the device **TOKEN** into `FONNTE_TOKEN` in `.env`. This backend sends with `countryCode=963` for Syrian mobile numbers.

In **production** (`NODE_ENV=production`), OTP requests **fail** until `FONNTE_TOKEN` is set, so users cannot “verify” without a real send path.

In **development**, without `FONNTE_TOKEN`, the OTP is **only logged in the terminal** (optional `OTP_DEV_REVEAL=true` returns `debugCode` in JSON — never enable in production).

## Remote

`https://github.com/yazan-alsamman/almacosmotics-backend.git` (branch `main`)
