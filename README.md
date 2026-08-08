# MatchTaym ⚽

Futbol yangiliklari va tahlillar sayti — Next.js (App Router) + Prisma (Neon Postgres) + NextAuth + AWS S3.

## Stek

- **Frontend/Backend:** Next.js 16 (App Router, TypeScript, Tailwind v4)
- **Ma'lumotlar bazasi:** PostgreSQL (Neon), Prisma ORM (driver adapter — `@prisma/adapter-pg`)
- **Auth:** NextAuth v5 (Credentials — admin/editor uchun)
- **Media:** AWS S3 (rasm yuklash)

## Ishga tushirish

```bash
npm install
cp .env.example .env   # qiymatlarni to'ldiring
npx prisma db push     # schema'ni bazaga qo'llash
npx prisma db seed      # admin user + kategoriyalarni yaratish
npm run dev
```

Sayt: http://localhost:3000, admin panel: http://localhost:3000/admin/login

## Kerakli environment o'zgaruvchilar

`.env.example` faylida to'liq ro'yxat bor:

- `DATABASE_URL` — Neon Postgres ulanish satri
- `AUTH_SECRET` — NextAuth uchun tasodifiy maxfiy kalit (`openssl rand -base64 32`)
- `ADMIN_EMAIL`, `ADMIN_NAME`, `ADMIN_PASSWORD` — faqat `prisma db seed` uchun ishlatiladi (birinchi admin hisobini yaratadi)
- `AWS_REGION`, `AWS_ACCESS_KEY_ID`, `AWS_SECRET_ACCESS_KEY`, `AWS_S3_BUCKET` — rasm yuklash uchun
- `NEXT_PUBLIC_SITE_URL` — sayt domeni (metadata, sitemap uchun)

## Loyiha tuzilishi

- `src/app/(public)` — ommaviy sahifalar: bosh sahifa, maqola, kategoriya, transferlar, qidiruv
- `src/app/admin` — CMS: maqolalar/kategoriyalar/transferlar CRUD
- `src/actions` — server actions (mutatsiyalar)
- `src/lib/queries.ts` — o'qish so'rovlari (server components uchun)
- `src/lib/s3.ts` — S3 upload/delete
- `prisma/schema.prisma` — ma'lumotlar modeli

## Vercel'ga deploy

1. Repo'ni Vercel'ga import qiling
2. Environment Variables bo'limiga yuqoridagi barcha o'zgaruvchilarni kiriting
3. Build command: `next build` (standart) — `postinstall` avtomatik `prisma generate` ishga tushiradi
4. Birinchi deploydan keyin bir marta lokal yoki Vercel CLI orqali `npx prisma db push && npx prisma db seed` ishga tushiring (Neon bazasi allaqachon sozlangan bo'lsa, bu qadam shart emas)
