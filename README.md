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

Without Twilio credentials, the OTP is **logged in the terminal** (and optional `OTP_DEV_REVEAL=true` returns `debugCode` in JSON — dev only).

Configure **Twilio WhatsApp** in `.env` (`TWILIO_*`, `TWILIO_WHATSAPP_FROM`) to send real messages from your approved business sender.

## Remote

`https://github.com/yazan-alsamman/almacosmotics-backend.git` (branch `main`)
