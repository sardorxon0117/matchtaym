# MatchTaym ⚽

Futbol yangiliklari va tahlillar sayti — Next.js (App Router) + Prisma (Neon Postgres) + NextAuth + AWS S3.

## Stek

- **Frontend/Backend:** Next.js 16 (App Router, TypeScript, Tailwind v4)
- **Ma'lumotlar bazasi:** PostgreSQL (Neon), Prisma ORM (driver adapter — `@prisma/adapter-pg`)
- **Auth:** NextAuth v5 — admin/editor uchun Credentials, o'quvchilar uchun Credentials + Google OAuth
- **Media:** AWS S3 (rasm yuklash)

## Ishga tushirish

```bash
npm install
cp .env.example .env   # qiymatlarni to'ldiring
npx prisma db push     # schema'ni bazaga qo'llash
npx prisma db seed      # admin user + kategoriyalarni yaratish
npm run dev
```

Sayt: http://localhost:3000, admin panel: http://localhost:3000/admin/login, o'quvchi kirishi: http://localhost:3000/kirish

## Kerakli environment o'zgaruvchilar

`.env.example` faylida to'liq ro'yxat bor:

- `DATABASE_URL` — Neon Postgres ulanish satri
- `AUTH_SECRET` — NextAuth uchun tasodifiy maxfiy kalit (`openssl rand -base64 32`)
- `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET` — Google orqali kirish uchun (bo'sh qoldirilsa, Google tugmasi ko'rinmaydi). Google Cloud Console > APIs & Services > Credentials'dan olinadi. Redirect URI: `<domen>/api/auth/callback/google`
- `ADMIN_EMAIL`, `ADMIN_NAME`, `ADMIN_PASSWORD` — faqat `prisma db seed` uchun ishlatiladi (birinchi admin hisobini yaratadi)
- `AWS_REGION`, `AWS_ACCESS_KEY_ID`, `AWS_SECRET_ACCESS_KEY`, `AWS_S3_BUCKET` — rasm yuklash uchun
- `TELEGRAM_BOT_TOKEN`, `TELEGRAM_CHAT_ID` — yangi izoh/javoblar shu botga yuboriladi (bo'sh qoldirilsa, o'chirilgan)
- `NEXT_PUBLIC_SITE_URL` — sayt domeni (metadata, sitemap uchun)

### S3 bucket sozlamalari (yangi bucket yaratganda kerak)

Rasm yuklash brauzerdan to'g'ridan-to'g'ri S3'ga (presigned URL orqali) boradi, shuning uchun bucket'da:

1. **Public read** — `uploads/*` prefiksi uchun ommaviy o'qish siyosati (bucket policy)
2. **CORS** — sayt domenlaridan (`https://<domen>`, `http://localhost:3000`) `PUT`/`GET`/`HEAD` so'rovlariga ruxsat. CORS bo'lmasa brauzerda "blocked by CORS policy" xatosi chiqadi.

Ikkalasi ham bir martalik AWS SDK skripti orqali sozlangan (kodda saqlanmaydi, chunki bu bucket-darajasidagi sozlama). Yangi bucket yoki domen qo'shsangiz, shu ikkalasini qayta sozlash kerak.

## Loyiha tuzilishi

- `src/app/(site)` — ommaviy sahifalar: bosh sahifa, maqola, kategoriya, transferlar, qidiruv, kirish, ro'yxatdan o'tish
- `src/app/admin` — CMS: maqolalar/kategoriyalar/transferlar/izohlar/banner boshqaruvi
- `src/actions` — server actions (mutatsiyalar)
- `src/lib/queries.ts` — o'qish so'rovlari (server components uchun)
- `src/lib/s3.ts` — S3 upload/delete
- `prisma/schema.prisma` — ma'lumotlar modeli

## Funksiyalar

- Foydalanuvchilar email+parol yoki Google orqali ro'yxatdan o'tib, maqolalarga izoh qoldiradi
- Admin/editor har bir izohga (maqola sahifasida, kirgan holda) javob yozadi; `/admin/izohlar`da barcha izohlarni ko'rib, o'chirib turadi
- Qidiruv va transferlar filtri — yozgan/tanlagan zahoti (tugmasiz) natijani yangilaydi
- Saytning yagona reklama banneri `/admin/banner`dan boshqariladi: telefonlarda header ostida, planshet/kompyuterda o'ng tomonda ko'rinadi, rasm cover tarzda joylashadi

## Vercel'ga deploy

1. Repo'ni Vercel'ga import qiling
2. Environment Variables bo'limiga yuqoridagi barcha o'zgaruvchilarni kiriting
3. Build command: `next build` (standart) — `postinstall` avtomatik `prisma generate` ishga tushiradi
4. Birinchi deploydan keyin bir marta lokal yoki Vercel CLI orqali `npx prisma db push && npx prisma db seed` ishga tushiring (Neon bazasi allaqachon sozlangan bo'lsa, bu qadam shart emas)
5. Google login qo'shsangiz, Google Cloud Console'dagi OAuth client'ga production domeningizning `/api/auth/callback/google` manzilini "Authorized redirect URIs"ga qo'shishni unutmang
