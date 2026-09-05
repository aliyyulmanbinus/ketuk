import type { EventPlan } from '../types/event';

export interface PlanFeature {
	label: string;
	included: boolean;
}

export interface Plan {
	id: EventPlan;
	name: string;
	/** Rupiah utuh sebagai integer. Harga per acara, bukan langganan bulanan. */
	price: number;
	description: string;
	features: PlanFeature[];
}

export const PLANS: Plan[] = [
	{
		id: 'gratis',
		name: 'Gratis',
		price: 0,
		description: 'Untuk coba-coba dulu sebelum acara besar.',
		features: [
			{ label: '1 undangan digital', included: true },
			{ label: 'Template dasar', included: true },
			{ label: 'RSVP dan ucapan', included: true },
			{ label: 'Maksimal 100 tamu', included: true },
			{ label: 'Template premium', included: false },
			{ label: 'Galeri foto dan musik latar', included: false },
			{ label: 'Amplop digital', included: false },
			{ label: 'Planner dan budget tracker', included: false },
			{ label: 'Akses marketplace vendor', included: false },
		],
	},
	{
		id: 'pro',
		name: 'Pro',
		price: 99_000,
		description: 'Undangan digital lengkap tanpa batas tamu.',
		features: [
			{ label: 'Semua template premium', included: true },
			{ label: 'Tamu tanpa batas', included: true },
			{ label: 'RSVP dan ucapan', included: true },
			{ label: 'Galeri foto', included: true },
			{ label: 'Amplop digital', included: true },
			{ label: 'Musik latar', included: true },
			{ label: 'Gift registry', included: true },
			{ label: 'Planner dan budget tracker', included: false },
			{ label: 'Akses marketplace vendor', included: false },
		],
	},
	{
		id: 'lengkap',
		name: 'Lengkap',
		price: 249_000,
		description: 'Kelola seluruh persiapan acara dari satu tempat.',
		features: [
			{ label: 'Semua fitur Pro', included: true },
			{ label: 'Planner lengkap', included: true },
			{ label: 'Budget tracker', included: true },
			{ label: 'Checklist dan timeline', included: true },
			{ label: 'Akses marketplace vendor', included: true },
			{ label: 'Custom domain', included: true },
		],
	},
];
