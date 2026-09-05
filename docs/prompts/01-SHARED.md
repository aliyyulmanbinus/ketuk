# Tahap 2 — Package Shared

## Aturan wajib

**JANGAN menjalankan `git commit` atau `git push`.** Saya yang commit manual. Kamu boleh `git status` dan `git diff` saja.

**Pakai Bun**, bukan npm atau pnpm.

**Package ini tidak boleh punya dependency runtime selain Zod.** Ini package yang di-import frontend dan backend, jadi harus ringan dan bebas efek samping. Tidak ada import ke Supabase client, tidak ada import ke Drizzle, tidak ada akses environment variable.

---

## Konteks

Lanjutan dari tahap 1. Monorepo Ketuk.id sudah berdiri dengan workspace `frontend`, `backend`, dan `packages/shared`. Sekarang isi `packages/shared` dengan types, skema validasi, dan konstanta yang dipakai kedua sisi.

Baca `docs/ARCHITECTURE.md` lebih dulu supaya kamu paham pembagian tanggung jawabnya.

---

## Yang harus dibuat

### Struktur

```
packages/shared/
├── package.json
├── tsconfig.json
└── src/
    ├── index.ts              # barrel export
    ├── types/
    │   ├── event.ts
    │   ├── invitation.ts
    │   ├── guest.ts
    │   ├── planner.ts
    │   ├── vendor.ts
    │   ├── gift.ts
    │   ├── payment.ts
    │   └── user.ts
    ├── schemas/              # Zod schemas untuk validasi
    │   ├── event.ts
    │   ├── guest.ts
    │   ├── gift.ts
    │   └── payment.ts
    ├── constants/
    │   ├── event-types.ts
    │   ├── vendor-categories.ts
    │   ├── plans.ts
    │   └── payment-methods.ts
    └── utils/
        ├── format.ts
        ├── slug.ts
        └── date.ts
```

### Types

Definisikan tipe untuk seluruh domain. Ini yang minimal harus ada:

**Event.** Entitas pusat. Punya `id`, `slug`, `ownerId`, `type`, `title`, `date`, `timeStart`, `timeEnd`, `venue`, `location`, `locationUrl`, `coverImage`, `plan`, `isPublished`, `publishedAt`, `createdAt`, `updatedAt`.

`EventType` adalah union: `wedding`, `engagement`, `birthday`, `khitanan`, `aqiqah`, `reunion`, `corporate`, `syukuran`, `graduation`, `other`.

**Invitation.** Satu per event. Isinya data yang tampil di halaman undangan: nama mempelai atau tuan rumah, nama orang tua, teks pembuka dan penutup, URL musik, galeri foto, love story, dan `customData` bertipe `Record<string, unknown>` untuk field yang berbeda-beda per template.

Perhatikan bahwa tidak semua acara punya mempelai. Untuk ulang tahun atau corporate event, field `brideName` dan `groomName` tidak relevan. Rancang tipenya supaya ini tidak canggung — pertimbangkan discriminated union berdasarkan `EventType`, atau field opsional dengan `hostName` sebagai fallback universal.

**Guest.** Punya `rsvpStatus` (`pending` | `attending` | `not_attending`), `pax`, `guestGroup` (misalnya "Keluarga Mempelai Pria", "Teman Kantor"), dan `slug` untuk link personal per tamu (`ketuk.id/budi-sinta/tamu/abc123`).

**Planner.** Tiga tipe: `BudgetItem`, `ChecklistItem`, `TimelineItem`. Budget punya `estimated` dan `actual` dalam rupiah (integer, bukan float — hindari masalah presisi), plus `isPaid` dan `vendorId` opsional.

**Vendor.** Punya `category` dari union `VendorCategory`, `priceMin`, `priceMax`, `rating`, `reviewCount`, `isVerified`, dan array `images`.

**Gift.** `GiftProduct` (katalog) dan `GiftOrder` (transaksi). Order punya data pengirim, penerima, alamat, jumlah, total, pesan, dan status.

**Payment.** Tipe untuk transaksi Duitku: `PaymentTransaction` dengan `merchantOrderId`, `reference`, `amount`, `paymentMethod`, `status`, `paymentUrl`, `vaNumber`, `qrString`, `expiredAt`.

`PaymentStatus`: `pending` | `paid` | `expired` | `failed` | `refunded`.

**User.** Profil yang extend `auth.users` Supabase: `id`, `name`, `phone`, `avatarUrl`, `createdAt`.

Semua field uang bertipe `number` yang merepresentasikan **rupiah utuh sebagai integer**, bukan sen dan bukan float. Beri komentar di tipe yang relevan supaya tidak ada yang salah paham.

Semua timestamp bertipe `string` dalam format ISO 8601, bukan `Date`. Alasannya: tipe ini melintasi batas serialisasi JSON antara backend dan frontend, dan `Date` tidak selamat melewati itu.

### Zod schemas

Untuk setiap input yang datang dari user, buat skema validasi. Yang penting:

- `createEventSchema` dan `updateEventSchema`
- `rsvpSchema` — validasi nama, status, jumlah pax (min 1, max 10), pesan opsional
- `wishSchema` — nama dan pesan, dengan batas panjang wajar dan sanitasi dasar
- `createGiftOrderSchema` — termasuk validasi nomor HP Indonesia dan alamat
- `slugSchema` — hanya huruf kecil, angka, dan tanda hubung; panjang 3–50; tidak boleh berupa kata yang direservasi

Buat daftar slug yang direservasi supaya tidak bentrok dengan route aplikasi: `app`, `api`, `admin`, `dashboard`, `undangan`, `planner`, `vendor`, `hadiah`, `masuk`, `daftar`, `keluar`, `blog`, `docs`, `help`, `support`, `about`, `tentang`, `harga`, `pricing`, `www`, `mail`, `assets`, `static`, `cdn`.

Untuk validasi nomor HP Indonesia: terima format `08xxx`, `+628xxx`, dan `628xxx`. Normalisasi ke satu format di helper terpisah.

Export juga tipe hasil inferensi Zod (`z.infer<typeof schema>`) supaya tidak ada duplikasi definisi antara tipe manual dan skema.

### Konstanta

**`event-types.ts`** — array objek berisi `value`, `label` bahasa Indonesia, `emoji`, dan `defaultChecklist` (array template checklist yang otomatis dibuat saat event dibuat). Misalnya untuk `wedding`, checklist default mencakup booking venue, food tasting, fitting busana, meeting WO, dan seterusnya. Untuk `khitanan`, isinya berbeda.

Ini bukan sekadar daftar — ini yang membuat produk terasa dipikirkan. Buat checklist default yang benar-benar masuk akal untuk konteks Indonesia.

**`vendor-categories.ts`** — kategori dengan label Indonesia dan emoji: katering, dekorasi, fotografi, videografi, florist, kue, souvenir, WO, MC, hiburan, MUA, venue, cetak undangan, busana, transportasi.

**`plans.ts`** — tiga paket. Definisikan sebagai data terstruktur, bukan hardcode di UI:

- **Gratis** — Rp0, 1 undangan, template dasar, RSVP dan ucapan, maksimal 100 tamu, tanpa planner dan gift registry
- **Pro** — Rp99.000 per acara, semua template premium, tamu tanpa batas, RSVP, ucapan, galeri, amplop digital, musik latar, gift registry
- **Lengkap** — Rp249.000 per acara, semua fitur Pro plus planner lengkap, budget tracker, checklist, timeline, akses vendor marketplace, custom domain

Setiap plan punya `id`, `name`, `price`, `description`, dan `features` berupa array objek `{ label, included }` supaya UI bisa render daftar centang dan strip tanpa logika tambahan.

**`payment-methods.ts`** — metode pembayaran Duitku yang didukung, dengan kode resminya. Minimal: QRIS, BCA VA, BNI VA, BRI VA, Mandiri VA, Permata VA, OVO, ShopeePay, DANA. Sertakan `code`, `label`, `type` (`qris` | `va` | `ewallet`), dan `logo` (path ke asset, boleh placeholder).

Kode metode pembayaran harus sesuai dokumentasi Duitku. Kalau kamu tidak yakin kode persisnya, tulis komentar `// TODO: verifikasi kode dengan dokumentasi Duitku` dan pakai nilai yang paling masuk akal — jangan mengarang tanpa penanda.

### Utils

**`format.ts`** — `formatRupiah(amount)` yang menghasilkan `Rp1.250.000`, dan `formatRupiahShort(amount)` yang menghasilkan `Rp1,25jt` untuk tampilan ringkas. Keduanya pakai `Intl.NumberFormat` dengan locale `id-ID`.

**`slug.ts`** — `generateSlug(text)` yang mengubah "Budi & Sinta" jadi `budi-sinta`. Harus menangani karakter non-ASCII, spasi berlebih, dan tanda baca. Plus `generateUniqueSlug(base, existingSlugs)` yang menambahkan sufiks angka kalau bentrok.

**`date.ts`** — `formatEventDate(iso)` yang menghasilkan "Sabtu, 15 Maret 2027", `formatEventTime(time)`, dan `getCountdown(iso)` yang mengembalikan `{ days, hours, minutes, seconds, isPast }`. Semua pakai locale `id-ID` dan timezone Asia/Jakarta.

---

## Standar kualitas

Setiap tipe dan fungsi publik diberi komentar JSDoc singkat yang menjelaskan *kenapa*, bukan mengulang *apa*. Komentar seperti `/** ID event */` di atas field `eventId` tidak berguna. Komentar seperti `/** Rupiah utuh sebagai integer — jangan pakai float, presisi pecahan tidak dibutuhkan dan bikin bug */` berguna.

Barrel export di `src/index.ts` harus eksplisit, bukan `export * from`. Ini membuat lebih jelas apa yang jadi API publik package ini.

---

## Setelah selesai

1. Jalankan `bun run check` di root, pastikan tidak ada error TypeScript
2. Jalankan `bun run lint`, pastikan bersih
3. Tampilkan `git status`

Lalu berhenti dan laporkan. Sebutkan kalau ada keputusan desain yang kamu ambil sendiri, terutama soal bagaimana kamu menangani tipe `Invitation` untuk acara non-pernikahan. **Jangan commit.**
