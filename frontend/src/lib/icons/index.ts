import {
	Baby,
	Building2,
	Cake,
	CalendarDays,
	Camera,
	Car,
	ClipboardList,
	Flower,
	Flower2,
	Gift,
	GraduationCap,
	HandHeart,
	Heart,
	type Icon as IconType,
	Landmark,
	Mic2,
	Moon,
	Music2,
	Palette,
	PartyPopper,
	Printer,
	Shirt,
	Sparkle,
	Tag,
	UtensilsCrossed,
	Video,
} from '@lucide/svelte';

export type IconComponent = typeof IconType;

const eventIconMap: Record<string, IconComponent> = {
	wedding: Heart,
	engagement: Flower2,
	birthday: Cake,
	khitanan: Moon,
	aqiqah: Baby,
	reunion: PartyPopper,
	corporate: Building2,
	syukuran: HandHeart,
	graduation: GraduationCap,
};

export function getEventIcon(type: string | undefined): IconComponent {
	if (!type) return CalendarDays;
	return eventIconMap[type] ?? CalendarDays;
}

const vendorIconMap: Record<string, IconComponent> = {
	katering: UtensilsCrossed,
	dekorasi: Palette,
	fotografi: Camera,
	videografi: Video,
	florist: Flower,
	kue: Cake,
	souvenir: Gift,
	wo: ClipboardList,
	mc: Mic2,
	hiburan: Music2,
	mua: Sparkle,
	venue: Landmark,
	cetak_undangan: Printer,
	busana: Shirt,
	transportasi: Car,
};

export function getVendorIcon(category: string | undefined): IconComponent {
	if (!category) return Tag;
	return vendorIconMap[category] ?? Tag;
}
