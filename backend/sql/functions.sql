-- ============================================================================
-- Trigger: set_updated_at()
-- Dipasang di semua tabel yang punya kolom updated_at, supaya kolom itu diurus
-- database, bukan aplikasi (aplikasi yang lupa set updatedAt tidak akan
-- menghasilkan data basi).
-- ============================================================================
create or replace function set_updated_at()
returns trigger
language plpgsql
as $$
begin
	new.updated_at = now();
	return new;
end;
$$;

create trigger set_updated_at before update on events
	for each row execute function set_updated_at();

create trigger set_updated_at before update on invitations
	for each row execute function set_updated_at();

create trigger set_updated_at before update on vendors
	for each row execute function set_updated_at();

create trigger set_updated_at before update on gift_products
	for each row execute function set_updated_at();

create trigger set_updated_at before update on gift_orders
	for each row execute function set_updated_at();

create trigger set_updated_at before update on payments
	for each row execute function set_updated_at();


-- ============================================================================
-- Fungsi: submit_rsvp(guest_slug, event_slug, status, pax, message)
-- SECURITY DEFINER supaya bisa mengubah kolom RSVP tanpa perlu policy UPDATE
-- terbuka di tabel guests (yang akan memungkinkan orang mengubah data tamu lain).
-- Ini satu-satunya jalan tamu publik mengubah status RSVP-nya sendiri.
-- ============================================================================
create or replace function submit_rsvp(
	p_guest_slug text,
	p_event_slug text,
	p_status text,
	p_pax integer,
	p_message text default null
)
returns void
language plpgsql
security definer
set search_path = public
as $$
declare
	v_event_id uuid;
	v_guest_id uuid;
begin
	if p_status not in ('attending', 'not_attending') then
		raise exception 'Status RSVP tidak valid: %', p_status;
	end if;

	if p_pax < 1 or p_pax > 10 then
		raise exception 'Jumlah pax harus antara 1 dan 10';
	end if;

	select id into v_event_id
	from events
	where slug = p_event_slug and is_published = true;

	if v_event_id is null then
		raise exception 'Event tidak ditemukan atau belum dipublish';
	end if;

	select id into v_guest_id
	from guests
	where event_id = v_event_id and slug = p_guest_slug;

	if v_guest_id is null then
		raise exception 'Tamu tidak ditemukan';
	end if;

	update guests
	set
		rsvp_status = p_status::rsvp_status,
		pax = p_pax,
		message = p_message,
		responded_at = now()
	where id = v_guest_id;
end;
$$;

grant execute on function submit_rsvp(text, text, text, integer, text) to anon, authenticated;


-- ============================================================================
-- Fungsi: increment_event_view(event_slug)
-- SECURITY DEFINER supaya statistik tampilan bisa naik tanpa policy UPDATE
-- publik yang terbuka di tabel events (yang berisiko dipakai untuk mengubah
-- kolom lain juga kalau policy-nya kebablasan).
-- ============================================================================
create or replace function increment_event_view(p_event_slug text)
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
	update events
	set view_count = view_count + 1
	where slug = p_event_slug and is_published = true;
end;
$$;

grant execute on function increment_event_view(text) to anon, authenticated;


-- ============================================================================
-- Fungsi: create_default_checklist(event_id, event_type)
-- Mengisi checklist awal saat event dibuat. Daftar template di bawah HARUS
-- tetap sinkron manual dengan EVENT_TYPE_CONFIGS di
-- packages/shared/src/constants/event-types.ts — SQL tidak bisa import
-- langsung dari TypeScript, jadi ini satu-satunya tempat yang perlu diingat
-- untuk diupdate kalau daftar checklist default di shared berubah.
-- ============================================================================
create or replace function create_default_checklist(p_event_id uuid, p_event_type event_type)
returns void
language plpgsql
security definer
set search_path = public
as $$
declare
	v_templates jsonb;
	v_item jsonb;
	v_event_date date;
begin
	select date into v_event_date from events where id = p_event_id;

	v_templates := case p_event_type
		when 'wedding' then '[
			{"title": "Survei dan booking venue", "daysBeforeEvent": 180},
			{"title": "Booking wedding organizer (WO)", "daysBeforeEvent": 150},
			{"title": "Food tasting catering", "daysBeforeEvent": 120},
			{"title": "Fitting busana pengantin", "daysBeforeEvent": 90},
			{"title": "Booking fotografer & videografer", "daysBeforeEvent": 90},
			{"title": "Cetak dan sebar undangan", "daysBeforeEvent": 60},
			{"title": "Meeting dekorasi dan konsep acara", "daysBeforeEvent": 45},
			{"title": "Fitting busana kedua", "daysBeforeEvent": 30},
			{"title": "Konfirmasi jumlah tamu final ke catering", "daysBeforeEvent": 14},
			{"title": "Gladi resik", "daysBeforeEvent": 1}
		]'::jsonb
		when 'engagement' then '[
			{"title": "Tentukan tanggal dan lokasi lamaran", "daysBeforeEvent": 60},
			{"title": "Siapkan seserahan", "daysBeforeEvent": 30},
			{"title": "Booking dekorasi dan catering ringan", "daysBeforeEvent": 21},
			{"title": "Konfirmasi daftar tamu kedua keluarga", "daysBeforeEvent": 14},
			{"title": "Booking fotografer", "daysBeforeEvent": 14}
		]'::jsonb
		when 'birthday' then '[
			{"title": "Tentukan tema dan konsep acara", "daysBeforeEvent": 30},
			{"title": "Booking venue atau dekorasi rumah", "daysBeforeEvent": 21},
			{"title": "Pesan kue ulang tahun", "daysBeforeEvent": 14},
			{"title": "Sebar undangan", "daysBeforeEvent": 14},
			{"title": "Siapkan games dan hiburan", "daysBeforeEvent": 7},
			{"title": "Konfirmasi jumlah tamu final", "daysBeforeEvent": 3}
		]'::jsonb
		when 'khitanan' then '[
			{"title": "Booking dokter atau mantri sunat", "daysBeforeEvent": 30},
			{"title": "Tentukan venue (rumah atau gedung)", "daysBeforeEvent": 21},
			{"title": "Booking catering dan tenda", "daysBeforeEvent": 14},
			{"title": "Sebar undangan ke keluarga dan tetangga", "daysBeforeEvent": 10},
			{"title": "Siapkan baju koko dan perlengkapan anak", "daysBeforeEvent": 7},
			{"title": "Konfirmasi hiburan (mis. marawis atau rebana)", "daysBeforeEvent": 7}
		]'::jsonb
		when 'aqiqah' then '[
			{"title": "Pesan kambing aqiqah ke penyedia", "daysBeforeEvent": 14},
			{"title": "Tentukan tanggal sesuai kalender Hijriah", "daysBeforeEvent": 14},
			{"title": "Booking catering untuk olahan daging", "daysBeforeEvent": 10},
			{"title": "Undang ustadz untuk doa dan cukur rambut", "daysBeforeEvent": 7},
			{"title": "Sebar undangan ke keluarga", "daysBeforeEvent": 7},
			{"title": "Siapkan paket daging untuk dibagikan", "daysBeforeEvent": 2}
		]'::jsonb
		when 'reunion' then '[
			{"title": "Bentuk panitia kecil", "daysBeforeEvent": 60},
			{"title": "Tentukan venue dan tanggal", "daysBeforeEvent": 45},
			{"title": "Buat grup dan sebar undangan digital", "daysBeforeEvent": 30},
			{"title": "Konfirmasi jumlah peserta dan biaya patungan", "daysBeforeEvent": 14},
			{"title": "Booking catering/venue final", "daysBeforeEvent": 10},
			{"title": "Siapkan dokumentasi dan games nostalgia", "daysBeforeEvent": 7}
		]'::jsonb
		when 'corporate' then '[
			{"title": "Tentukan tujuan dan tema acara", "daysBeforeEvent": 60},
			{"title": "Booking venue dan MC", "daysBeforeEvent": 45},
			{"title": "Siapkan rundown acara", "daysBeforeEvent": 30},
			{"title": "Sebar undangan ke internal dan eksternal", "daysBeforeEvent": 21},
			{"title": "Koordinasi sponsor/vendor pendukung", "daysBeforeEvent": 14},
			{"title": "Gladi bersih rundown", "daysBeforeEvent": 2}
		]'::jsonb
		when 'syukuran' then '[
			{"title": "Tentukan tanggal dan tujuan syukuran", "daysBeforeEvent": 21},
			{"title": "Booking catering (nasi kotak atau prasmanan)", "daysBeforeEvent": 14},
			{"title": "Undang tetangga dan kerabat", "daysBeforeEvent": 10},
			{"title": "Siapkan tumpeng dan doa bersama", "daysBeforeEvent": 3}
		]'::jsonb
		when 'graduation' then '[
			{"title": "Konfirmasi jadwal wisuda kampus/sekolah", "daysBeforeEvent": 30},
			{"title": "Booking fotografer untuk sesi wisuda", "daysBeforeEvent": 21},
			{"title": "Pesan bunga dan buket wisuda", "daysBeforeEvent": 7},
			{"title": "Rencanakan syukuran kecil setelahnya", "daysBeforeEvent": 7},
			{"title": "Sebar undangan ke keluarga", "daysBeforeEvent": 7}
		]'::jsonb
		else '[
			{"title": "Tentukan konsep dan tanggal acara", "daysBeforeEvent": 30},
			{"title": "Booking venue", "daysBeforeEvent": 21},
			{"title": "Sebar undangan", "daysBeforeEvent": 14},
			{"title": "Konfirmasi jumlah tamu", "daysBeforeEvent": 3}
		]'::jsonb
	end;

	for v_item in select * from jsonb_array_elements(v_templates)
	loop
		insert into checklist_items (event_id, title, due_date)
		values (
			p_event_id,
			v_item->>'title',
			case
				when v_event_date is null then null
				else v_event_date - (v_item->>'daysBeforeEvent')::integer
			end
		);
	end loop;
end;
$$;

grant execute on function create_default_checklist(uuid, event_type) to authenticated, service_role;
