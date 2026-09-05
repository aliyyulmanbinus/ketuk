-- ============================================================================
-- RLS adalah jaring pengaman, bukan pelengkap. Asumsikan suatu saat ada bug di
-- query aplikasi yang lupa filter ownerId — policy di bawah ini yang membuat
-- bug itu tidak berbahaya, bukan cuma dokumentasi.
-- ============================================================================


-- ── profiles ──────────────────────────────────────────────────────────────
-- User hanya bisa baca dan ubah profilnya sendiri.
alter table profiles enable row level security;

create policy "profiles_select_own" on profiles
	for select using (auth.uid() = id);

create policy "profiles_insert_own" on profiles
	for insert with check (auth.uid() = id);

create policy "profiles_update_own" on profiles
	for update using (auth.uid() = id) with check (auth.uid() = id);

-- Tidak ada policy delete — hapus profil mengikuti hapus akun lewat Supabase Auth,
-- bukan lewat client langsung ke tabel ini.


-- ── events ────────────────────────────────────────────────────────────────
-- Owner akses penuh ke eventnya. Publik hanya SELECT event yang published.
-- Dua policy SELECT ini digabung OR oleh Postgres (multiple permissive policies).
alter table events enable row level security;

create policy "events_select_own" on events
	for select using (auth.uid() = owner_id);

create policy "events_select_published" on events
	for select using (is_published = true);

create policy "events_insert_own" on events
	for insert with check (auth.uid() = owner_id);

create policy "events_update_own" on events
	for update using (auth.uid() = owner_id) with check (auth.uid() = owner_id);

create policy "events_delete_own" on events
	for delete using (auth.uid() = owner_id);


-- ── invitations ───────────────────────────────────────────────────────────
-- Mengikuti event induknya: owner kelola penuh, publik baca kalau event published.
alter table invitations enable row level security;

create policy "invitations_select_published" on invitations
	for select using (
		exists (select 1 from events e where e.id = invitations.event_id and e.is_published = true)
	);

create policy "invitations_select_own" on invitations
	for select using (
		exists (select 1 from events e where e.id = invitations.event_id and e.owner_id = auth.uid())
	);

create policy "invitations_insert_own" on invitations
	for insert with check (
		exists (select 1 from events e where e.id = invitations.event_id and e.owner_id = auth.uid())
	);

create policy "invitations_update_own" on invitations
	for update
	using (exists (select 1 from events e where e.id = invitations.event_id and e.owner_id = auth.uid()))
	with check (exists (select 1 from events e where e.id = invitations.event_id and e.owner_id = auth.uid()));

create policy "invitations_delete_own" on invitations
	for delete using (
		exists (select 1 from events e where e.id = invitations.event_id and e.owner_id = auth.uid())
	);


-- ── guests ────────────────────────────────────────────────────────────────
-- Owner kelola penuh. SENGAJA TIDAK ADA policy UPDATE untuk publik — RSVP tamu
-- publik cuma boleh lewat fungsi submit_rsvp() (SECURITY DEFINER, lihat
-- functions.sql) yang memvalidasi input dan hanya mengubah kolom RSVP. Policy
-- UPDATE terbuka di sini akan memungkinkan siapa saja mengubah nama/data tamu lain.
alter table guests enable row level security;

create policy "guests_select_own" on guests
	for select using (
		exists (select 1 from events e where e.id = guests.event_id and e.owner_id = auth.uid())
	);

create policy "guests_insert_own" on guests
	for insert with check (
		exists (select 1 from events e where e.id = guests.event_id and e.owner_id = auth.uid())
	);

create policy "guests_update_own" on guests
	for update
	using (exists (select 1 from events e where e.id = guests.event_id and e.owner_id = auth.uid()))
	with check (exists (select 1 from events e where e.id = guests.event_id and e.owner_id = auth.uid()));

create policy "guests_delete_own" on guests
	for delete using (
		exists (select 1 from events e where e.id = guests.event_id and e.owner_id = auth.uid())
	);


-- ── wishes ────────────────────────────────────────────────────────────────
-- Siapa saja boleh INSERT kalau eventnya published, siapa saja boleh SELECT
-- (buku tamu publik). Hanya owner event yang boleh DELETE, untuk moderasi
-- ucapan yang tidak pantas.
alter table wishes enable row level security;

create policy "wishes_select_all" on wishes
	for select using (true);

create policy "wishes_insert_published_event" on wishes
	for insert with check (
		exists (select 1 from events e where e.id = wishes.event_id and e.is_published = true)
	);

create policy "wishes_delete_owner" on wishes
	for delete using (
		exists (select 1 from events e where e.id = wishes.event_id and e.owner_id = auth.uid())
	);


-- ── planner: budget_items, checklist_items, timeline_items ───────────────
-- Hanya owner event, tanpa akses publik sama sekali — data budget sensitif.
-- Satu policy "for all" per tabel karena aturannya sama untuk keempat operasi.
alter table budget_items enable row level security;
alter table checklist_items enable row level security;
alter table timeline_items enable row level security;

create policy "budget_items_owner_all" on budget_items
	for all
	using (exists (select 1 from events e where e.id = budget_items.event_id and e.owner_id = auth.uid()))
	with check (exists (select 1 from events e where e.id = budget_items.event_id and e.owner_id = auth.uid()));

create policy "checklist_items_owner_all" on checklist_items
	for all
	using (exists (select 1 from events e where e.id = checklist_items.event_id and e.owner_id = auth.uid()))
	with check (exists (select 1 from events e where e.id = checklist_items.event_id and e.owner_id = auth.uid()));

create policy "timeline_items_owner_all" on timeline_items
	for all
	using (exists (select 1 from events e where e.id = timeline_items.event_id and e.owner_id = auth.uid()))
	with check (exists (select 1 from events e where e.id = timeline_items.event_id and e.owner_id = auth.uid()));


-- ── vendors ───────────────────────────────────────────────────────────────
-- Publik baca yang is_active. Vendor yang punya akun kelola listingnya sendiri.
alter table vendors enable row level security;

create policy "vendors_select_active" on vendors
	for select using (is_active = true);

create policy "vendors_select_own" on vendors
	for select using (auth.uid() = owner_id);

create policy "vendors_insert_own" on vendors
	for insert with check (auth.uid() = owner_id);

create policy "vendors_update_own" on vendors
	for update using (auth.uid() = owner_id) with check (auth.uid() = owner_id);

create policy "vendors_delete_own" on vendors
	for delete using (auth.uid() = owner_id);


-- ── gift_products ─────────────────────────────────────────────────────────
-- Publik baca yang tersedia. Tidak ada policy insert/update/delete publik —
-- katalog produk dikelola lewat service role di tahap ini, bukan langsung
-- oleh vendor/client.
alter table gift_products enable row level security;

create policy "gift_products_select_available" on gift_products
	for select using (is_available = true);


-- ── gift_orders ───────────────────────────────────────────────────────────
-- Paling rumit: pembeli tidak punya akun (auth.uid() tidak berlaku untuk
-- mereka), jadi insert HANYA lewat service role dari backend
-- (services/gift-order.ts) — sengaja TIDAK ADA policy insert untuk
-- anon/authenticated sama sekali.
--
-- Owner event boleh melihat order yang masuk ke eventnya, tapi TANPA melihat
-- payment_id atau nomor HP pengirim (data yang lebih sensitif dari sekadar
-- "ada order masuk"). Karena RLS bekerja per-baris bukan per-kolom, cara yang
-- benar adalah lewat VIEW yang cuma mengekspos kolom aman, bukan lewat policy
-- SELECT di tabel gift_orders itu sendiri.
alter table gift_orders enable row level security;
-- Sengaja tidak ada satu pun policy di tabel ini untuk anon/authenticated —
-- akses langsung ke gift_orders cuma lewat service role (bypass RLS) atau
-- lewat view gift_orders_safe di bawah.

-- View ini SENGAJA TIDAK diberi `security_invoker = true` — dia jalan dengan
-- privilese pemilik view (yang bisa bypass RLS gift_orders), lalu keamanannya
-- ditegakkan manual lewat klausa `where e.owner_id = auth.uid()` di definisi
-- view ini sendiri. Ini pola standar Postgres untuk "expose kolom tertentu
-- saja dari tabel yang RLS-nya menutup semua akses langsung".
create or replace view gift_orders_safe as
select
	go.id,
	go.event_id,
	go.product_id,
	go.sender_name,
	go.recipient_name,
	go.recipient_address,
	go.quantity,
	go.total_amount,
	go.message,
	go.status,
	go.created_at
from gift_orders go
join events e on e.id = go.event_id
where e.owner_id = auth.uid();

grant select on gift_orders_safe to authenticated;


-- ── payments ──────────────────────────────────────────────────────────────
-- Tidak ada akses publik sama sekali. RLS aktif tanpa satu pun policy berarti
-- semua akses untuk anon/authenticated ditolak by default — hanya service role
-- (yang bypass RLS sepenuhnya) yang bisa baca/tulis tabel ini.
alter table payments enable row level security;
