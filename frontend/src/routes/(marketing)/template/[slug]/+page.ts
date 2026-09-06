import { error } from '@sveltejs/kit';
import { TEMPLATES } from '$lib/data/templates';
import type { PageLoad } from './$types';

export const load: PageLoad = ({ params }) => {
	const template = TEMPLATES.find((t) => t.slug === params.slug);

	if (!template) {
		// Fallback to the first template if not found or throw 404
		const fallback = TEMPLATES[0];
		if (fallback) return { template: fallback };
		throw error(404, 'Desain undangan tidak ditemukan');
	}

	return {
		template,
	};
};
