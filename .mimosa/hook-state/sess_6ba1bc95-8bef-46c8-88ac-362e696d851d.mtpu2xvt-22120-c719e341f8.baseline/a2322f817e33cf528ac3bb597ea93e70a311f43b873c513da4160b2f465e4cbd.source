interface ConfirmState {
	open: boolean;
	title: string;
	message: string;
	confirmLabel: string;
	cancelLabel: string;
	danger: boolean;
}

const state = $state<ConfirmState>({
	open: false,
	title: '',
	message: '',
	confirmLabel: 'Ya, lanjutkan',
	cancelLabel: 'Batal',
	danger: false,
});

let pendingResolve: ((value: boolean) => void) | null = null;

/** Dibaca oleh `<ConfirmDialog />` global di root layout. */
export function getConfirmState(): ConfirmState {
	return state;
}

export interface ConfirmOptions {
	title: string;
	message: string;
	confirmLabel?: string;
	cancelLabel?: string;
	danger?: boolean;
}

/** Panggil `await confirmDialog({...})` dari mana saja — resolve `true` kalau user menekan konfirmasi. */
export function confirmDialog(options: ConfirmOptions): Promise<boolean> {
	return new Promise((resolve) => {
		state.open = true;
		state.title = options.title;
		state.message = options.message;
		state.confirmLabel = options.confirmLabel ?? 'Ya, lanjutkan';
		state.cancelLabel = options.cancelLabel ?? 'Batal';
		state.danger = options.danger ?? false;
		pendingResolve = resolve;
	});
}

export function resolveConfirm(value: boolean) {
	state.open = false;
	pendingResolve?.(value);
	pendingResolve = null;
}
