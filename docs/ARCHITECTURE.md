# Arsitektur Ketuk.id

Dokumen ini menjelaskan keputusan arsitektur di balik struktur monorepo Ketuk.id, beserta alasan konkret di baliknya. Tujuannya bukan mendaftar folder, tapi menjelaskan mengapa sistem ini dibagi seperti ini.

## Pemisahan halaman publik dan aplikasi

Halaman undangan digital (`/[slug]`) adalah titik trafik paling tidak terduga di seluruh sistem. Pola penggunaannya khas: seorang host membuat undangan, lalu membagikan link itu ke satu atau beberapa grup WhatsApp keluarga besar. Begitu link itu di-blast, ratusan tamu bisa membuka halaman yang sama dalam rentang beberapa menit — sebuah lonjakan trafik yang datang tiba-tiba, terkonsentrasi pada satu slug, dan tidak berkorelasi dengan kapasitas server yang direncanakan untuk hari itu.

Karena itu, halaman undangan dirender di server (server-side rendering) dan di-cache secara agresif di edge Cloudflare. Isi undangan — nama pasangan, tanggal acara, lokasi, galeri foto — berubah jarang setelah dipublikasikan, sehingga sangat cocok untuk caching berumur panjang. Konsekuensinya, lonjakan trafik dari blast WhatsApp diserap sepenuhnya oleh cache di edge dan tidak pernah menyentuh database Supabase.

Bagian yang benar-benar dinamis pada halaman undangan — mengisi RSVP, menulis ucapan, mengirim hadiah — dipisahkan dari HTML yang di-cache. Bagian-bagian ini diambil lewat client-side fetch atau form action SvelteKit, yang selalu melewati origin server dan tidak ikut ter-cache. Dengan begitu, satu halaman bisa 99% statis-dan-cepat sementara tetap punya celah kecil untuk interaksi yang butuh data terkini.

```
Alur request halaman undangan:

┌─────────┐      ┌────────────┐      ┌───────────┐      ┌──────────┐
│ Browser │ ───▶ │ Cloudflare │ ───▶ │ SvelteKit │ ───▶ │ Supabase │
│  tamu   │      │   (cache)  │      │  (SSR)    │      │ Postgres │
└─────────┘      └────────────┘      └───────────┘      └──────────┘
                        │                                     ▲
                        │  cache HIT (kunjungan berikutnya)   │
                        └─────────────────────────────────────┘
                                  tidak menyentuh DB

Aksi dinamis (RSVP / ucapan / kirim hadiah):
┌─────────┐   fetch / form action    ┌───────────┐   query (RLS)   ┌──────────┐
│ Browser │ ────────────────────────▶│ SvelteKit │────────────────▶│ Supabase │
│  tamu   │◀──────────────────────── │  origin   │◀────────────────│ Postgres │
└─────────┘                          └───────────┘                 └──────────┘
   (melewati cache Cloudflare, selalu mengenai origin)
```

## Kenapa backend terpisah dari SvelteKit

SvelteKit sendiri mampu menangani API lewat `+server.ts`, dan untuk banyak aplikasi itu cukup. Ketuk.id sengaja tidak memakai pendekatan itu untuk semua logika, dan menempatkan sebagian besar logika sensitif di layanan Hono yang terpisah, dengan tiga alasan konkret.

Pertama, webhook Duitku butuh endpoint yang stabil secara alamat dan siklus hidup. Payment gateway menyimpan URL callback di sisi mereka dan memanggilnya kapan saja setelah transaksi dibuat — bisa detik berikutnya, bisa beberapa menit kemudian. Endpoint ini tidak boleh ikut redeploy, restart, atau berubah bentuk setiap kali frontend di-deploy ulang karena perubahan UI. Memisahkan backend berarti siklus rilis frontend dan siklus hidup endpoint pembayaran menjadi independen.

Kedua, logika pembayaran dan pemrosesan order vendor adalah kode yang paling perlu diuji secara terisolasi, tanpa terikat pada rendering UI atau siklus hidup permintaan halaman. Menaruhnya di layanan API terpisah membuat unit test dan integration test bisa berjalan tanpa perlu memuat SvelteKit sama sekali.

Ketiga, ini keputusan yang berorientasi ke depan: begitu ada mobile app atau dashboard khusus vendor, kedua klien tersebut butuh API yang sama persis dengan yang dipakai web app sekarang. Kalau logika itu tertanam di dalam route SvelteKit, ia harus diekstrak ulang nanti. Dengan backend Hono yang sudah berdiri sendiri sejak awal, klien baru tinggal memanggilnya.

## Pembagian tanggung jawab

Frontend memakai Supabase client langsung untuk dua hal: autentikasi, dan query data yang sudah diproteksi oleh Row Level Security. Ini valid karena Supabase client di browser hanya membawa anon key, dan RLS memastikan setiap query — meski dijalankan langsung dari klien — hanya bisa membaca dan menulis data yang memang menjadi hak pengguna yang sedang login.

Backend dipakai khusus untuk operasi yang butuh service role key atau mengandung logika yang tidak boleh dipercayakan ke klien: membuat transaksi ke Duitku, menerima dan memvalidasi callback pembayaran, memproses order hadiah setelah pembayaran sukses, dan mengirim notifikasi ke host maupun vendor. Semua operasi ini butuh privilese yang melampaui apa yang boleh dimiliki browser, atau butuh dipicu oleh pihak ketiga (Duitku) yang tidak melewati sesi Supabase pengguna.

## Multi-tenancy

Setiap event di Ketuk.id punya `slug` unik yang menjadi identitas publiknya. Isolasi data antar event dijamin di level database lewat Row Level Security, bukan lewat pengecekan `WHERE event_id = ...` yang ditambahkan manual di tiap query aplikasi.

Ini keputusan yang disengaja, bukan default yang kebetulan dipakai. Kalau isolasi data hanya bergantung pada logika aplikasi, satu query yang lupa menambahkan filter event bisa membocorkan data tamu, RSVP, atau transaksi hadiah dari satu event ke event lain. Dengan RLS sebagai penjamin di level database, bahkan kalau ada bug di query aplikasi — filter yang lupa ditambahkan, join yang salah — database tetap menolak mengembalikan baris yang bukan milik konteks yang sedang mengakses. RLS berfungsi sebagai jaring pengaman terakhir, bukan satu-satunya lapisan pertahanan.

## Kenapa Bun bukan runtime production

Bun dipakai di seluruh monorepo ini untuk instalasi dependency dan pengalaman development — `bun install` yang cepat, workspace filtering, dan test runner bawaan. Namun saat production, baik frontend maupun backend dijalankan di atas Node, bukan Bun.

Alasannya adalah risiko yang tidak sepadan dengan manfaatnya. Adapter Bun untuk SvelteKit (`svelte-adapter-bun`) masih dikelola komunitas, bukan proyek resmi SvelteKit, sehingga tidak punya jaminan stabilitas jangka panjang atau dukungan yang setara dengan `adapter-node`. Aplikasi ini menangani uang sungguhan — transaksi pembayaran lewat Duitku dan transaksi hadiah — sehingga stabilitas runtime production diprioritaskan di atas kecepatan eksperimental. Kecepatan `bun install` dan developer experience yang baik tetap didapat tanpa menanggung risiko itu di production.

```
Alur transaksi pembayaran:

┌──────────┐   1. buat transaksi   ┌─────────┐   2. request charge   ┌────────┐
│ Frontend │ ─────────────────────▶│ Backend │ ─────────────────────▶│ Duitku │
│(SvelteKit)│                      │  (Hono) │                       │        │
└──────────┘                       └─────────┘                       └────────┘
                                        ▲                                  │
                                        │        3. callback status       │
                                        └──────────────────────────────────┘
                                        │
                                        │ 4. update status transaksi
                                        ▼
                                   ┌──────────┐
                                   │ Supabase │
                                   │ Postgres │
                                   └──────────┘
```
