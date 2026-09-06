import {
	Heart,
	Flower2,
	Cake,
	Moon,
	Baby,
	PartyPopper,
	Building2,
	HandHeart,
	GraduationCap,
	CalendarDays,
	UtensilsCrossed,
	Palette,
	Camera,
	Video,
	Flower,
	Gift,
	ClipboardList,
	Mic2,
	Music2,
	Sparkle,
	Landmark,
	Printer,
	Shirt,
	Car,
	Tag,
	type Icon as IconType,
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
