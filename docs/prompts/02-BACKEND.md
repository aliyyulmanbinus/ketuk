# Tahap 3 — Backend Ketuk.id

## Aturan wajib

**JANGAN menjalankan `git commit`, `git push`, atau operasi git yang mengubah history.** Saya commit manual setelah review. Kamu boleh `git status` dan `git diff`.

**JANGAN menjalankan migrasi ke database production.** Kamu boleh generate file migrasi, tapi tidak menjalankannya. Saya yang eksekusi.

**JANGAN membuat file `.env` asli.** Hanya `.env.example`.

**Pakai Bun** untuk semua perintah package management.

**Jangan mengarang kode metode pembayaran atau format request Duitku.** Kalau tidak yakin, tulis komentar `// TODO: verifikasi dengan dokumentasi Duitku` dan pakai nilai paling masuk akal.

---

## Konteks

Monorepo Ketuk.id sudah berdiri. Package `@ketuk/shared` sudah berisi types, Zod schemas, dan konstanta. Sekarang bangun `backend/`.

Baca dulu:
- `docs/ARCHITECTURE.md` untuk memahami pembagian tanggung jawab
- `packages/shared/src/index.ts` untuk melihat tipe yang tersedia

**Jangan mendefinisikan ulang tipe yang sudah ada di shared.** Import dari `@ketuk/shared`.

---

## Prinsip yang harus dipegang

**RLS adalah jaring pengaman, bukan pelengkap.** Setiap tabel yang menyimpan data user harus punya Row Level Security aktif dengan policy eksplisit. Asumsikan suatu saat ada bug di query aplikasi yang lupa filter `ownerId`. RLS harus membuat bug itu tidak berbahaya. Jangan pernah menulis policy `USING (true)` untuk operasi tulis kecuali memang disengaja dan diberi komentar alasannya.

**Service role key tidak boleh bocor.** Key ini melewati RLS sepenuhnya. Hanya dipakai di backend, hanya untuk operasi yang memang butuh, dan tidak pernah masuk ke response.

**Guest bisa transaksi tanpa akun.** Orang yang menerima undangan bisa RSVP, menulis ucapan, dan mengirim hadiah tanpa mendaftar. Ini keputusan produk yang disengaja karena memaksa registrasi akan membunuh conversion. Konsekuensinya: beberapa endpoint harus publik tapi tetap terlindungi dari penyalahgunaan lewat rate limiting dan validasi ketat.

**Uang tidak boleh dipercayakan ke client.** Jumlah pembayaran selalu dihitung ulang di server dari harga yang tersimpan di database. Jangan pernah menerima `amount` dari request body sebagai kebenaran.

---

## Yang harus dibuat

### Struktur

```
backend/
├── package.json
├── tsconfig.json
├── drizzle.config.ts
├── src/
│   ├── index.ts                  # entry point Hono
│   ├── env.ts                    # validasi env dengan Zod
│   ├── db/
│   │   ├── index.ts              # koneksi Drizzle
│   │   ├── schema/
│   │   │   ├── index.ts
│   │   │   ├── profiles.ts
│   │   │   ├── events.ts
│   │   │   ├── invitations.ts
│   │   │   ├── guests.ts
│   │   │   ├── wishes.ts
│   │   │   ├── planner.ts
│   │   │   ├── vendors.ts
│   │   │   ├── gifts.ts
│   │   │   └── payments.ts
│   │   └── relations.ts
│   ├── routes/
│   │   ├── index.ts
│   │   ├── events.ts
│   │   ├── guests.ts
│   │   ├── planner.ts
│   │   ├── vendors.ts
│   │   ├── gifts.ts
│   │   ├── payments.ts
│   │   └── webhooks.ts
│   ├── services/
│   │   ├── duitku.ts
│   │   ├── event.ts
│   │   ├── gift-order.ts
│   │   └── cache.ts              # purge Cloudflare
│   ├── middleware/
│   │   ├── auth.ts
│   │   ├── rate-limit.ts
│   │   └── error.ts
│   └── lib/
│       ├── supabase.ts
│       ├── errors.ts
│       └── response.ts
├── migrations/                   # hasil drizzle-kit generate
└── sql/
    ├── rls-policies.sql
    ├── functions.sql
    └── seed.sql
```

### Dependencies

Install lewat `bun add` di workspace backend: `hono`, `@hono/node-server`, `drizzle-orm`, `postgres`, `@supabase/supabase-js`, `zod`. Dev: `drizzle-kit`, `@types/node`, `tsx`.

### Drizzle schema

Terjemahkan tipe dari `@ketuk/shared` menjadi tabel Postgres. Yang perlu diperhatikan:

**Enum Postgres.** Buat enum native untuk `event_type`, `rsvp_status`, `vendor_category`, `gift_category`, `order_status`, `payment_status`, `plan_type`. Jangan pakai text dengan check constraint — enum lebih ekspresif dan Drizzle menanganinya dengan baik.

**Uang sebagai integer.** Kolom harga pakai `integer`, merepresentasikan rupiah utuh. Beri komentar di schema.

**Timestamp dengan timezone.** Semua pakai `timestamptz`, default `now()`. Kolom `updatedAt` diurus lewat trigger, bukan aplikasi.

**Index yang benar-benar dipakai.** Jangan bikin index asal. Yang jelas dibutuhkan:
- `events.slug` unique — dipakai setiap load halaman undangan
- `events.owner_id` — dipakai di dashboard
- `guests(event_id, slug)` composite — untuk link personal tamu
- `guests.event_id` — untuk daftar tamu dan agregasi RSVP
- `wishes.event_id` dengan `created_at desc` — untuk feed ucapan
- `vendors.category` dan `vendors.slug`
- `payments.merchant_order_id` unique — dipakai saat callback Duitku masuk
- `gift_orders.event_id`

**Foreign key dengan `onDelete` yang dipikirkan.** Hapus event harus menghapus undangan, tamu, ucapan, dan item planner (`cascade`). Tapi hapus vendor tidak boleh menghapus riwayat order (`restrict` atau `set null`). Pikirkan tiap relasi, jangan default `cascade` semua.

**Kolom tambahan yang belum ada di shared types tapi dibutuhkan database:**
- `events.published_at` — untuk tahu kapan pertama kali dipublish
- `events.view_count` — statistik sederhana untuk host
- `payments.raw_callback` bertipe `jsonb` — simpan payload callback mentah dari Duitku untuk audit dan debugging
- `gift_orders.payment_id` — relasi ke tabel payments

### RLS policies

Tulis di `sql/rls-policies.sql`, dengan komentar yang menjelaskan tiap policy.

Prinsipnya:

**`profiles`** — user hanya bisa baca dan ubah profilnya sendiri.

**`events`** — owner punya akses penuh ke eventnya. Publik hanya bisa `SELECT` event yang `is_published = true`. Tidak ada policy insert/update/delete untuk publik.

**`invitations`** — mengikuti event induknya. Owner event bisa mengelola, publik bisa baca kalau eventnya published.

**`guests`** — owner bisa mengelola penuh. Untuk RSVP publik, jangan buka policy `UPDATE` bebas. Sebaliknya, buat fungsi Postgres `submit_rsvp(guest_slug, event_slug, status, pax, message)` dengan `SECURITY DEFINER` yang memvalidasi input dan hanya mengubah kolom RSVP. Ini jauh lebih aman daripada policy update terbuka yang memungkinkan orang mengubah nama tamu lain.

**`wishes`** — siapa saja boleh `INSERT` kalau eventnya published. Siapa saja boleh `SELECT`. Hanya owner event yang boleh `DELETE` (untuk moderasi ucapan tidak pantas).

**Tabel planner (`budget_items`, `checklist_items`, `timeline_items`)** — hanya owner event, tanpa akses publik sama sekali. Data budget bersifat sensitif.

**`vendors`** — publik bisa baca yang `is_active`. Vendor yang punya akun bisa mengelola listing sendiri.

**`gift_products`** — publik bisa baca yang tersedia.

**`gift_orders`** — ini yang paling rumit. Pembeli tidak punya akun, jadi tidak bisa pakai `auth.uid()`. Owner event boleh melihat order yang ditujukan ke eventnya, tapi **tanpa** melihat detail pembayaran. Buat view terpisah yang mengekspos kolom aman saja. Insert dilakukan lewat backend dengan service role, bukan dari client.

**`payments`** — tidak ada akses publik sama sekali. Hanya service role.

Tulis juga di `sql/functions.sql`:
- Trigger `set_updated_at()` untuk semua tabel yang punya kolom itu
- Fungsi `submit_rsvp()` seperti dijelaskan di atas
- Fungsi `increment_event_view(event_slug)` untuk statistik, dengan `SECURITY DEFINER`
- Fungsi `create_default_checklist(event_id, event_type)` yang mengisi checklist awal berdasarkan jenis acara, mengambil dari data yang sama dengan konstanta di shared

### Validasi environment

`src/env.ts` memvalidasi semua variabel yang dibutuhkan saat startup pakai Zod. Kalau ada yang hilang, aplikasi harus **gagal langsung dengan pesan jelas**, bukan crash belakangan saat request pertama masuk. Sertakan nama variabel yang hilang di pesan error.

### API routes

Semua endpoint diawali `/api`. Response konsisten dalam bentuk:

```ts
{ success: true, data: T }
// atau
{ success: false, error: { code: string, message: string, details?: unknown } }
```

Buat helper di `src/lib/response.ts` supaya tidak ada yang menulis bentuk response manual.

**Events** (`/api/events`) — CRUD event milik user yang login. Endpoint publish yang memvalidasi kelengkapan data sebelum mengizinkan publish (event tanpa tanggal atau lokasi tidak boleh dipublish). Endpoint publik `GET /api/events/:slug` untuk halaman undangan.

**Guests** (`/api/events/:eventId/guests`) — CRUD tamu, import massal dari CSV, generate link personal, dan endpoint agregasi statistik RSVP. Plus endpoint publik `POST /api/rsvp` yang memanggil fungsi Postgres tadi.

**Planner** (`/api/events/:eventId/planner`) — CRUD budget, checklist, timeline. Endpoint ringkasan yang mengembalikan total estimasi, total aktual, dan progress checklist dalam satu request supaya dashboard tidak perlu tiga panggilan.

**Vendors** (`/api/vendors`) — listing dengan filter kategori, lokasi, dan rentang harga. Pagination pakai cursor, bukan offset — offset jadi lambat kalau data banyak.

**Gifts** (`/api/gifts`) — katalog produk dan pembuatan order. Pembuatan order harus menghitung total di server dari harga produk di database.

**Payments** (`/api/payments`) — buat transaksi Duitku, cek status.

**Webhooks** (`/api/webhooks/duitku`) — terima callback pembayaran.

### Integrasi Duitku

Ini bagian paling sensitif. Buat di `src/services/duitku.ts`.

**Signature.** Duitku memakai MD5 untuk request transaksi dan callback. Formatnya berbeda antara keduanya. Untuk request pembuatan transaksi, signature dihitung dari gabungan merchant code, merchant order id, jumlah, dan API key. Untuk callback, dari merchant code, jumlah, merchant order id, dan API key. Implementasikan keduanya sebagai fungsi terpisah dengan nama jelas, jangan digabung.

**Verifikasi callback wajib.** Setiap callback yang masuk harus diverifikasi signature-nya sebelum diproses. Callback dengan signature tidak valid dicatat ke log dan ditolak dengan status 400. Jangan pernah memproses callback tanpa verifikasi — ini vektor serangan langsung ke sistem pembayaran.

**Idempoten.** Duitku bisa mengirim callback yang sama lebih dari sekali. Sebelum memproses, cek apakah `merchant_order_id` sudah berstatus `paid`. Kalau sudah, balas 200 tanpa melakukan apa-apa. Tanpa ini, order hadiah bisa terkirim dua kali.

**Simpan payload mentah.** Setiap callback disimpan ke kolom `raw_callback` bertipe jsonb sebelum diproses. Kalau ada sengketa atau bug, ini satu-satunya sumber kebenaran.

**Balas cepat.** Callback handler harus membalas 200 secepat mungkin. Pekerjaan berat (kirim notifikasi, panggil vendor) dilakukan setelah response terkirim, bukan sebelumnya.

**Sandbox dan production.** Base URL berbeda. Baca dari env `DUITKU_ENV`, jangan hardcode.

Buat juga tipe untuk request dan response Duitku, jangan pakai `any`.

### Middleware

**Auth** — verifikasi JWT Supabase dari header `Authorization: Bearer`. Kalau valid, isi `c.set('user', ...)`. Buat dua varian: `requireAuth` yang menolak kalau tidak ada token, dan `optionalAuth` yang meneruskan tapi user bisa null.

**Rate limit** — endpoint publik (RSVP, ucapan, buat order) harus dibatasi. Implementasi in-memory cukup untuk sekarang, tapi buat abstraksinya supaya nanti gampang diganti Redis. Batas yang masuk akal: 10 request per menit per IP untuk RSVP dan ucapan, 5 per menit untuk pembuatan order.

**Error handler** — tangkap semua error, format ke bentuk response standar, log yang perlu. Jangan pernah membocorkan stack trace atau pesan error database ke client di production. Buat kelas error kustom di `src/lib/errors.ts`: `NotFoundError`, `ValidationError`, `UnauthorizedError`, `ForbiddenError`, `PaymentError`.

### Cache invalidation

`src/services/cache.ts` berisi fungsi untuk purge cache Cloudflare saat undangan diubah. Dipanggil setelah update invitation atau publish event. Kalau env Cloudflare tidak diisi, fungsi ini no-op dengan log peringatan, bukan error — supaya development lokal tidak terganggu.

### Seed data

`sql/seed.sql` berisi data awal untuk development: beberapa vendor contoh dari berbagai kategori dengan nama Indonesia yang wajar, produk hadiah, dan template undangan. Jangan pakai nama placeholder seperti "Vendor 1" — pakai nama yang terasa nyata seperti "Sari Rasa Catering" atau "Lensa Abadi Photography". Ini akan dipakai untuk demo dan screenshot.

---

## Standar kualitas

Jangan pakai `any`. Kalau tipenya benar-benar tidak diketahui, pakai `unknown` dan persempit.

Setiap route handler memvalidasi input dengan Zod schema dari shared. Tidak ada yang mengakses `c.req.json()` langsung tanpa validasi.

Query database yang mengembalikan banyak baris harus punya batas. Tidak ada `SELECT *` tanpa limit.

Fungsi yang menyentuh uang atau pembayaran diberi komentar yang menjelaskan alurnya. Ini kode yang akan dibaca orang lain saat ada masalah, dan biasanya dalam keadaan panik.

---

## Setelah selesai

1. `bun run check` — tidak boleh ada error TypeScript
2. `bun run lint` — harus bersih
3. `bun run db:generate` — pastikan file migrasi tergenerate tanpa error
4. Tampilkan `git status`

Lalu berhenti dan laporkan:
- File apa saja yang dibuat
- Keputusan desain yang kamu ambil sendiri, terutama soal RLS policy untuk `gift_orders`
- Bagian mana dari integrasi Duitku yang perlu saya verifikasi manual dengan dokumentasi resmi

**Jangan commit. Jangan jalankan migrasi.**
