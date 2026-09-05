# Tahap 1 — Setup Monorepo Ketuk.id

## Aturan wajib

**JANGAN pernah menjalankan `git commit`, `git push`, `git tag`, atau operasi git yang mengubah history.** Semua commit dan push dilakukan manual oleh saya. Kamu boleh menjalankan `git init`, `git status`, dan `git diff` untuk inspeksi, tapi tidak lebih dari itu. Kalau kamu merasa sudah waktunya commit, cukup beri tahu saya file apa saja yang berubah — jangan lakukan sendiri.

**Jangan install dependency yang tidak diminta.** Kalau menurutmu ada package yang perlu tapi tidak disebut, tanya dulu.

**Pakai Bun sebagai package manager.** Semua perintah install pakai `bun install`, `bun add`, bukan npm atau pnpm.

---

## Konteks produk

Ketuk.id adalah platform modular untuk segala urusan acara di Indonesia — pernikahan, khitanan, aqiqah, ulang tahun, wisuda, reuni, syukuran, corporate event. Taglinenya: *Satu tempat untuk segala urusan acara.*

Empat modul yang bisa dibeli terpisah. User tidak dipaksa beli paket lengkap:

1. **Undangan** — buat dan sebar undangan digital, kelola RSVP
2. **Planner** — budget tracker, checklist, timeline, daftar tamu
3. **Vendor** — marketplace katering, dekorasi, fotografer, WO, MUA
4. **Hadiah** — kirim hampers, bouquet, kue ke penyelenggara acara

Ada dua tipe pengguna. **Host** yang mengadakan acara, dan **Guest** yang diundang. Guest bisa transaksi (kirim hadiah) tanpa punya akun. Ini penting untuk desain auth nanti.

---

## Yang harus kamu buat

### Struktur folder

```
ketuk/
├── frontend/                 # SvelteKit app
├── backend/                  # Hono API server
├── packages/
│   └── shared/               # Types & konstanta bersama
├── docs/
│   ├── prompts/              # File prompt tahap berikutnya
│   ├── ARCHITECTURE.md
│   └── DEVELOPMENT.md
├── .github/
│   └── workflows/
│       └── ci.yml
├── .gitignore
├── .editorconfig
├── .nvmrc
├── bunfig.toml
├── package.json              # root workspace
├── tsconfig.base.json
├── biome.json
├── .env.example
└── README.md
```

Untuk tahap ini, `frontend/` dan `backend/` cukup berisi `package.json` minimal plus `src/index.ts` placeholder. Isi sebenarnya dibuat di tahap 3 dan 4.

### Root `package.json`

Workspace Bun dengan script yang mendelegasikan ke sub-package:

```json
{
  "name": "ketuk",
  "private": true,
  "workspaces": ["frontend", "backend", "packages/*"],
  "scripts": {
    "dev": "bun run --filter '*' dev",
    "dev:fe": "bun run --filter frontend dev",
    "dev:be": "bun run --filter backend dev",
    "build": "bun run --filter '*' build",
    "check": "bun run --filter '*' check",
    "lint": "biome check .",
    "format": "biome format --write .",
    "db:generate": "bun run --filter backend db:generate",
    "db:migrate": "bun run --filter backend db:migrate",
    "db:studio": "bun run --filter backend db:studio"
  },
  "devDependencies": {
    "@biomejs/biome": "latest",
    "typescript": "latest"
  },
  "engines": { "node": ">=20" }
}
```

Sesuaikan kalau ada yang tidak jalan di versi Bun terbaru. Verifikasi `bun install` berhasil sebelum lanjut.

### `tsconfig.base.json`

Config ketat yang di-extend semua package:

- `strict: true`
- `noUncheckedIndexedAccess: true`
- `noUnusedLocals: true`
- `moduleResolution: "bundler"`
- `target: "ES2022"`
- `verbatimModuleSyntax: true`
- Path alias `@ketuk/shared` menunjuk ke `packages/shared/src`

### `.gitignore`

Harus mencakup: `node_modules`, `.svelte-kit`, `build`, `dist`, `.output`, `.env`, `.env.local`, `.env.*.local`, `*.log`, `.DS_Store`, `coverage`, `.turbo`, `bun.lockb` **tidak** di-ignore (lockfile harus ikut commit).

### `.env.example`

Isi semua variabel yang akan dibutuhkan, dengan komentar penjelas. Jangan pernah membuat file `.env` asli.

```bash
# ─── Supabase ───
PUBLIC_SUPABASE_URL=
PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=        # backend only, jangan pernah expose ke client
DATABASE_URL=                     # connection string Postgres untuk Drizzle

# ─── Duitku (payment gateway) ───
DUITKU_MERCHANT_CODE=
DUITKU_API_KEY=
DUITKU_ENV=sandbox                # sandbox | production
DUITKU_CALLBACK_URL=
DUITKU_RETURN_URL=

# ─── App ───
PUBLIC_APP_URL=http://localhost:5173
PUBLIC_API_URL=http://localhost:3000
BACKEND_PORT=3000
NODE_ENV=development

# ─── Cloudflare (opsional, untuk purge cache) ───
CLOUDFLARE_ZONE_ID=
CLOUDFLARE_API_TOKEN=
```

### `biome.json`

Linter dan formatter. Konfigurasi: indent tab, line width 100, single quote untuk JS/TS, semicolon selalu. Aktifkan rule `noUnusedImports` dan `useImportType`.

### `.github/workflows/ci.yml`

Workflow yang jalan di push dan pull request ke `main`:

1. Setup Bun (`oven-sh/setup-bun`)
2. `bun install --frozen-lockfile`
3. `bun run lint`
4. `bun run check`
5. `bun run build`

Jangan tambahkan step deploy. Deploy akan diatur belakangan.

### `docs/ARCHITECTURE.md`

Dokumen yang menjelaskan keputusan arsitektur, bukan sekadar daftar folder. Yang harus dibahas:

**Pemisahan halaman publik dan aplikasi.** Halaman undangan (`/[slug]`) di-render server-side dan di-cache agresif di Cloudflare. Alasannya konkret: setelah host blast undangan ke grup WhatsApp, ratusan tamu bisa membuka link dalam hitungan menit. Traffic spike seperti ini tidak boleh menyentuh database. Bagian dinamis — RSVP, ucapan, kirim hadiah — diambil client-side atau lewat form action, terpisah dari HTML yang di-cache.

**Kenapa backend terpisah dari SvelteKit.** SvelteKit sebenarnya bisa menangani API sendiri lewat `+server.ts`. Backend Hono terpisah dipilih karena: webhook Duitku butuh endpoint stabil yang tidak ikut berubah saat frontend redeploy; logika pembayaran dan order vendor perlu diuji terpisah dari UI; dan nanti kalau ada mobile app atau dashboard vendor, backend-nya sudah siap dipakai bersama.

**Pembagian tanggung jawab.** Frontend memakai Supabase client langsung untuk auth dan query yang sudah diproteksi RLS. Backend dipakai untuk hal yang butuh service role key atau logika sensitif: membuat transaksi Duitku, menerima callback pembayaran, memproses order hadiah, mengirim notifikasi.

**Multi-tenancy.** Setiap event punya `slug` unik. Isolasi data dijamin di level database lewat RLS, bukan di level aplikasi. Ini disengaja — kalau ada bug di query aplikasi, RLS tetap jadi jaring pengaman.

**Kenapa Bun bukan runtime production.** Bun dipakai untuk install dan development. Production jalan di Node. Adapter Bun untuk SvelteKit masih community-maintained, dan aplikasi ini menangani uang.

Tulis dengan kalimat utuh, bukan bullet satu kata. Sertakan diagram ASCII untuk alur request halaman undangan (browser → Cloudflare → SvelteKit → Supabase) dan alur pembayaran (frontend → backend → Duitku → callback → backend → database).

### `docs/DEVELOPMENT.md`

Panduan praktis untuk developer baru: prasyarat (Bun, Node 20+, akun Supabase, akun Duitku sandbox), cara setup dari clone sampai jalan, penjelasan tiap script, cara menjalankan migrasi database, dan konvensi commit yang dipakai (Conventional Commits).

Sertakan juga bagian **Alur Git** yang menegaskan bahwa commit dan push dilakukan manual, tidak lewat AI assistant.

### `README.md`

Ringkas saja. Deskripsi produk, badge tech stack, quick start tiga baris perintah, link ke `docs/ARCHITECTURE.md` dan `docs/DEVELOPMENT.md`, dan struktur folder tingkat atas. Jangan tulis ulang isi dokumen lain.

### `docs/prompts/`

Buat folder ini dan taruh placeholder `.gitkeep`. Saya akan mengisi file prompt tahap berikutnya sendiri.

---

## Setelah selesai

1. Jalankan `bun install` dan pastikan berhasil tanpa error
2. Jalankan `bun run lint` dan pastikan bersih
3. Jalankan `git init` kalau belum ada repo
4. Jalankan `git status` dan tampilkan hasilnya ke saya

Lalu berhenti. Laporkan file apa saja yang kamu buat dan apakah ada keputusan yang kamu ambil di luar spesifikasi ini. **Jangan commit.** Saya yang akan review dan commit manual.
