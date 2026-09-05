# Prompt Ketuk.id untuk Claude Code

Empat file prompt yang dijalankan berurutan. Jangan lompat urutan — setiap file mengandalkan hasil file sebelumnya.

## Urutan eksekusi

| # | File | Isi | Perkiraan waktu |
|---|------|-----|-----------------|
| 1 | `00-MONOREPO.md` | Struktur monorepo, Bun workspaces, tooling, git config | 10–15 menit |
| 2 | `01-SHARED.md` | Package `shared` — types dan konstanta yang dipakai FE & BE | 10 menit |
| 3 | `02-BACKEND.md` | Drizzle schema, RLS, API Hono, integrasi Duitku | 45–60 menit |
| 4 | `03-FRONTEND.md` | SvelteKit, halaman publik, dashboard, Tailwind | 60–90 menit |

## Cara pakai

Buka terminal di folder kosong tempat kamu mau taruh project:

```bash
mkdir ketuk && cd ketuk
claude
```

Lalu di dalam sesi Claude Code, tempel isi `00-MONOREPO.md`. Tunggu selesai, cek hasilnya, commit manual. Baru lanjut ke file berikutnya.

Alternatif kalau kamu simpan file prompt di dalam project:

```bash
# Setelah file 00 selesai dan folder docs/prompts/ ada
claude "Baca docs/prompts/02-BACKEND.md dan kerjakan seluruh isinya."
```

## Aturan yang berlaku di semua file

Setiap prompt sudah memuat aturan ini, tapi penting kamu tahu:

**Claude Code tidak boleh commit atau push.** Semua operasi git dilakukan manual oleh kamu. Claude Code hanya menulis file, menjalankan build, dan menjalankan test.

**Jangan gabung dua file prompt dalam satu sesi.** Konteksnya terlalu besar dan hasilnya akan lebih dangkal. Jalankan satu per satu, review, commit, lanjut.

**Review sebelum commit.** Jalankan `git status` dan `git diff` untuk melihat apa yang dibuat. Kalau ada yang tidak sesuai, minta perbaikan sebelum commit.

## Alur git manual

Setelah setiap tahap selesai:

```bash
git status
git diff
bun run check          # pastikan tidak ada error TypeScript
git add .
git commit -m "chore: setup monorepo"    # sesuaikan pesannya
git push origin main
```

Pesan commit yang disarankan per tahap:

- Tahap 1 → `chore: setup monorepo structure and tooling`
- Tahap 2 → `feat(shared): add shared types and constants`
- Tahap 3 → `feat(backend): add database schema, API, and Duitku integration`
- Tahap 4 → `feat(frontend): add SvelteKit app with public and dashboard routes`

## Setup GitHub

Sebelum mulai, buat repo kosong di GitHub (jangan centang "Add README"), lalu:

```bash
git init
git branch -M main
git remote add origin git@github.com:USERNAME/ketuk.git
```

Push pertama dilakukan setelah tahap 1 selesai.

## Stack yang dipakai

- **Runtime & package manager** — Bun (workspaces)
- **Frontend** — SvelteKit + `adapter-node`, Tailwind CSS v4
- **Backend** — Hono, dijalankan di Node runtime
- **Database** — Supabase Postgres, Drizzle ORM, Row Level Security
- **Auth & Storage** — Supabase
- **Payment** — Duitku (QRIS, VA, e-wallet)
- **CDN** — Cloudflare di depan halaman undangan publik

## Catatan soal Bun

Bun dipakai sebagai package manager dan test runner, bukan sebagai runtime production. Backend dan frontend keduanya jalan di Node runtime saat deploy. Ini disengaja: `svelte-adapter-bun` masih community-maintained, dan aplikasi ini menangani pembayaran. Kecepatan `bun install` tetap kamu dapat tanpa menanggung risiko runtime.
