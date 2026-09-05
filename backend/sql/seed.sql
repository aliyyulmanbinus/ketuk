-- ============================================================================
-- Data awal untuk development & demo/screenshot. Vendor tanpa owner_id (null)
-- sengaja dibuat lebih dulu — vendors.owner_id nullable justru untuk kasus ini
-- (listing di-seed manual, belum ada akun vendor sungguhan).
--
-- Catatan: skema tahap ini tidak punya tabel "template undangan" tersendiri
-- (template adalah konsep tampilan di frontend, bukan baris database) — jadi
-- seed di bawah fokus ke vendor dan produk hadiah, dua entitas yang memang
-- ada tabelnya. Lihat laporan tahap ini untuk detail keputusan ini.
-- ============================================================================

insert into vendors (name, category, description, price_min, price_max, rating, review_count, is_verified, is_active, images, slug, city, phone)
values
	('Sari Rasa Catering', 'katering', 'Katering prasmanan dan nasi kotak untuk pernikahan hingga syukuran, spesialis masakan Nusantara.', 8000000, 45000000, 4.8, 132, true, true, '[]'::jsonb, 'sari-rasa-catering', 'Bandung', '081234567801'),
	('Bunga Dekorasi Nusantara', 'dekorasi', 'Dekorasi pelaminan modern dan tradisional, termasuk konsep outdoor garden party.', 12000000, 80000000, 4.7, 98, true, true, '[]'::jsonb, 'bunga-dekorasi-nusantara', 'Jakarta Selatan', '081234567802'),
	('Lensa Abadi Photography', 'fotografi', 'Fotografi pernikahan dan prewedding dengan gaya candid dan cinematic.', 5000000, 35000000, 4.9, 210, true, true, '[]'::jsonb, 'lensa-abadi-photography', 'Yogyakarta', '081234567803'),
	('Cahaya Gambar Videografi', 'videografi', 'Same day edit dan film dokumenter pernikahan, drone tersedia.', 7000000, 40000000, 4.6, 76, true, true, '[]'::jsonb, 'cahaya-gambar-videografi', 'Surabaya', '081234567804'),
	('Kebun Mawar Florist', 'florist', 'Bunga papan, buket, dan rangkaian meja untuk segala acara.', 500000, 8000000, 4.5, 64, false, true, '[]'::jsonb, 'kebun-mawar-florist', 'Bandung', '081234567805'),
	('Manis Kue & Bakery', 'kue', 'Kue pengantin custom, kue ulang tahun, dan hantaran manis.', 800000, 12000000, 4.7, 145, true, true, '[]'::jsonb, 'manis-kue-bakery', 'Jakarta Barat', '081234567806'),
	('Kenang Souvenir Kreasi', 'souvenir', 'Souvenir custom akrilik, gantungan kunci, dan mug untuk pernikahan dan ulang tahun.', 3000, 50000, 4.4, 88, false, true, '[]'::jsonb, 'kenang-souvenir-kreasi', 'Semarang', '081234567807'),
	('Bahagia Wedding Organizer', 'wo', 'Wedding organizer full service dari akad hingga resepsi.', 15000000, 150000000, 4.9, 187, true, true, '[]'::jsonb, 'bahagia-wedding-organizer', 'Jakarta Selatan', '081234567808'),
	('Ridho Pranata MC', 'mc', 'Pembawa acara pernikahan adat dan modern, dwibahasa.', 2000000, 8000000, 4.8, 92, true, true, '[]'::jsonb, 'ridho-pranata-mc', 'Bandung', '081234567809'),
	('Nada Rampak Hiburan', 'hiburan', 'Live music akustik, organ tunggal, dan hiburan anak untuk ulang tahun.', 3000000, 20000000, 4.5, 54, false, true, '[]'::jsonb, 'nada-rampak-hiburan', 'Yogyakarta', '081234567810'),
	('Wulan Ayu Make Up Artist', 'mua', 'Make up pengantin dan wisuda dengan teknik airbrush.', 1500000, 10000000, 4.9, 176, true, true, '[]'::jsonb, 'wulan-ayu-make-up-artist', 'Jakarta Selatan', '081234567811'),
	('Grand Puri Venue', 'venue', 'Gedung serbaguna kapasitas 500-1000 tamu dengan ballroom ber-AC.', 30000000, 120000000, 4.6, 61, true, true, '[]'::jsonb, 'grand-puri-venue', 'Bekasi', '081234567812'),
	('Cetak Undangan Bahagia', 'cetak_undangan', 'Cetak undangan fisik hardcover dan softcover, custom desain.', 5000, 75000, 4.3, 40, false, true, '[]'::jsonb, 'cetak-undangan-bahagia', 'Solo', '081234567813'),
	('Busana Pengantin Kirana', 'busana', 'Sewa dan jahit busana pengantin adat Jawa, Sunda, dan modern.', 4000000, 30000000, 4.7, 103, true, true, '[]'::jsonb, 'busana-pengantin-kirana', 'Yogyakarta', '081234567814'),
	('Armada Sewa Transport', 'transportasi', 'Sewa mobil pengantin klasik dan bus pariwisata untuk rombongan keluarga.', 1500000, 15000000, 4.4, 37, false, true, '[]'::jsonb, 'armada-sewa-transport', 'Jakarta Timur', '081234567815')
on conflict (slug) do nothing;

insert into gift_products (vendor_id, name, description, price, images, category, is_available)
values
	((select id from vendors where slug = 'manis-kue-bakery'), 'Hampers Manis Bahagia', 'Kotak hampers berisi kue kering, coklat, dan kartu ucapan.', 250000, '[]'::jsonb, 'hampers', true),
	((select id from vendors where slug = 'kebun-mawar-florist'), 'Buket Bunga Mawar Segar', 'Buket 12 tangkai mawar segar dengan kertas wrap premium.', 350000, '[]'::jsonb, 'bouquet', true),
	((select id from vendors where slug = 'kebun-mawar-florist'), 'Papan Bunga Ucapan Selamat', 'Papan bunga standing besar untuk ucapan selamat menikah/wisuda.', 750000, '[]'::jsonb, 'bouquet', true),
	((select id from vendors where slug = 'manis-kue-bakery'), 'Kue Tart Ucapan Selamat', 'Kue tart 20cm dengan tulisan custom sesuai pesanan.', 400000, '[]'::jsonb, 'kue', true),
	(null, 'Paket Nasi Kotak Syukuran', 'Nasi kotak untuk 10 orang, dikirim langsung ke lokasi acara.', 500000, '[]'::jsonb, 'makanan', true),
	((select id from vendors where slug = 'kenang-souvenir-kreasi'), 'Paket Souvenir Custom 50pcs', 'Gantungan kunci akrilik custom nama, minimal order 50 pcs.', 500000, '[]'::jsonb, 'souvenir', true),
	(null, 'Amplop Digital Rp 100.000', 'Kirim uang digital langsung ke rekening/e-wallet host.', 100000, '[]'::jsonb, 'uang_digital', true),
	(null, 'Amplop Digital Rp 250.000', 'Kirim uang digital langsung ke rekening/e-wallet host.', 250000, '[]'::jsonb, 'uang_digital', true),
	((select id from vendors where slug = 'sari-rasa-catering'), 'Parcel Buah & Snack Premium', 'Parcel buah segar dan snack premium untuk hantaran.', 450000, '[]'::jsonb, 'lainnya', true)
on conflict do nothing;
