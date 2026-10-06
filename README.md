# BeautyShades

An Accra eyewear shop for frames, sunglasses, photochromic lenses, and lens care.


## Stack

- Next.js 15 (App Router)
- Prisma + PostgreSQL
- Framer Motion, Tailwind CSS 4

## Run locally

1. Start Postgres (mapped to host port **5433**, because 5432 is often taken):

```bash
docker compose up -d
```

2. Apply the schema and seed the catalog (~100 frames):

```bash
cp .env.example .env
npx prisma migrate dev --name init
npm run db:seed
```

3. Start the app:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). If port 3000 is already in use, Next.js will suggest another port.

## What is included

- Home: ticker, polaroid hero, category tiles, The Edit
- Gallery with category filters and pagination
- Product pages with stock, sale badges, add to bag
- Cookie cart + checkout that writes orders to Postgres
- Contact and prescription forms (saved in the database, WhatsApp handoff)
- Privacy, about, order confirmation
- Admin portal at `/admin` (password in `.env` as `ADMIN_PASSWORD`)

Default local login: **specswura-admin**
