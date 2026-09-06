/**
 * Profil aplikasi yang melengkapi `auth.users` Supabase. `id` sengaja sama persis
 * dengan `auth.users.id` (relasi satu-ke-satu), bukan primary key sendiri, supaya
 * tidak ada dua sumber kebenaran soal "siapa user ini".
 */
export interface User {
	id: string;
	name: string;
	phone: string | null;
	avatarUrl: string | null;
	createdAt: string;
}
