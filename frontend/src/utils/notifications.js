import { AUTH_ROLE_KEY } from "../services/auth";

export const NOTIF_STORAGE_KEY = "notifications";

const NOTIFY_EVENT = "walknearn-notifications-updated";

function seedNotifications(isAdmin) {
  const now = Date.now();
  const base = [
    {
      id: "n1",
      message: "You are #1 this week! You earned 1000 points 🎉",
      timestamp: now - 1000 * 60 * 40,
      type: "reward",
      read: false,
    },
    {
      id: "n2",
      message: "Reward redeemed successfully",
      timestamp: now - 1000 * 60 * 60 * 10,
      type: "system",
      read: true,
    },
    {
      id: "n3",
      message: "Keep walking to earn more points",
      timestamp: now - 1000 * 60 * 60 * 30,
      type: "alert",
      read: false,
    },
  ];

  if (!isAdmin) return base;
  return [
    {
      id: "a1",
      message: "User redeemed a reward",
      timestamp: now - 1000 * 60 * 15,
      type: "system",
      read: false,
    },
    {
      id: "a2",
      message: "New user registered",
      timestamp: now - 1000 * 60 * 60 * 6,
      type: "system",
      read: true,
    },
    ...base,
  ];
}

/**
 * @param {boolean} isAdmin
 */
export function loadStoredNotifications(isAdmin) {
  try {
    const raw = localStorage.getItem(NOTIF_STORAGE_KEY);
    if (!raw) return seedNotifications(isAdmin);
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : seedNotifications(isAdmin);
  } catch {
    return seedNotifications(isAdmin);
  }
}

/** @param {unknown[]} list */
export function saveStoredNotifications(list) {
  localStorage.setItem(NOTIF_STORAGE_KEY, JSON.stringify(list));
}

/**
 * Add an in-app notification (prepended) and refresh the Navbar bell.
 * @param {{ message: string; type?: string }} payload
 */
export function prependUserNotification({ message, type = "reward" }) {
  if (typeof window === "undefined") return;
  const isAdmin =
    localStorage.getItem(AUTH_ROLE_KEY) === "admin";
  let list = loadStoredNotifications(isAdmin);
  const n = {
    id: `n-${Date.now()}-${Math.random().toString(36).slice(2, 10)}`,
    message,
    timestamp: Date.now(),
    type,
    read: false,
  };
  list = [n, ...list];
  saveStoredNotifications(list);
  window.dispatchEvent(new CustomEvent(NOTIFY_EVENT));
}

export function subscribeToNotificationUpdates(callback) {
  if (typeof window === "undefined") return () => {};
  window.addEventListener(NOTIFY_EVENT, callback);
  return () => window.removeEventListener(NOTIFY_EVENT, callback);
}
