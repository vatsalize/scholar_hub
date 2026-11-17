import { initialNotifications } from '../data/dummyData';

const NOTIFICATIONS_KEY = 'scholarhub_notifications';

const getStoredNotifications = () => {
  const data = localStorage.getItem(NOTIFICATIONS_KEY);
  if (!data) {
    localStorage.setItem(NOTIFICATIONS_KEY, JSON.stringify(initialNotifications));
    return initialNotifications;
  }
  return JSON.parse(data);
};

export const notificationService = {
  async getNotifications() {
    return getStoredNotifications();
  },

  async markAsRead(notificationId) {
    const list = getStoredNotifications();
    const updated = list.map(n => n.id === notificationId ? { ...n, read: true } : n);
    localStorage.setItem(NOTIFICATIONS_KEY, JSON.stringify(updated));
    return updated;
  },

  async markAllAsRead() {
    const list = getStoredNotifications();
    const updated = list.map(n => ({ ...n, read: true }));
    localStorage.setItem(NOTIFICATIONS_KEY, JSON.stringify(updated));
    return updated;
  },

  async clearAll() {
    localStorage.setItem(NOTIFICATIONS_KEY, JSON.stringify([]));
    return [];
  },

  async addNotification(notifData) {
    const list = getStoredNotifications();
    const newNotif = {
      id: `notif-${Date.now()}`,
      title: notifData.title,
      message: notifData.message,
      category: notifData.category || 'general',
      timestamp: 'Just now',
      read: false,
      link: notifData.link || '/dashboard'
    };
    const updated = [newNotif, ...list];
    localStorage.setItem(NOTIFICATIONS_KEY, JSON.stringify(updated));
    return newNotif;
  }
};

export default notificationService;
