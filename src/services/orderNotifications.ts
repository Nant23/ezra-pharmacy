import type { Order } from '../types';

export const ORDER_NOTIFICATIONS_READ_EVENT = 'ezra_order_notifications_read';

const getStorageKey = (userId: string) => `ezra_order_updates_seen_${userId}`;
const getAdminOrdersStorageKey = (userId: string) => `ezra_admin_orders_seen_v2_${userId}`;

function getSeenVersions(userId: string): Record<string, string> {
  try {
    const stored = localStorage.getItem(getStorageKey(userId));
    return stored ? JSON.parse(stored) as Record<string, string> : {};
  } catch {
    return {};
  }
}

function getOrderVersion(order: Order): string {
  return `${order.status}:${order.updatedAt || ''}`;
}

function wasUpdatedAfterCreation(order: Order): boolean {
  const createdAt = Date.parse(order.createdAt);
  const updatedAt = Date.parse(order.updatedAt);
  return Number.isFinite(createdAt) && Number.isFinite(updatedAt) && updatedAt > createdAt;
}

export function getUnreadOrderUpdateCount(userId: string, orders: Order[]): number {
  const seenVersions = getSeenVersions(userId);

  return orders.filter(order => {
    const seenVersion = seenVersions[order.id];
    return seenVersion === undefined
      ? wasUpdatedAfterCreation(order)
      : seenVersion !== getOrderVersion(order);
  }).length;
}

export function markOrderUpdatesRead(userId: string, orders: Order[]): void {
  const seenVersions = getSeenVersions(userId);
  for (const order of orders) {
    seenVersions[order.id] = getOrderVersion(order);
  }

  try {
    localStorage.setItem(getStorageKey(userId), JSON.stringify(seenVersions));
    window.dispatchEvent(new Event(ORDER_NOTIFICATIONS_READ_EVENT));
  } catch {
    // Keep the current view usable when browser storage is unavailable.
  }
}

function getSeenAdminOrderIds(userId: string): string[] | null {
  try {
    const stored = localStorage.getItem(getAdminOrdersStorageKey(userId));
    if (stored === null) return null;
    const parsed: unknown = JSON.parse(stored);
    return Array.isArray(parsed) ? parsed.filter((id): id is string => typeof id === 'string') : [];
  } catch {
    return null;
  }
}

export function getUnreadAdminOrderCount(userId: string, orders: Order[]): number {
  const seenIds = getSeenAdminOrderIds(userId);
  if (seenIds === null) {
    markAdminOrdersRead(userId, orders);
    return 0;
  }

  const seenOrderIds = new Set(seenIds);
  return orders.filter(order => !seenOrderIds.has(order.id)).length;
}

export function markAdminOrdersRead(userId: string, orders: Order[]): void {
  try {
    const seenOrderIds = new Set(getSeenAdminOrderIds(userId) ?? []);
    for (const order of orders) seenOrderIds.add(order.id);
    localStorage.setItem(getAdminOrdersStorageKey(userId), JSON.stringify([...seenOrderIds]));
    window.dispatchEvent(new Event(ORDER_NOTIFICATIONS_READ_EVENT));
  } catch {
    // Keep the order list usable when browser storage is unavailable.
  }
}