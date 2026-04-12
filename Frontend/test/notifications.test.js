import {
  loadStoredNotifications,
  saveStoredNotifications,
  NOTIF_STORAGE_KEY,
  subscribeToNotificationUpdates,
  prependUserNotification,
} from "../src/utils/notifications";

describe("notifications storage", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it("seeds notifications when storage is empty", () => {
    const list = loadStoredNotifications(false);
    expect(Array.isArray(list)).toBe(true);
    expect(list.length).toBeGreaterThan(0);
    expect(list[0]).toMatchObject({ id: expect.any(String), message: expect.any(String) });
  });

  it("includes admin seed items when isAdmin is true", () => {
    const adminList = loadStoredNotifications(true);
    const userList = loadStoredNotifications(false);
    expect(adminList.length).toBeGreaterThan(userList.length);
  });

  it("parses stored JSON array", () => {
    const stored = [{ id: "x", message: "hello", timestamp: 1, type: "system", read: true }];
    localStorage.setItem(NOTIF_STORAGE_KEY, JSON.stringify(stored));
    expect(loadStoredNotifications(false)).toEqual(stored);
  });

  it("falls back to seed when JSON is not an array", () => {
    localStorage.setItem(NOTIF_STORAGE_KEY, JSON.stringify({ not: "array" }));
    const list = loadStoredNotifications(false);
    expect(list.some((n) => n.id === "n1")).toBe(true);
  });

  it("round-trips via saveStoredNotifications", () => {
    const list = [{ id: "z", message: "m", timestamp: 2, type: "alert", read: false }];
    saveStoredNotifications(list);
    expect(loadStoredNotifications(false)).toEqual(list);
  });

  it("subscribeToNotificationUpdates registers and cleans up", () => {
    const cb = jest.fn();
    const unsub = subscribeToNotificationUpdates(cb);
    window.dispatchEvent(new CustomEvent("walknearn-notifications-updated"));
    expect(cb).toHaveBeenCalledTimes(1);
    unsub();
    window.dispatchEvent(new CustomEvent("walknearn-notifications-updated"));
    expect(cb).toHaveBeenCalledTimes(1);
  });

  it("prepends a user notification and dispatches update event", () => {
    const spy = jest.spyOn(window, "dispatchEvent");
    localStorage.removeItem(NOTIF_STORAGE_KEY);
    prependUserNotification({ message: "Walk goal reached", type: "reward" });
    const list = JSON.parse(localStorage.getItem(NOTIF_STORAGE_KEY));
    expect(list[0].message).toBe("Walk goal reached");
    expect(list[0].read).toBe(false);
    expect(spy).toHaveBeenCalled();
    spy.mockRestore();
  });
});
