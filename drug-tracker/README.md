# DrugTrack

Medication tracking, reminders, and prescription management.

## Stack

- Next.js 16 (App Router)
- NextAuth.js v4 (JWT, Credentials)
- Prisma 5 + Neon PostgreSQL
- Tailwind CSS v4
- Cloudinary (image uploads)

## Local Development

```bash
pnpm install
pnpm dev
```

## Environment Variables

Set these in `.env` locally and in Vercel project settings for deployment:

| Variable | Description |
|---|---|
| `DATABASE_URL` | Neon pooled connection string |
| `DIRECT_URL` | Neon direct connection string (for migrations) |
| `NEXTAUTH_SECRET` | Random secret string (use `openssl rand -base64 32`) |
| `NEXTAUTH_URL` | Full URL of your app (`https://your-app.vercel.app` in production) |
| `NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME` | Your Cloudinary cloud name |
| `NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET` | Your Cloudinary unsigned upload preset |

## Database

Run migrations against Neon:

```bash
pnpm prisma migrate deploy
```

Or push schema directly (dev only):

```bash
pnpm prisma db push
```

## Deploy to Vercel

1. Push to GitHub
2. Import repo in Vercel
3. Add all environment variables above in Vercel project settings
4. Deploy — `prisma generate && next build` runs automatically
