export interface ToastMessage {
	id: number;
	type: 'success' | 'error' | 'info';
	message: string;
}

const toasts = $state<ToastMessage[]>([]);
let nextId = 0;

/** Dipanggil dari komponen `<Toast />` di root layout untuk render daftar toast aktif. */
export function getToasts(): ToastMessage[] {
	return toasts;
}

export function pushToast(message: string, type: ToastMessage['type'] = 'info') {
	const id = nextId++;
	toasts.push({ id, type, message });
	setTimeout(() => dismissToast(id), 4000);
}

export function dismissToast(id: number) {
	const index = toasts.findIndex((t) => t.id === id);
	if (index !== -1) toasts.splice(index, 1);
}
