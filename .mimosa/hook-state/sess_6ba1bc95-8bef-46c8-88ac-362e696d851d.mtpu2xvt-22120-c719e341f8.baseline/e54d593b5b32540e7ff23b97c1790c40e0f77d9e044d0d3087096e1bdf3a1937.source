import { relations } from 'drizzle-orm';
import { events } from './schema/events';
import { giftOrders, giftProducts } from './schema/gifts';
import { guests } from './schema/guests';
import { invitations } from './schema/invitations';
import { payments } from './schema/payments';
import { budgetItems, checklistItems, timelineItems } from './schema/planner';
import { profiles } from './schema/profiles';
import { vendors } from './schema/vendors';
import { wishes } from './schema/wishes';

export const profilesRelations = relations(profiles, ({ many }) => ({
	events: many(events),
	vendors: many(vendors),
}));

export const eventsRelations = relations(events, ({ one, many }) => ({
	owner: one(profiles, { fields: [events.ownerId], references: [profiles.id] }),
	invitation: one(invitations, { fields: [events.id], references: [invitations.eventId] }),
	guests: many(guests),
	wishes: many(wishes),
	budgetItems: many(budgetItems),
	checklistItems: many(checklistItems),
	timelineItems: many(timelineItems),
	giftOrders: many(giftOrders),
}));

export const invitationsRelations = relations(invitations, ({ one }) => ({
	event: one(events, { fields: [invitations.eventId], references: [events.id] }),
}));

export const guestsRelations = relations(guests, ({ one, many }) => ({
	event: one(events, { fields: [guests.eventId], references: [events.id] }),
	wishes: many(wishes),
}));

export const wishesRelations = relations(wishes, ({ one }) => ({
	event: one(events, { fields: [wishes.eventId], references: [events.id] }),
	guest: one(guests, { fields: [wishes.guestId], references: [guests.id] }),
}));

export const budgetItemsRelations = relations(budgetItems, ({ one }) => ({
	event: one(events, { fields: [budgetItems.eventId], references: [events.id] }),
	vendor: one(vendors, { fields: [budgetItems.vendorId], references: [vendors.id] }),
}));

export const checklistItemsRelations = relations(checklistItems, ({ one }) => ({
	event: one(events, { fields: [checklistItems.eventId], references: [events.id] }),
}));

export const timelineItemsRelations = relations(timelineItems, ({ one }) => ({
	event: one(events, { fields: [timelineItems.eventId], references: [events.id] }),
}));

export const vendorsRelations = relations(vendors, ({ one, many }) => ({
	owner: one(profiles, { fields: [vendors.ownerId], references: [profiles.id] }),
	products: many(giftProducts),
	budgetItems: many(budgetItems),
}));

export const giftProductsRelations = relations(giftProducts, ({ one, many }) => ({
	vendor: one(vendors, { fields: [giftProducts.vendorId], references: [vendors.id] }),
	orders: many(giftOrders),
}));

export const giftOrdersRelations = relations(giftOrders, ({ one }) => ({
	event: one(events, { fields: [giftOrders.eventId], references: [events.id] }),
	product: one(giftProducts, { fields: [giftOrders.productId], references: [giftProducts.id] }),
	payment: one(payments, { fields: [giftOrders.paymentId], references: [payments.id] }),
}));
