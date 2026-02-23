# Production Database Safety Policy

Last updated: 2026-02-23

## Goal

Production ortamında deploy veya manuel komut çalıştırma sırasında veritabanı kaybını engellemek.

## Current Protection

- `npm run db:reset` ve `npm run db:setup` artık `scripts/destructive-db-guard.mjs` korumasından geçmeden çalışmaz.
- Guard aşağıdaki durumlarda komutu **bloklar**:
  - Ortam production benzeri ise (`NODE_ENV`, `APP_ENV`, `ENVIRONMENT`, `VERCEL_ENV` -> `production`/`prod`)
  - `DATABASE_URL` yoksa veya parse edilemiyorsa
  - DB host local değilse ve uzak DB onayı verilmemişse
  - Açık veri kaybı onay değişkeni verilmemişse

## Required Confirmation Variables

Destructive komutlar için iki kademeli onay uygulanır:

1. Her durumda zorunlu:
   - `ALLOW_DESTRUCTIVE_DB_COMMANDS=I_UNDERSTAND_AND_ACCEPT_DATA_LOSS`
2. DB host local değilse ek zorunlu:
   - `ALLOW_REMOTE_DESTRUCTIVE_DB_COMMANDS=I_UNDERSTAND_REMOTE_DB_RISK`

Bu değişkenler olmadan komutlar fail olur.

## Safe Deploy Note

- Production deploy akışı `npm run build` çalıştırır.
- Build script’i `prisma migrate deploy` kullanır; `db:reset` veya `db:setup` çağırmaz.
- Bu nedenle normal deploy akışı reset tetiklemez.

## Local Recovery (Intentional)

Sadece lokal geliştirme ortamında bilerek çalıştır:

```bash
export ALLOW_DESTRUCTIVE_DB_COMMANDS=I_UNDERSTAND_AND_ACCEPT_DATA_LOSS
npm run db:reset
```

Remote bir geliştirme/staging DB için:

```bash
export ALLOW_DESTRUCTIVE_DB_COMMANDS=I_UNDERSTAND_AND_ACCEPT_DATA_LOSS
export ALLOW_REMOTE_DESTRUCTIVE_DB_COMMANDS=I_UNDERSTAND_REMOTE_DB_RISK
npm run db:reset
```

## Team Rule

- Production’da destructive DB komutları çalıştırılmaz.
- Şüphe varsa önce yedek alınır, sonra migration stratejisi gözden geçirilir.
